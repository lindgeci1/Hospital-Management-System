const Stripe = require('stripe');
const crypto = require("crypto");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const generateEmailHtml = require('../../core/config/paymentDoneTemplate');
const IBillRepository = require("../../ports/PersistencePorts/IBillRepository");
const Bill = require("../../core/entities/Bill");
const Medicine = require("../../core/entities/Medicine");
const User = require("../../core/entities/User");
const Room = require("../../core/entities/Room");
const Visit = require("../../core/entities/Visits");
const PdfReport = require("../../core/entities/PdfReport");
const Patient = require("../../core/entities/Patient");
const Staff = require("../../core/entities/Staff");
const sequelize = require("../../core/config/database");
const { Op, Sequelize } = require("sequelize");
const Doctor = require('../../core/entities/Doctor');
class BillRepository extends IBillRepository {
    constructor() {
        super();
        this.Bill = Bill;
        this.Medicine = Medicine;
        this.Room = Room;
        this.Visit = Visit;
        this.PdfReport = PdfReport;
        this.Patient = Patient;
        this.Staff = Staff;
        this.Doctor = Doctor;
        this.sequelize = sequelize;
        Object.getOwnPropertyNames(IBillRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IBillRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async createPaymentIntent(amount, currency = 'USD', patientId, description) {
        try {
            const existingPendingBill = await this.Bill.findOne({
                where: { Patient_ID: patientId, Payment_Status: "pending" }
            });

            if (existingPendingBill) {
                throw new Error("This patient already has a pending payment. Please complete the existing payment before creating a new one.");
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                description,
                metadata: { patientId },
                automatic_payment_methods: { enabled: true, allow_redirects: "never" }
            });

            console.log("✅ Payment Intent Created:", paymentIntent.id);

            const newBill = await this.Bill.create({
                Date_Issued: null,
                Amount: amount / 100,
                Description: description,
                Payment_Status: "pending",
                Patient_ID: patientId,
                Stripe_PaymentIntent_ID: paymentIntent.id,
                Stripe_ClientSecret: paymentIntent.client_secret,
                Stripe_Status: "pending",
            });

            return {
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
                billId: newBill.Bill_ID,
                status: "pending"
            };
        } catch (error) {
            console.error("Error creating Payment Intent:", error);
            throw error;
        }
    }

    async confirmPayment(paymentIntentId, patientId, paymentMethodId) {
        try {
            if (!paymentMethodId) {
                throw new Error("Payment method is required to confirm the payment.");
            }

            const updateBillStatus = async () => {
                const updatedBill = await this.Bill.update(
                    { Payment_Status: "paid", Date_Issued: new Date(), Stripe_Status: "succeeded" },
                    { where: { Stripe_PaymentIntent_ID: paymentIntentId, Patient_ID: patientId } }
                );

                console.log("✅ Payment Processed. Bill updated.");

                setTimeout(async () => {
                    try {
                        const bill = await this.Bill.findOne({ where: { Stripe_PaymentIntent_ID: paymentIntentId, Patient_ID: patientId } });
                        if (bill) {
                            await this.delete(bill.Bill_ID);
                            console.log(`✅ Bill ID ${bill.Bill_ID} and related records deleted after 10 seconds.`);
                        } else {
                            console.log("❌ Bill not found for deletion.");
                        }
                    } catch (error) {
                        console.error("❌ Error deleting bill after 10 seconds:", error);
                    }
                }, 10000);

                return updatedBill;
            };

            if (paymentMethodId === "cash") {
                return await updateBillStatus();
            }

            await stripe.paymentIntents.update(paymentIntentId, { payment_method: paymentMethodId });
            const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

            if (confirmedPaymentIntent.status === "succeeded") {
                return await updateBillStatus();
            } else {
                throw new Error("❌ Payment not completed. Status: " + confirmedPaymentIntent.status);
            }
        } catch (error) {
            console.error("❌ Error confirming payment:", error);
            throw error;
        }
    }

    async sendPaymentConfirmationEmail(patientEmail, amount) {
        try {
            const patient = await this.findByPatientEmailforEmailSent(patientEmail);
            if (!patient) {
                console.error('Patient not found with email:', patientEmail);
                return;
            }

            const paymentDate = new Date().toLocaleDateString('en-GB');
            const patientName = `${patient.Patient_Fname} ${patient.Patient_Lname}`;
            const emailHtml = generateEmailHtml(patientName, amount, paymentDate);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: patientEmail,
                subject: 'Payment Confirmation',
                html: emailHtml
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
    async findAll() {
        try {
            console.log("Repository: Fetching all bills");
            const bills = await this.Bill.findAll({
                include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
            });
            console.log("Repository: All bills fetched:", bills);
            return bills;
        } catch (error) {
            console.error("Error fetching all bills:", error);
            throw error;
        }
    }

    async findByPatientEmail(email) {
        try {
            const patient = await this.Patient.findOne({ where: { Email: email } });
            if (!patient) throw new Error("Patient not found");

            return await this.Bill.findAll({
                where: { Patient_ID: patient.Patient_ID },
                include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
            });
        } catch (error) {
            console.error("Error finding bills by patient email:", error);
            throw error;
        }
    }

    async findByPatientEmailforEmailSent(email) {
        try {
            const patient = await this.Patient.findOne({
                where: { Email: email },
                attributes: ['Patient_ID', 'Patient_Fname', 'Patient_Lname', 'Email']
            });

            if (!patient) {
                throw new Error("Patient not found");
            }

            return patient;
        } catch (error) {
            console.error("Error finding patient by email for email sent:", error);
            throw error;
        }
    }

    async findByDoctorEmail(email) {
        try {
            const doctor = await this.Staff.findOne({ where: { Email: email } })
                .then(staff => this.Doctor.findOne({ where: { Emp_ID: staff.Emp_ID } }));
            const visits = await this.Visit.findAll({ where: { Doctor_ID: doctor.Doctor_ID } });
            const patientIds = visits.map(visit => visit.Patient_ID);

            return await this.Bill.findAll({
                where: { Patient_ID: patientIds },
                include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
            });
        } catch (error) {
            console.error("Error finding bills by doctor email:", error);
            throw error;
        }
    }

    async delete(billId) {
        const transaction = await this.sequelize.transaction();

        try {
            const bill = await this.Bill.findByPk(billId);
            if (!bill) return false;

            const patientId = bill.Patient_ID;
            const entities = [this.Bill, this.Visit, this.Room, this.Medicine, this.PdfReport];

            for (const entity of entities) {
                await entity.destroy({ where: { Patient_ID: patientId }, transaction });
            }

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
module.exports = new BillRepository();
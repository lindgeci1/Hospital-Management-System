const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');
const nodemailer = require('nodemailer');
const pdfTemplate = require('../../core/config/reportTemplate');
const emailTemplate = require('../../core/config/reportEmailTemplate');
const PdfReport = require('../../core/entities/PdfReport');
require('dotenv').config();
const Report = require('../../core/entities/PdfReport');
const Staff = require('../../core/entities/Staff');
const outputFilePath = path.join(__dirname, '../../core/config/result.pdf');
const Doctor = require('../../core/entities/Doctor');
const Patient = require('../../core/entities/Patient');
const sequelize = require('../../core/config/database'); 
const Bill = require('../../core/entities/Bill'); 
const Visit = require('../../core/entities/Visits');
const IReportRepository = require("../../ports/PersistencePorts/IReportRepository");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});


class ReportRepository extends IReportRepository{
    constructor() {
        super();
        this.Visit = Visit;
        this.Patient = Patient;
        this.Doctor = Doctor;
        this.Staff = Staff;
        this.PdfReport = PdfReport;
        this.Bill = Bill;
        this.sequelize = sequelize;
        Object.getOwnPropertyNames(IReportRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IReportRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async getPatientByEmail(email) {
        const patient = await Patient.findOne({ where: { Email: email } });
        if (!patient) throw new Error('Patient not found');
        return patient;
    }

    async getDoctorByEmail(email) {
        const staff = await Staff.findOne({ where: { Email: email } });
        if (!staff) throw new Error('Staff member not found');

        const doctor = await Doctor.findOne({ where: { Emp_ID: staff.Emp_ID } });
        if (!doctor) throw new Error('Doctor not found');

        return doctor;
    }

    async fetchReportsFromDB(req, res) {
        try {
            const { email: userEmail, role: userRole } = req.user;
            let reports = [];
            let visits = [];

            if (userRole === 'admin') {
                reports = await PdfReport.findAll({ include: [{ model: Patient }] });
            } else if (userRole === 'doctor') {
                const doctor = await this.getDoctorByEmail(userEmail);
                visits = await Visit.findAll({
                    where: { Doctor_ID: doctor.Doctor_ID },
                    include: [{ model: Patient }],
                });
                const patientIds = visits.map(visit => visit.Patient_ID);
                reports = await PdfReport.findAll({
                    where: { Patient_ID: patientIds },
                    include: [{ model: Patient }],
                });
            } else {
                return res.status(403).json({ error: 'Forbidden' });
            }

            res.json({ reports, visits });
        } catch (error) {
            console.error('Error fetching reports and visits from database:', error);
            res.status(500).json({ error: 'Error fetching reports and visits from database' });
        }
    }

    async findAllReports(req, res) {
        try {
            const { email: userEmail, role: userRole } = req.user;
            let reports;

            if (userRole === 'admin') {
                reports = await PdfReport.findAll({ include: [{ model: Patient }] });
            } else if (userRole === 'patient') {
                const patient = await this.getPatientByEmail(userEmail);
                reports = await PdfReport.findAll({
                    where: { Patient_ID: patient.Patient_ID },
                    include: [{ model: Patient }],
                });
            } else if (userRole === 'doctor') {
                const doctor = await this.getDoctorByEmail(userEmail);
                reports = await PdfReport.findAll({
                    include: [{ model: Patient, where: { Doctor_ID: doctor.Doctor_ID } }],
                });
            } else {
                return res.status(403).json({ error: 'Forbidden' });
            }

            const reportsData = reports.map(report => {
                const reportJson = report.toJSON();
                return {
                    Report_ID: reportJson.Report_ID,
                    personal_number: reportJson.personal_number,
                    created_at: reportJson.created_at,
                    Patient_ID: reportJson.Patient_ID,
                    Patient: {
                        Patient_ID: reportJson.Patient.Patient_ID,
                        Personal_Number: reportJson.Patient.Personal_Number,
                        Patient_Fname: reportJson.Patient.Patient_Fname,
                        Birth_Date: reportJson.Patient.Birth_Date,
                        Patient_Lname: reportJson.Patient.Patient_Lname,
                        // Blood_type: reportJson.Patient.Blood_type,
                        Email: reportJson.Patient.Email,
                        Gender: reportJson.Patient.Gender,
                        Phone: reportJson.Patient.Phone,
                    },
                    Patient_Name: `${reportJson.Patient.Patient_Fname} ${reportJson.Patient.Patient_Lname}`
                };
            });

            res.json(reportsData);
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async checkPatientReport(req, res) {
        const { patientId } = req.params;
        try {
            const reports = await PdfReport.findAll({ where: { Patient_ID: patientId } });
            res.status(200).json({ hasReport: reports.length > 0 });
        } catch (error) {
            console.error('Error checking patient report:', error);
            res.status(500).json({ error: 'Error checking patient report', message: error.message });
        }
    }

    async createPdf(req, res) {
        try {
            const {
                personalNumber, patientName, age, patientGender, bloodType, Time, doctorEmail,
                doctorName, email, phone, condition, therapy, dateOfVisit, roomCost, medicineCost
            } = req.body;

            const htmlContent = pdfTemplate({
                personalNumber, patientName, age, patientGender, bloodType, Time, doctorEmail,
                doctorName, email, phone, condition, therapy, dateOfVisit, roomCost, medicineCost
            });

            const document = {
                html: htmlContent,
                data: {},
                path: outputFilePath,
            };

            const options = {
                format: 'A4',
                orientation: 'portrait',
                border: '10mm',
            };

            await pdf.create(document, options);

            if (!fs.existsSync(outputFilePath)) {
                throw new Error('PDF file was not created');
            }

            res.status(200).sendFile(outputFilePath);
        } catch (error) {
            console.error('Error creating PDF:', error);
            res.status(500).send(`Error creating PDF: ${error.message}`);
        }
    }

    async sendEmailWithPdf(req, res) {
        try {
            const { email, patientName, roomCost, medicineCost } = req.body;

            if (!fs.existsSync(outputFilePath)) {
                throw new Error('PDF file not found');
            }
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: `${patientName}'s Report`,
                html: emailTemplate(patientName, process.env.GMAIL_USER),
                attachments: [
                    {
                        filename: 'patient_report.pdf',
                        path: outputFilePath,
                    },
                ],
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.status(500).send('Error sending email');
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).send('Email sent');
                }
            });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send(`Error sending email: ${error.message}`);
        }
    }

    async saveReportToDB(req, res) {
        try {
            const { personalNumber, Patient_ID: patientId, roomCost, medicineCost } = req.body;

            if (!req.files || !req.files.report) {
                throw new Error('PDF report file is missing');
            }

            if (!patientId) {
                throw new Error('Patient_ID is required');
            }

            const pdfReportData = req.files.report.data;

            const pdfReport = await PdfReport.create({
                personal_number: personalNumber,
                report: pdfReportData,
                Patient_ID: patientId,
                room_cost: roomCost,
                M_cost: medicineCost
            });

            res.status(200).json({ message: 'Report saved to database successfully', pdfReport });
        } catch (error) {
            console.error('Error saving report to database:', error);
            res.status(500).json({ error: 'Error saving report to database', message: error.message });
        }
    }

    async deleteReport(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const report = await Report.findOne({
                where: { Report_ID: req.params.id },
                transaction
            });

            if (!report) {
                return res.status(404).json({ error: 'Report not found' });
            }

            const patientId = report.Patient_ID;

            await Bill.destroy({
                where: { Patient_ID: patientId },
                transaction
            });

            await Report.destroy({
                where: { Report_ID: req.params.id },
                transaction
            });

            await transaction.commit();

            res.json({ success: true, message: 'Report and associated bill deleted successfully' });
        } catch (error) {
            await transaction.rollback();
            console.error('Error deleting report or bill:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new ReportRepository();
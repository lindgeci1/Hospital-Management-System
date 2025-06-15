// InsuranceRepository.js
const Insurance = require("../../core/entities/Insurance");
const Patient = require("../../core/entities/Patient");
const Staff = require("../../core/entities/Staff");
const Visit = require("../../core/entities/Visits");
const PdfReport = require("../../core/entities/PdfReport"); // If relevant for insurance
const sequelize = require("../../core/config/database");
const { Op } = require("sequelize");
const Doctor = require('../../core/entities/Doctor');
const IInsuranceRepository = require("../../ports/PersistencePorts/IInsuranceRepository");


class InsuranceRepository extends IInsuranceRepository{
    constructor() {
        super();
        this.Insurance = Insurance;
        this.Patient = Patient;
        this.Staff = Staff;
        this.Visit = Visit;
        this.PdfReport = PdfReport; // If you need to handle PDF reports for insurance
        this.sequelize = sequelize;
        this.Doctor = Doctor;
        Object.getOwnPropertyNames(IInsuranceRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IInsuranceRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAll() {
        console.log("Repository: Fetching all insurances");
        const insurances = await this.Insurance.findAll({
            include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
        });
        console.log("Repository: All insurances fetched:", insurances);
        return insurances;
    }

    async findByPatientEmail(email) {
        const patient = await this.Patient.findOne({ where: { Email: email } });
        if (!patient) throw new Error("Patient not found");
        return await this.Insurance.findAll({
            where: { Patient_ID: patient.Patient_ID },
            include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
        });
    }

    async findByDoctorEmail(email) {
        const doctor = await this.Staff.findOne({ where: { Email: email } })
            .then(staff => this.Doctor.findOne({ where: { Emp_ID: staff.Emp_ID } }));
        const visits = await this.Visit.findAll({ where: { Doctor_ID: doctor.Doctor_ID } });
        const patientIds = visits.map(visit => visit.Patient_ID);

        return await this.Insurance.findAll({
            where: { Patient_ID: patientIds },
            include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
        });
    }

    async findById(insuranceId) {
        return await this.Insurance.findByPk(insuranceId, { include: [this.Patient] });
    }

    async findByPatientId(patientId) {
        return await this.Insurance.findOne({ where: { Patient_ID: patientId } });
    }

    async findOtherInsuranceByPolicyNumber(policyNumber) {
        return await this.Insurance.findOne({ where: { Ins_Code: policyNumber } });
    }

    async create(insuranceData) {
        const { Patient_ID } = insuranceData;

        if (!Patient_ID) {
            throw new Error('Patient ID is required to create insurance.');
        }

        try {
            const existingInsurance = await this.Insurance.findOne({ where: { Patient_ID } });
            if (existingInsurance) {
                throw new Error('This patient already has an insurance record.');
            }

            const newInsurance = await this.Insurance.create(insuranceData);
            console.log("Repository: New insurance record created:", newInsurance);
            return newInsurance;
        } catch (error) {
            console.error("Error creating insurance record:", error);
            throw error;
        }
    }

    async findCoverageByPatientId(patientId) {
        // Make sure that your Insurance model is correctly imported and Patient_ID is the correct column name.
        const insurance = await this.Insurance.findOne({
          where: { Patient_ID: patientId },
          attributes: ['Coverage'], // Ensure this matches your database column name
        });
      
        if (!insurance) {
          throw new Error('Insurance record not found for the given patient ID.');
        }
        return insurance.Coverage;
      }

    async update(insuranceId, insuranceData) {
        const { Patient_ID } = insuranceData;

        if (!Patient_ID) {
            throw new Error('Patient ID is required to update insurance.');
        }

        try {
            const existingInsurance = await this.Insurance.findOne({
                where: {
                    Patient_ID,
                    Policy_Number: { [Op.ne]: insuranceId }
                }
            });
            if (existingInsurance) {
                throw new Error('Another insurance record already exists for this patient.');
            }

            const [updatedRows] = await this.Insurance.update(insuranceData, { where: { Policy_Number: insuranceId } });
            if (updatedRows === 0) throw new Error("Insurance record not found or not updated");

            console.log("Repository: Insurance record updated:", updatedRows);
            return updatedRows;
        } catch (error) {
            console.error("Error updating insurance record:", error);
            throw error;
        }
    }

    async delete(insuranceId) {
        const transaction = await this.sequelize.transaction();

        try {
            const insurance = await this.Insurance.findByPk(insuranceId);
            if (!insurance) return false;

            await this.Insurance.destroy({ where: { Policy_Number: insuranceId }, transaction });

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new InsuranceRepository();
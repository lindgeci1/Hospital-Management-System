const Visit = require('../../core/entities/Visits');
const Patient = require('../../core/entities/Patient');
const Doctor = require('../../core/entities/Doctor');
const Staff = require('../../core/entities/Staff');
const { Op } = require('sequelize');
const Room = require('../../core/entities/Room');
const Medicine = require('../../core/entities/Medicine');
const PdfReport = require('../../core/entities/PdfReport');
const Bill = require('../../core/entities/Bill');
const sequelize = require('../../core/config/database');
const IVisitRepository = require("../../ports/PersistencePorts/IVisitRepository");


class VisitRepository extends IVisitRepository{
    constructor() {
        super();
        this.Visit = Visit;
        this.Patient = Patient;
        this.Doctor = Doctor;
        this.Staff = Staff;
        this.Room = Room;
        this.Medicine = Medicine;
        this.PdfReport = PdfReport;
        this.Bill = Bill;
        this.sequelize = sequelize;
        Object.getOwnPropertyNames(IVisitRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IVisitRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAll(user) {
        const { email, role } = user;
        let condition = {};

        if (role === 'patient') {
            const patient = await this.findByPatientEmail(email);
            condition = { Patient_ID: patient.Patient_ID };
        } else if (role === 'doctor') {
            const doctor = await this.findByDoctorEmail(email);
            condition = { Doctor_ID: doctor.Doctor_ID };
        }

        return await this.Visit.findAll({
            where: condition,
            include: [
                { model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] },
                { model: this.Doctor, include: [{ model: this.Staff, attributes: ['Emp_Fname', 'Emp_Lname', 'Email'] }] }
            ]
        });
    }

    async findById(visitId) {
        return await this.Visit.findByPk(visitId, {
            include: [
                { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                { model: Doctor, attributes: ['Doctor_ID'], include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }] }
            ]
        });
    }

    async findByPatientId(patientId) {
        return await this.Visit.findAll({
            where: { Patient_ID: patientId },
            include: [
                { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                { model: Doctor, include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }] }
            ]
        });
    }

    async createVisit(visitData) {
        const { Patient_ID, Doctor_ID, date_of_visit, condition, Time, therapy } = visitData;

        const patient = await this.Patient.findByPk(Patient_ID);
        const doctor = await this.Doctor.findByPk(Doctor_ID);
        
        if (!patient) throw new Error("Patient not found");
        if (!doctor) throw new Error("Doctor not found");

        const visitDate = new Date(date_of_visit);
        if (visitDate < new Date().setHours(0, 0, 0, 0)) {
            throw new Error("Cannot schedule a visit in the past");
        }

        const existingVisit = await this.Visit.findOne({ where: { Patient_ID } });
        if (existingVisit) {
            throw new Error("This patient already has a visit record.");
        }

        const existingAppointment = await this.Visit.findOne({
            where: { Doctor_ID, date_of_visit: visitDate, Time }
        });
        if (existingAppointment) {
            throw new Error("Doctor is busy at this time, please choose another date or time.");
        }

        return await this.Visit.create({ Patient_ID, Doctor_ID, date_of_visit: visitDate, condition, Time, therapy });
    }

    async updateVisit(visitId, visitData) {
        const { Patient_ID, Doctor_ID, date_of_visit, condition, Time, therapy } = visitData;
    
        const visitRecord = await this.Visit.findByPk(visitId);
        if (!visitRecord) throw new Error("Visit not found");
    
        const visitDate = new Date(date_of_visit);
        if (visitDate < new Date().setHours(0, 0, 0, 0)) {
            throw new Error("Cannot update to a date in the past");
        }
    
        if (visitRecord.Patient_ID !== Patient_ID) {
            const existingVisit = await this.Visit.findOne({
                where: {
                    Patient_ID,
                    Visit_ID: { [Op.ne]: visitId }
                }
            });
            if (existingVisit) {
                throw new Error("This patient already has a visit record.");
            }
        }
    
        if (
            visitRecord.Doctor_ID !== Doctor_ID ||
            visitRecord.date_of_visit !== date_of_visit ||
            visitRecord.Time !== Time
        ) {
            const conflict = await this.Visit.findOne({
                where: {
                    Doctor_ID,
                    date_of_visit: visitDate,
                    Time,
                    Visit_ID: { [Op.ne]: visitId }
                }
            });
            if (conflict) {
                throw new Error("Doctor is busy at this time, please choose another date or time.");
            }
        }
    
        const [updatedRows] = await this.Visit.update(
            { Patient_ID, Doctor_ID, date_of_visit: visitDate, condition, Time, therapy },
            { where: { Visit_ID: visitId } }
        );
        
        if (updatedRows === 0) {
            throw new Error("Visit not found or no changes were made");
        }
    
        return { success: true, message: "Visit updated successfully" };
    }

    async delete(visitId) {
        const transaction = await this.sequelize.transaction();

        try {
            const visit = await this.Visit.findByPk(visitId);
            if (!visit) return false;

            const patientId = visit.Patient_ID;

            await this.Room.destroy({ where: { Patient_ID: patientId }, transaction });
            await this.Medicine.destroy({ where: { Patient_ID: patientId }, transaction });
            await this.PdfReport.destroy({ where: { Patient_ID: patientId }, transaction });
            await this.Bill.destroy({ where: { Patient_ID: patientId }, transaction });

            await this.Visit.destroy({ where: { Visit_ID: visitId }, transaction });

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findByPatientEmail(email) {
        const patient = await this.Patient.findOne({ where: { Email: email } });
        if (!patient) throw new Error('Patient not found');
        return patient;
    }

    async findByDoctorEmail(email) {
        const staff = await this.Staff.findOne({ where: { Email: email } });
        if (!staff) throw new Error('Staff member not found');

        const doctor = await this.Doctor.findOne({ where: { Emp_ID: staff.Emp_ID } });
        if (!doctor) throw new Error('Doctor not found');

        return doctor;
    }

    async findVisitsByPatientId(patientId) {
        return await this.Visit.findAll({
            where: { Patient_ID: patientId },
            include: [
                { 
                    model: this.Patient, 
                    attributes: ['Patient_Fname', 'Patient_Lname', 'Personal_Number', 'Birth_Date', 'Email', 'Gender', 'Phone'] 
                },
                { 
                    model: this.Doctor, 
                    attributes: ['Doctor_ID'], 
                    include: [{ model: this.Staff, attributes: ['Emp_Fname', 'Emp_Lname', 'Email'] }] 
                }
            ]
        });
    }
}

module.exports = new VisitRepository();
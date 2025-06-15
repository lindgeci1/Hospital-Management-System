const Patient = require('../../core/entities/Patient');
const { Op } = require('sequelize');
const Visit = require('../../core/entities/Visits');
const User = require('../../core/entities/User');
const Room = require('../../core/entities/Room');
const Medicine = require('../../core/entities/Medicine');
const IPatientRepository = require("../../ports/PersistencePorts/IPatientRepository");



class PatientRepository extends IPatientRepository {
    constructor() {
        super();
        this.Patient = Patient;
        this.User = User;
        this.Room = Room;
        this.Medicine = Medicine;
        this.Visit = Visit;
        Object.getOwnPropertyNames(IPatientRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IPatientRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async getPatientByEmail(email) {
        try {
            const patient = await this.Patient.findOne({ where: { Email: email } });
            if (!patient) throw new Error('Patient not found');
            return patient;
        } catch (error) {
            console.error('Error fetching patient by email:', error);
            throw error;
        }
    }

    async findAllPatients(userEmail, userRole) {
        try {
            let patients;
            if (userRole === 'admin' || userRole === 'doctor') {
                patients = await this.Patient.findAll();
            } else if (userRole === 'patient') {
                const patient = await this.getPatientByEmail(userEmail);
                patients = await this.Patient.findAll({ where: { Email: patient.Email } });
            } else {
                throw new Error('Forbidden');
            }

            return patients.map(patient => ({
                ...patient.toJSON(),
                Patient_Name: `${patient.Patient_Fname} ${patient.Patient_Lname}`
            }));
        } catch (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }
    }

    async findSinglePatient(patientId) {
        try {
            const patient = await this.Patient.findByPk(patientId);
            if (!patient) throw new Error('Patient not found');
            return patient;
        } catch (error) {
            console.error('Error fetching single patient:', error);
            throw error;
        }
    }

    async addPatient(patientData) {
        try {
            const { Personal_Number, Email, Phone } = patientData;

            const existingPatient = await this.Patient.findOne({
                where: { [Op.or]: [{ Email }, { Phone }, { Personal_Number }] }
            });

            if (existingPatient) throw new Error('Email, phone number, or personal number already exists');

            const user = await this.User.findOne({ where: { email: Email } });
            if (!user) throw new Error('No user found with the provided email');
            // return await this.Patient.create({
            //     ...patientData,
            //     user_id: user.user_id
            // });
        } catch (error) {
            console.error('Error adding patient:', error);
            throw error;
        }
    }

    async updatePatient(patientId, patientData) {
        try {
            const existingPatient = await this.Patient.findOne({
                where: {
                    [Op.or]: [
                        { Email: patientData.Email },
                        { Phone: patientData.Phone },
                        { Personal_Number: patientData.Personal_Number }
                    ],
                    Patient_ID: { [Op.ne]: patientId }
                }
            });

            if (existingPatient) throw new Error('Email, phone number, or personal number already exists for another patient');

            const [updated] = await this.Patient.update(patientData, { where: { Patient_ID: patientId } });
            if (updated === 0) throw new Error('Patient not found or not updated');
            return true;
        } catch (error) {
            console.error('Error updating patient:', error);
            throw error;
        }
    }

    async deletePatient(patientId) {
        try {
            const patient = await this.Patient.findOne({ where: { Patient_ID: patientId } });
            if (!patient) throw new Error('Patient not found');

            await this.Patient.destroy({ where: { Patient_ID: patientId } });
            await this.User.destroy({ where: { email: patient.Email } });
            return true;
        } catch (error) {
            console.error('Error deleting patient and user:', error);
            throw error;
        }
    }

    async checkPatientExistence(patientId) {
        try {
            const patient = await this.Patient.findByPk(patientId);
            if (!patient) throw new Error('Patient not found');
            return true;
        } catch (error) {
            console.error('Error checking patient existence:', error);
            throw error;
        }
    }

    async findPatientByPersonalNumber(personalNumber) {
        try {
            const patient = await this.Patient.findOne({ where: { Personal_Number: personalNumber } });
            if (!patient) throw new Error('Patient not found');
            return patient;
        } catch (error) {
            console.error('Error fetching patient by personal number:', error);
            throw error;
        }
    }

    async findMedicineCostByPatientId(patientId) {
        try {
            const medicines = await this.Medicine.findAll({ where: { Patient_ID: patientId } });

            if (!medicines.length) {
                throw new Error('No medicines found for this patient');
            }

            const costs = medicines.map(medicine => medicine.M_Cost);
            return { costs };
        } catch (error) {
            console.error('Error fetching medicine cost:', error);
            throw new Error('Internal Server Error');
        }
    }

    async findRoomCostByPatientId(patientId) {
        try {
            const room = await this.Room.findOne({ where: { Patient_ID: patientId } });

            if (!room) {
                throw new Error('Room not found for this patient');
            }
            return { Room_Cost: room.Room_cost };
        } catch (error) {
            console.error('Error fetching room cost:', error);
            throw new Error('Internal Server Error');
        }
    }

    async findEmailByPatientId(patientId) {
        try {
            const patient = await this.Patient.findByPk(patientId, { attributes: ['Email'] });
            if (!patient) throw new Error('Patient not found');
            return patient.Email;
        } catch (error) {
            console.error('Error fetching patient email by ID:', error);
            throw error;
        }
    }

    async checkPatientVisit(patientId) {
        try {
            const visit = await this.Visit.findOne({ where: { Patient_ID: patientId } });
            return !!visit;
        } catch (error) {
            console.error('Error checking patient visit:', error);
            throw error;
        }
    }
}

module.exports = new PatientRepository();
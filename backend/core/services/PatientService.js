// PatientService.js
const PatientRepository = require("../../adapters/repositories/PatientRepository");
const IPatientRepository = require("../../ports/ServicePorts/IPatientService");

class PatientService extends IPatientRepository {
    constructor(patientRepository) {
        super();
        this.patientRepository = patientRepository;
        Object.getOwnPropertyNames(IPatientRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IPatientRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAllPatients(user) {
        const { email, role } = user;
        return await this.patientRepository.findAllPatients(email, role);
    }

    async findSinglePatient(patientId) {
        return await this.patientRepository.findSinglePatient(patientId);
    }

    async addPatient(patientData) {
        const { Personal_Number, Patient_Fname, Patient_Lname, Joining_Date, Birth_Date, Email, Gender, Phone } = patientData;
        const personalNumberStr = String(Personal_Number);

        const personalNumberRegex = /^\d{10}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\d{9}$/;
        const bloodTypeRegex = /^(A|B|AB|O)[+-]$/;

        if (
            !personalNumberStr.match(personalNumberRegex) ||
            !Patient_Fname ||
            !Patient_Lname ||
            !Birth_Date ||
            !Joining_Date ||
            !Email.match(emailRegex) ||
            !Gender ||
            !Phone.match(phoneRegex)
        ) {
            throw new Error('Invalid input data');
        }
        return await this.patientRepository.addPatient(patientData);
    }

    async updatePatient(patientId, patientData) {
        const { Personal_Number, Patient_Fname, Patient_Lname, Joining_Date, Birth_Date, Email, Gender, Phone } = patientData;
        const personalNumberStr = String(Personal_Number);

        const personalNumberRegex = /^\d{10}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\d{9}$/;
        const bloodTypeRegex = /^(A|B|AB|O)[+-]$/;

        if (Personal_Number && !personalNumberStr.match(personalNumberRegex)) {
            throw new Error('Invalid Personal Number. It should be a 10-digit number.');
        }

        if (!Patient_Fname) {
            throw new Error('First Name (Patient_Fname) is required.');
        }

        if (!Patient_Lname) {
            throw new Error('Last Name (Patient_Lname) is required.');
        }

        if (!Birth_Date) {
            throw new Error('Birth Date (Birth_Date) is required.');
        }
        if (Email && !Email.match(emailRegex)) {
            throw new Error('Invalid Email format.');
        }

        if (!Joining_Date) {
            throw new Error('Joining_Date is required.');
        }

        if (!Gender) {
            throw new Error('Gender is required.');
        }

        if (Phone && !Phone.match(phoneRegex)) {
            throw new Error('Invalid Phone number. It should be exactly 9 digits.');
        }

        return await this.patientRepository.updatePatient(patientId, patientData);
    }

    async deletePatient(patientId) {
        return await this.patientRepository.deletePatient(patientId);
    }

    async checkPatientExistence(patientId) {
        return await this.patientRepository.checkPatientExistence(patientId);
    }

    async findPatientByPersonalNumber(personalNumber) {
        return await this.patientRepository.findPatientByPersonalNumber(personalNumber);
    }

    async findRoomCostByPatientId(patientId) {
        try {
            return await this.patientRepository.findRoomCostByPatientId(patientId);
        } catch (error) {
            console.error('Error in service while fetching room cost:', error);
            throw new Error('Failed to fetch room cost');
        }
    }

    async findMedicineCostByPatientId(patientId) {
        try {
            return await this.patientRepository.findMedicineCostByPatientId(patientId);
        } catch (error) {
            console.error('Error in service while fetching medicine cost:', error);
            throw new Error('Failed to fetch medicine cost');
        }
    }

    async findEmailByPatientId(patientId) {
        return await this.patientRepository.findEmailByPatientId(patientId);
    }

    async checkPatientVisit(patientId) {
        return await this.patientRepository.checkPatientVisit(patientId);
    }
}

module.exports = new PatientService(PatientRepository);
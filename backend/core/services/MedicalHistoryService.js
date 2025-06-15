const MedicalHistoryRepository = require("../../adapters/repositories/MedicalHistoryRepository");
const IMedicalHistoryService = require("../../ports/ServicePorts/IMedicalHistoryService");  
class MedicalHistoryService extends IMedicalHistoryService{
    constructor(medicalHistoryRepository) {
        super();
        this.medicalHistoryRepository = medicalHistoryRepository;
        Object.getOwnPropertyNames(IMedicalHistoryService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IMedicalHistoryService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAllMedicalHistories(user) {
        console.log("Service: Finding all medical histories for user:", user);
        const { email, role } = user;
        switch (role) {
            case "admin":
                return await this.medicalHistoryRepository.findAll();
            case "doctor":
                return await this.medicalHistoryRepository.findByDoctorEmail(email);
            case "patient":
                return await this.medicalHistoryRepository.findByPatientEmail(email);
            default:
                throw new Error("Unauthorized access");
        }
    }

    async findSingleMedicalHistory(medicalHistoryId) {
        return await this.medicalHistoryRepository.findById(medicalHistoryId);
    }

    async addMedicalHistory(medicalHistoryData) {
        const { Patient_ID, Allergies, Pre_Conditions } = medicalHistoryData;

        if (!Patient_ID || !Allergies || !Pre_Conditions) {
            throw new Error("Patient ID, Allergies, and Pre-Conditions are required.");
        }

        return await this.medicalHistoryRepository.create(medicalHistoryData);
    }

    async updateMedicalHistory(medicalHistoryId, medicalHistoryData) {
        const { Patient_ID, Allergies, Pre_Conditions } = medicalHistoryData;

        if (!Patient_ID || !Allergies || !Pre_Conditions) {
            throw new Error("Patient ID, Allergies, and Pre-Conditions are required.");
        }

        return await this.medicalHistoryRepository.update(medicalHistoryId, medicalHistoryData);
    }

    async deleteMedicalHistory(medicalHistoryId) {
        return await this.medicalHistoryRepository.delete(medicalHistoryId);
    }
}

module.exports = new MedicalHistoryService(MedicalHistoryRepository);

const EmergencyContactRepository = require("../../adapters/repositories/Emergency_ContactRepository");
const IEmergencyContactService = require("../../ports/ServicePorts/IEmergencyContactService");

class EmergencyContactService extends IEmergencyContactService{
    constructor(emergencyContactRepository) {
        super();
        this.emergencyContactRepository = emergencyContactRepository;
        Object.getOwnPropertyNames(IEmergencyContactService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IEmergencyContactService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAllEmergencyContacts(user) {
        console.log("Service: Finding all emergency contacts for user:", user);
        const { email, role } = user;
        if (role === "admin") {
            return await this.emergencyContactRepository.findAll();
        } else if (role === "patient") {
            return await this.emergencyContactRepository.findByPatientEmail(email);
        } else {
            throw new Error("Unauthorized access");
        }
    }

    async findSingleEmergencyContact(contactId) {
        return await this.emergencyContactRepository.findById(contactId);
    }

    async addEmergencyContact(contactData) {
        const { Patient_ID, Contact_Name, Phone, Relation } = contactData;

        if (!Patient_ID || !Contact_Name || !Phone || !Relation) {
            throw new Error("Patient ID, Contact Name, Phone, and Relation are required");
        }

        return await this.emergencyContactRepository.create(contactData);
    }

    async updateEmergencyContact(contactId, contactData) {
        const { Patient_ID, Contact_Name, Phone, Relation } = contactData;

        if (!Patient_ID || !Contact_Name || !Phone || !Relation) {
            throw new Error("Patient ID, Contact Name, Phone, and Relation are required");
        }

        return await this.emergencyContactRepository.update(contactId, contactData);
    }

    async deleteEmergencyContact(contactId) {
        return await this.emergencyContactRepository.delete(contactId);
    }
}

module.exports = new EmergencyContactService(EmergencyContactRepository);

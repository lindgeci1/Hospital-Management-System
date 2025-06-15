const EmergencyContactService = require("../../../core/services/Emergency_ContactService");

class EmergencyContactController {
    constructor(emergencyContactService) {
        this.emergencyContactService = emergencyContactService;
    }
    async findAllEmergencyContacts(req, res) {
        console.log("Fetching emergency contacts for user:", req.user);
        try {
            const emergencyContacts = await this.emergencyContactService.findAllEmergencyContacts(req.user);
            res.status(200).json(emergencyContacts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findSingleEmergencyContact(req, res) {
        try {
            const emergencyContact = await this.emergencyContactService.findSingleEmergencyContact(req.params.id);
            if (!emergencyContact) {
                return res.status(404).json({ message: "Emergency contact not found" });
            }
            res.status(200).json(emergencyContact);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addEmergencyContact(req, res) {
        try {
            const newEmergencyContact = await this.emergencyContactService.addEmergencyContact(req.body);
            res.status(201).json(newEmergencyContact);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateEmergencyContact(req, res) {
        try {
            const updatedEmergencyContact = await this.emergencyContactService.updateEmergencyContact(req.params.id, req.body);
            if (!updatedEmergencyContact) {
                return res.status(404).json({ message: "Emergency contact not found or could not be updated" });
            }
            res.status(200).json(updatedEmergencyContact);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteEmergencyContact(req, res) {
        try {
            const deletedEmergencyContact = await this.emergencyContactService.deleteEmergencyContact(req.params.id);
            if (!deletedEmergencyContact) {
                return res.status(404).json({ message: "Emergency contact not found" });
            }
            res.status(204).send(); // No content to send back
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new EmergencyContactController(EmergencyContactService);
class IEmergencyContactService {
    async findAllEmergencyContacts(user) {
        try {
            console.log(`Internal: findAllEmergencyContacts called with user: ${JSON.stringify(user)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAllEmergencyContacts: ${error.message}`);
        }
    }

    async findSingleEmergencyContact(contactId) {
        try {
            console.log(`Internal: findSingleEmergencyContact called with contactId: ${contactId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findSingleEmergencyContact: ${error.message}`);
        }
    }

    async addEmergencyContact(contactData) {
        try {
            console.log(`Internal: addEmergencyContact called with contactData: ${JSON.stringify(contactData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in addEmergencyContact: ${error.message}`);
        }
    }

    async updateEmergencyContact(contactId, contactData) {
        try {
            console.log(`Internal: updateEmergencyContact called with contactId: ${contactId}, contactData: ${JSON.stringify(contactData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in updateEmergencyContact: ${error.message}`);
        }
    }

    async deleteEmergencyContact(contactId) {
        try {
            console.log(`Internal: deleteEmergencyContact called with contactId: ${contactId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deleteEmergencyContact: ${error.message}`);
        }
    }
}

module.exports = IEmergencyContactService;

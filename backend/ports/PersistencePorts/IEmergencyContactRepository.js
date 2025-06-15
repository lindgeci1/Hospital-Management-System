class IEmergencyContactRepository {
    async create(data) {
        try {
            console.log(`Method: create called with data: ${JSON.stringify(data)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in create: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            console.log(`Method: updateEmergencyContact called with ID: ${id} and data: ${JSON.stringify(data)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in updateEmergencyContact: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            console.log(`Method: delete called with ID: ${id}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in delete: ${error.message}`);
        }
    }
    async findAll() {
        try {
            console.log(`Method: findAll`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAll: ${error.message}`);
        }
    }

    async findById(contactId) {
        try {
            console.log(`Method: findById called with ID: ${contactId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findById: ${error.message}`);
        }
    }

    async findByPatientEmail(email) {
        try {
            console.log(`Method: findByPatientEmail called with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByPatientEmail: ${error.message}`);
        }
    }
}

module.exports = IEmergencyContactRepository;

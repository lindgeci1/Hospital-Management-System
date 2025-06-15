class IMedicalHistoryRepository {
    async create(data) {
        try {
            console.log(`Calling create with data: ${JSON.stringify(data)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in create: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            console.log(`Calling update with ID: ${id} and data: ${JSON.stringify(data)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in update: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            console.log(`Calling deleteMedicalHistory with ID: ${id}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deleteMedicalHistory: ${error.message}`);
        }
    }
    async findAll() {
        try {
            console.log(`Calling findAll`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAll: ${error.message}`);
        }
    }

    async findById(medicalHistoryId) {
        try {
            console.log(`Calling findById with ID: ${medicalHistoryId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findById: ${error.message}`);
        }
    }

    async findByPatientEmail(email) {
        try {
            console.log(`Calling findByPatientEmail with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByPatientEmail: ${error.message}`);
        }
    }

    async findByDoctorEmail(email) {
        try {
            console.log(`Calling findByDoctorEmail with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByDoctorEmail: ${error.message}`);
        }
    }
}

module.exports = IMedicalHistoryRepository;

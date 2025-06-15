class IMedicineRepository {
    async create(medicineData) {
        try {
            console.log("Method: create called with data:", JSON.stringify(medicineData));
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in create: ${error.message}`);
        }
    }

    async update(medicineId, medicineData) {
        try {
            console.log(`Method: update called with medicineId: ${medicineId} and data:`, JSON.stringify(medicineData));
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in update: ${error.message}`);
        }
    }

    async delete(medicineId) {
        try {
            console.log(`Method: delete called with medicineId: ${medicineId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in delete: ${error.message}`);
        }
    }
    async findAll() {
        try {
            console.log("Method: findAll");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAll: ${error.message}`);
        }
    }

    async findById(medicineId) {
        try {
            console.log(`Method: findById called with medicineId: ${medicineId}`);
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

    async findByDoctorEmail(email) {
        try {
            console.log(`Method: findByDoctorEmail called with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByDoctorEmail: ${error.message}`);
        }
    }
}

module.exports = IMedicineRepository;

class IDoctorRepository {
    async create(doctorData) {
        try {
            console.log(`Method: addDoctor called with doctorData: ${JSON.stringify(doctorData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in addDoctor: ${error.message}`);
        }
    }

    async update(doctorId, doctorData) {
        try {
            console.log(`Method: updateDoctor called with doctorId: ${doctorId} and doctorData: ${JSON.stringify(doctorData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in updateDoctor: ${error.message}`);
        }
    }

    async delete(doctorId) {
        try {
            console.log(`Method: deleteDoctor called with doctorId: ${doctorId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deleteDoctor: ${error.message}`);
        }
    }
    async findAll() {
        try {
            console.log("Method: findAllDoctors called");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAllDoctors: ${error.message}`);
        }
    }

    async findById(doctorId) {
        try {
            console.log(`Method: findSingleDoctor called with doctorId: ${doctorId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findSingleDoctor: ${error.message}`);
        }
    }
}

module.exports = IDoctorRepository;

class IDoctorService {
    async findAllDoctors() {
        try {
            console.log("Internal: findAllDoctors called");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAllDoctors: ${error.message}`);
        }
    }

    async findSingleDoctor(doctorId) {
        try {
            console.log(`Internal: findSingleDoctor called with doctorId: ${doctorId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findSingleDoctor: ${error.message}`);
        }
    }

    async addDoctor(doctorData) {
        try {
            console.log(`Internal: addDoctor called with doctorData: ${JSON.stringify(doctorData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in addDoctor: ${error.message}`);
        }
    }

    async updateDoctor(doctorId, doctorData) {
        try {
            console.log(`Internal: updateDoctor called with doctorId: ${doctorId}, doctorData: ${JSON.stringify(doctorData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in updateDoctor: ${error.message}`);
        }
    }

    async deleteDoctor(doctorId) {
        try {
            console.log(`Internal: deleteDoctor called with doctorId: ${doctorId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deleteDoctor: ${error.message}`);
        }
    }
}

module.exports = IDoctorService;

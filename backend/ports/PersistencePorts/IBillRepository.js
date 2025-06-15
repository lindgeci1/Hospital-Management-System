class IBillRepository {
    // Interface for internal business logic
    async findAll(billId) {
        try {
            console.log(`Internal: findAll called with billId: ${billId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAll: ${error.message}`);
        }
    }

    async findByPatientEmailforEmailSent(email) {
        try {
            console.log(`Internal: findByPatientEmailforEmailSent called with billData: ${JSON.stringify(email)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByPatientEmailforEmailSent: ${error.message}`);
        }
    }

    async findByDoctorEmail(email) {
        try {
            console.log(`Internal: findByDoctorEmail called with billId: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByDoctorEmail: ${error.message}`);
        }
    }


    async findAll() {
        try {
            console.log("External: findAll called");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAll: ${error.message}`);
        }
    }

    async findByPatientEmail(email) {
        try {
            console.log(`External: findByPatientEmail called with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByPatientEmail: ${error.message}`);
        }
    }

    async findByDoctorEmail(email) {
        try {
            console.log(`External: findByDoctorEmail called with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByDoctorEmail: ${error.message}`);
        }
    }
}
module.exports = IBillRepository;
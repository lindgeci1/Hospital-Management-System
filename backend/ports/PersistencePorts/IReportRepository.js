class IReportRepository {
    async createPdf(req, res) {
        try {
            console.log("Method: createPdf called");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in createPdf: ${error.message}`);
        }
    }
    async findAllReports(req, res) {
        try {
            console.log("Method: findAllReports called");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAllReports: ${error.message}`);
        }
    }

    async checkPatientReport(req, res) {
        try {
            console.log("Method: checkPatientReport called");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in checkPatientReport: ${error.message}`);
        }
    }
    

    async sendEmailWithPdf(req, res) {
        try {
            console.log("Method: sendEmailWithPdf called");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in sendEmailWithPdf: ${error.message}`);
        }
    }


    async saveReportToDB(req, res) {
        try {
            console.log("Method: saveReportToDB called");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in saveReportToDB: ${error.message}`);
        }
    }


    async deleteReport(req, res) {
        try {
            console.log("Method: deleteReport called");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deleteReport: ${error.message}`);
        }
    }
    async fetchReportsFromDB(req, res) {
        try {
            console.log("Method: fetchReportsFromDB");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in fetchReportsFromDB: ${error.message}`);
        }
    }


    async getDoctorByEmail(email) {
        try {
            console.log(`Method: getDoctorByEmail called with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in getDoctorByEmail: ${error.message}`);
        }
    }

    async getPatientByEmail(email) {
        try {
            console.log(`Method: getPatientByEmail called with empId: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in getPatientByEmail: ${error.message}`);
        }
    }
}

module.exports = IReportRepository;

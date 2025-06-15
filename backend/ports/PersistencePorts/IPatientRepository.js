class IPatientRepository {
    async addPatient(patientData) {
        try {
            console.log(`Method: addPatient called with patientData: ${JSON.stringify(patientData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in addPatient: ${error.message}`);
        }
    }

    async updatePatient(patientId, patientData) {
        try {
            console.log(`Method: updatePatient called with patientId: ${patientId} and patientData: ${JSON.stringify(patientData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in updatePatient: ${error.message}`);
        }
    }

    async deletePatient(patientId) {
        try {
            console.log(`Method: deletePatient called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deletePatient: ${error.message}`);
        }
    }

    async checkPatientExistence(patientId) {
        try {
            console.log(`Method: checkPatientExistence called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in checkPatientExistence: ${error.message}`);
        }
    }

    async checkPatientVisit(patientId) {
        try {
            console.log(`Method: checkPatientVisit called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in checkPatientVisit: ${error.message}`);
        }
    }
    async getPatientByEmail(email) {
        try {
            console.log(`Method: getPatientByEmail called with patientData: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in getPatientByEmail: ${error.message}`);
        }
    }

    async findAllPatients(userEmail, userRole) {
        try {
            console.log("Method: findAllPatients called with user:", userEmail, userRole);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAllPatients: ${error.message}`);
        }
    }

    async findSinglePatient(patientId) {
        try {
            console.log(`Method: findSinglePatient called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findSinglePatient: ${error.message}`);
        }
    }

    async findPatientByPersonalNumber(personalNumber) {
        try {
            console.log(`Method: findPatientByPersonalNumber called with personalNumber: ${personalNumber}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findPatientByPersonalNumber: ${error.message}`);
        }
    }

    async findRoomCostByPatientId(patientId) {
        try {
            console.log(`Method: findRoomCostByPatientId called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findRoomCostByPatientId: ${error.message}`);
        }
    }

    async findMedicineCostByPatientId(patientId) {
        try {
            console.log(`Method: findMedicineCostByPatientId called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findMedicineCostByPatientId: ${error.message}`);
        }
    }

    async findEmailByPatientId(patientId) {
        try {
            console.log(`Method: findEmailByPatientId called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findEmailByPatientId: ${error.message}`);
        }
    }
}

module.exports = IPatientRepository;

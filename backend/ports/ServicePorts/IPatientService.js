class IPatientService {
    async findAllPatients(user) {
        try {
            console.log(`Internal: findAllPatients called with user: ${JSON.stringify(user)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAllPatients: ${error.message}`);
        }
    }

    async findSinglePatient(patientId) {
        try {
            console.log(`Internal: findSinglePatient called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findSinglePatient: ${error.message}`);
        }
    }

    async addPatient(patientData) {
        try {
            console.log(`Internal: addPatient called with patientData: ${JSON.stringify(patientData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in addPatient: ${error.message}`);
        }
    }

    async updatePatient(patientId, patientData) {
        try {
            console.log(`Internal: updatePatient called with patientId: ${patientId}, patientData: ${JSON.stringify(patientData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in updatePatient: ${error.message}`);
        }
    }

    async deletePatient(patientId) {
        try {
            console.log(`Internal: deletePatient called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deletePatient: ${error.message}`);
        }
    }

    async checkPatientExistence(patientId) {
        try {
            console.log(`Internal: checkPatientExistence called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in checkPatientExistence: ${error.message}`);
        }
    }

    async findPatientByPersonalNumber(personalNumber) {
        try {
            console.log(`Internal: findPatientByPersonalNumber called with personalNumber: ${personalNumber}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findPatientByPersonalNumber: ${error.message}`);
        }
    }

    async findRoomCostByPatientId(patientId) {
        try {
            console.log(`Internal: findRoomCostByPatientId called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findRoomCostByPatientId: ${error.message}`);
        }
    }

    async findMedicineCostByPatientId(patientId) {
        try {
            console.log(`Internal: findMedicineCostByPatientId called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findMedicineCostByPatientId: ${error.message}`);
        }
    }

    async findEmailByPatientId(patientId) {
        try {
            console.log(`Internal: findEmailByPatientId called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findEmailByPatientId: ${error.message}`);
        }
    }

    async checkPatientVisit(patientId) {
        try {
            console.log(`Internal: checkPatientVisit called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in checkPatientVisit: ${error.message}`);
        }
    }
}

module.exports = IPatientService;

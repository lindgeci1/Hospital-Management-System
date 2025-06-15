class IVisitService {
    async findAllVisits(user) {
        try {
            console.log(`Internal: findAllVisits called with user: ${JSON.stringify(user)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAllVisits: ${error.message}`);
        }
    }

    async findSingleVisit(visitId) {
        try {
            console.log(`Internal: findSingleVisit called with visitId: ${visitId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findSingleVisit: ${error.message}`);
        }
    }

    async findVisitsByPatientId(patientId) {
        try {
            console.log(`Internal: findVisitsByPatientId called with patientId: ${patientId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findVisitsByPatientId: ${error.message}`);
        }
    }

    async addVisit(visitData) {
        try {
            console.log(`Internal: addVisit called with visitData: ${JSON.stringify(visitData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in addVisit: ${error.message}`);
        }
    }

    async updateVisit(visitId, visitData) {
        try {
            console.log(`Internal: updateVisit called with visitId: ${visitId}, visitData: ${JSON.stringify(visitData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in updateVisit: ${error.message}`);
        }
    }

    async deleteVisit(visitId) {
        try {
            console.log(`Internal: deleteVisit called with visitId: ${visitId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deleteVisit: ${error.message}`);
        }
    }
}

module.exports = IVisitService;

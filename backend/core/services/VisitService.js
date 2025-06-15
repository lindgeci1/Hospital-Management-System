const VisitRepository = require("../../adapters/repositories/VisitRepository");
const IVisitService = require("../../ports/ServicePorts/IVisitService");
class VisitService extends IVisitService {
    constructor(visitRepository) {
        super();
        this.visitRepository = visitRepository;
        Object.getOwnPropertyNames(IVisitService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IVisitService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAllVisits(user) {
        return await this.visitRepository.findAll(user);
    }

    async findSingleVisit(visitId) {
        return await this.visitRepository.findById(visitId);
    }

    async findVisitsByPatientId(patientId) {
        return await this.visitRepository.findVisitsByPatientId(patientId);
    }

    async addVisit(visitData) {
        const { Patient_ID, Doctor_ID, date_of_visit, condition, Time, therapy } = visitData;

        if (!Patient_ID || !Doctor_ID || !date_of_visit || !condition || !Time || !therapy) {
            throw new Error('All fields are required.');
        }

        try {
            return await this.visitRepository.createVisit(visitData);
        } catch (error) {
            throw new Error("Error creating visit: " + error.message);
        }
    }

    async updateVisit(visitId, visitData) {
        const { Patient_ID, Doctor_ID, date_of_visit, condition, Time, therapy } = visitData;

        if (!Patient_ID || !Doctor_ID || !date_of_visit || !condition || !Time || !therapy) {
            throw new Error('All fields are required.');
        }

        try {
            return await this.visitRepository.updateVisit(visitId, visitData);
        } catch (error) {
            throw new Error("Error updating visit: " + error.message);
        }
    }

    async deleteVisit(visitId) {
        const deleted = await this.visitRepository.delete(visitId);
        if (!deleted) {
            throw new Error("Visit deletion failed");
        }
        return true;
    }
}

module.exports = new VisitService(VisitRepository);
const VisitService = require("../../../core/services/VisitService");

class VisitController {
    constructor(visitService) {
        this.visitService = visitService;
    }
    async findAllVisits(req, res) {
        try {
            const visits = await this.visitService.findAllVisits(req.user);
            res.status(200).json(visits);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findSingleVisit(req, res) {
        try {
            const visit = await this.visitService.findSingleVisit(req.params.id);
            if (!visit) {
                return res.status(404).json({ message: "Visit not found" });
            }
            res.status(200).json(visit);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findVisitsByPatientId(req, res) {
        const { patientId } = req.params;
        try {
            const visits = await this.visitService.findVisitsByPatientId(patientId);
            if (!visits) {
                return res.status(404).json({ error: 'Visits not found' });
            }
            res.json(visits);
        } catch (error) {
            console.error('Error fetching visits by patient ID:', error.message);
            console.error(error.stack); // Log the stack trace for debugging
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async addVisit(req, res) {
        try {
            const newVisit = await this.visitService.addVisit(req.body);
            res.status(201).json(newVisit);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateVisit(req, res) {
        try {
            const updatedVisit = await this.visitService.updateVisit(req.params.id, req.body);
            if (!updatedVisit) {
                return res.status(404).json({ message: "Visit not found or could not be updated" });
            }
            res.status(200).json(updatedVisit);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteVisit(req, res) {
        try {
            const deletedVisit = await this.visitService.deleteVisit(req.params.id);
            if (!deletedVisit) {
                return res.status(404).json({ message: "Visit not found" });
            }
            res.status(204).send(); // No content to send back
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new VisitController(VisitService);

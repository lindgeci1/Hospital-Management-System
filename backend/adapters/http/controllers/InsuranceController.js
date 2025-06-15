const InsuranceService = require("../../../core/services/InsuranceService");

class InsuranceController {
    constructor(insuranceService) {
        this.insuranceService = insuranceService;
    }
    async findAllInsurances(req, res) {
        try {
            const insurances = await this.insuranceService.findAllInsurances(req.user);
            res.status(200).json(insurances);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findSingleInsurance(req, res) {
        try {
            const insurance = await this.insuranceService.findSingleInsurance(req.params.id);
            if (!insurance) {
                return res.status(404).json({ message: "Insurance not found" });
            }
            res.status(200).json(insurance);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addInsurance(req, res) {
        try {
            const newInsurance = await this.insuranceService.addInsurance(req.body);
            res.status(201).json(newInsurance);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateInsurance(req, res) {
        try {
            const updatedInsurance = await this.insuranceService.updateInsurance(req.params.id, req.body);
            if (!updatedInsurance) {
                return res.status(404).json({ message: "Insurance not found or could not be updated" });
            }
            res.status(200).json(updatedInsurance);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

        // In InsuranceController.js
        async findCoverageByPatientId(req, res) {
            try {
            const { patientId } = req.params;
            const coverage = await this.insuranceService.findCoverageByPatientId(patientId);
            res.status(200).json({ coverage });
            } catch (error) {
            console.error("Error fetching insurance coverage:", error.message);
            res.status(500).json({ message: error.message });
            }
        }
  

    
    async deleteInsurance(req, res) {
        try {
            const deletedInsurance = await this.insuranceService.deleteInsurance(req.params.id);
            if (!deletedInsurance) {
                return res.status(404).json({ message: "Insurance not found" });
            }
            res.status(204).send(); // No content to send back
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new InsuranceController(InsuranceService);
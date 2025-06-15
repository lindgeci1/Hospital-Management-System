// InsuranceRoutes.js
const express = require("express");
const InsuranceController = require("../controllers/InsuranceController"); // Update the path if necessary
const { authenticateToken } = require('../../middleware/authMiddleware');
const cookieParser = require("cookie-parser");
class InsuranceRoutes {
    constructor() {
        this.router = express.Router();
        this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/insurance", authenticateToken(['admin', 'doctor', 'patient']), InsuranceController.findAllInsurances.bind(InsuranceController));
        this.router.get("/insurance/:id", authenticateToken(['admin', 'doctor', 'patient']), InsuranceController.findSingleInsurance.bind(InsuranceController));
        this.router.post("/insurance/create", authenticateToken(['admin', 'doctor', 'patient']), InsuranceController.addInsurance.bind(InsuranceController));
        this.router.put("/insurance/update/:id", authenticateToken(['admin', 'doctor','patient']), InsuranceController.updateInsurance.bind(InsuranceController));
        this.router.delete("/insurance/delete/:id", authenticateToken(['admin', 'doctor', 'patient']), InsuranceController.deleteInsurance.bind(InsuranceController));
        this.router.get("/insurance/coverage/:patientId", authenticateToken(['admin', 'doctor', 'patient']), InsuranceController.findCoverageByPatientId.bind(InsuranceController));     
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new InsuranceRoutes().getRouter();

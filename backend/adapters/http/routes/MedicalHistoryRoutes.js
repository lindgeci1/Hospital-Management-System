const express = require("express");
const MedicalHistoryController = require("../controllers/MedicalHistoryController"); // Update the path if necessary
const { authenticateToken } = require('../../middleware/authMiddleware');
const cookieParser = require("cookie-parser");
class MedicalHistoryRoutes {
    constructor() {
        this.router = express.Router();
        this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/medicalhistory", authenticateToken(['admin', 'doctor', 'patient']), MedicalHistoryController.findAllMedicalHistories.bind(MedicalHistoryController));
        this.router.get("/medicalhistory/:id", authenticateToken(['admin', 'doctor', 'patient']), MedicalHistoryController.findSingleMedicalHistory.bind(MedicalHistoryController));
        this.router.post("/medicalhistory/create", authenticateToken(['admin', 'doctor', 'patient']), MedicalHistoryController.addMedicalHistory.bind(MedicalHistoryController));
        this.router.put("/medicalhistory/update/:id", authenticateToken(['admin', 'doctor', 'patient']), MedicalHistoryController.updateMedicalHistory.bind(MedicalHistoryController));
        this.router.delete("/medicalhistory/delete/:id", authenticateToken(['admin', 'doctor']), MedicalHistoryController.deleteMedicalHistory.bind(MedicalHistoryController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new MedicalHistoryRoutes().getRouter();

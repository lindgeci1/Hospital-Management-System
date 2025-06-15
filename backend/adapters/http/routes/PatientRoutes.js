const express = require("express");
const PatientController = require("../controllers/PatientController"); // Update the path if necessary
const { authenticateToken } = require('../../middleware/authMiddleware');
const cookieParser = require("cookie-parser");
class PatientRoutes {
    constructor() {
        this.router = express.Router();
                        this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/patient", authenticateToken(['admin', 'doctor', 'patient']), PatientController.findAllPatients.bind(PatientController));
        this.router.get("/patient/:id", authenticateToken(['admin', 'doctor', 'patient']), PatientController.findSinglePatient.bind(PatientController));
        this.router.post("/patient/create", authenticateToken(['admin', 'doctor', 'patient']), PatientController.addPatient.bind(PatientController));
        this.router.put("/patient/update/:id", authenticateToken(['admin', 'doctor', 'patient']), PatientController.updatePatient.bind(PatientController));
        this.router.delete("/patient/delete/:id", authenticateToken(['admin', 'doctor']), PatientController.deletePatient.bind(PatientController));
        this.router.get('/patient/check/:id', authenticateToken(['admin', 'doctor', 'patient']), PatientController.checkPatientExistence.bind(PatientController));
        this.router.get('/patient/personalNumber/:personalNumber', authenticateToken(['admin', 'doctor', 'patient']), PatientController.findPatientByPersonalNumber.bind(PatientController));
        
        // New routes
        this.router.get('/patient/:patientId/room-cost', authenticateToken(['admin', 'doctor', 'patient']), PatientController.findRoomCostByPatientId.bind(PatientController));
        this.router.get('/patients/:patientId/medicine-cost', authenticateToken(['admin', 'doctor', 'patient']), PatientController.findMedicineCostByPatientId.bind(PatientController));
        this.router.get('/patient/:patientId/email', authenticateToken(['admin', 'doctor', 'patient']), PatientController.findEmailByPatientId.bind(PatientController));
        this.router.get('/patient/:id/visit', authenticateToken(['admin', 'doctor', 'patient']), PatientController.checkPatientVisit.bind(PatientController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new PatientRoutes().getRouter();

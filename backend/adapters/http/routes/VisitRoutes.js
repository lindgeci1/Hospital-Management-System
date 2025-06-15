const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../../middleware/authMiddleware');  // Assuming this middleware is already set up
const VisitController = require("../controllers/VisitController"); // Assuming this is your VisitController
const cookieParser = require("cookie-parser");
class VisitRoutes {
    constructor() {
        this.router = express.Router();
        this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Get all visits (accessible by admin, doctor, and patient)
        this.router.get("/visit", authenticateToken(['admin', 'doctor', 'patient']), VisitController.findAllVisits.bind(VisitController));

        // Get a single visit by ID (accessible by admin, doctor, and patient)
        this.router.get("/visit/:id", authenticateToken(['admin', 'doctor', 'patient']), VisitController.findSingleVisit.bind(VisitController));

        // Create a new visit (accessible by admin, doctor, and patient)
        this.router.post("/visit/create", authenticateToken(['admin', 'doctor', 'patient']), VisitController.addVisit.bind(VisitController));

        // Update an existing visit (accessible by admin, doctor, and patient)
        this.router.put("/visit/update/:id", authenticateToken(['admin', 'doctor', 'patient']), VisitController.updateVisit.bind(VisitController));

        // Get all visits by a specific patient (accessible by admin, doctor, and patient)
        this.router.get("/visit/patient/:patientId", authenticateToken(['admin', 'doctor', 'patient']), VisitController.findVisitsByPatientId.bind(VisitController));

        // Delete a visit (accessible by admin and doctor)
        this.router.delete("/visit/delete/:id", authenticateToken(['admin', 'doctor','patient']), VisitController.deleteVisit.bind(VisitController));
    }

    getRouter() {
        return this.router;
    }
}

// Export the visit routes
module.exports = new VisitRoutes().getRouter();

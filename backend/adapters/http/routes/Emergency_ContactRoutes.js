const express = require("express");
const Emergency_ContactController = require("../controllers/Emergency_ContactController"); // Updated to match the file name
const { authenticateToken } = require('../../middleware/authMiddleware');
const cookieParser = require("cookie-parser");
class Emergency_ContactRoutes {
    constructor() {
        this.router = express.Router();
                this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/emergency_contact", authenticateToken(['admin', 'doctor', 'patient']), Emergency_ContactController.findAllEmergencyContacts.bind(Emergency_ContactController));
        this.router.get("/emergency_contact/:id", authenticateToken(['admin', 'doctor', 'patient']), Emergency_ContactController.findSingleEmergencyContact.bind(Emergency_ContactController));
        this.router.post("/emergency_contact/create", authenticateToken(['admin', 'doctor', 'patient']), Emergency_ContactController.addEmergencyContact.bind(Emergency_ContactController));
        this.router.put("/emergency_contact/update/:id", authenticateToken(['admin', 'doctor', 'patient']), Emergency_ContactController.updateEmergencyContact.bind(Emergency_ContactController));
        this.router.delete("/emergency_contact/delete/:id", authenticateToken(['admin', 'doctor','patient']), Emergency_ContactController.deleteEmergencyContact.bind(Emergency_ContactController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new Emergency_ContactRoutes().getRouter(); // Updated to match the class name

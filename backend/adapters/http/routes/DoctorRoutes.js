const express = require("express");
const { authenticateToken } = require('../../middleware/authMiddleware');
const DoctorController = require("../controllers/DoctorController"); // Update the path if necessary
const cookieParser = require("cookie-parser");
class DoctorRoutes {
    constructor() {
        this.router = express.Router();
                this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/doctors", authenticateToken(['admin', 'doctor', 'patient']), DoctorController.findAllDoctors.bind(DoctorController));
        this.router.get("/doctors/:id", authenticateToken(['admin', 'doctor', 'patient']), DoctorController.findSingleDoctor.bind(DoctorController));
        this.router.post("/doctors/create", authenticateToken(['admin', 'doctor']), DoctorController.addDoctor.bind(DoctorController));
        this.router.put("/doctors/update/:id", authenticateToken(['admin', 'doctor']), DoctorController.updateDoctor.bind(DoctorController));
        this.router.delete("/doctors/delete/:id", authenticateToken(['admin', 'doctor']), DoctorController.deleteDoctor.bind(DoctorController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new DoctorRoutes().getRouter();
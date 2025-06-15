const express = require("express");
const MedicineController = require("../controllers/MedicineController"); // Ensure this path is correct
const { authenticateToken } = require('../../middleware/authMiddleware');
const cookieParser = require("cookie-parser");
class MedicineRoutes {
    constructor() {
        this.router = express.Router();
        this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Ensure method names match those in MedicineController
        this.router.get("/medicine", authenticateToken(['admin', 'doctor', 'patient']), MedicineController.findAllMedicines.bind(MedicineController));
        this.router.get("/medicine/:id", authenticateToken(['admin', 'doctor', 'patient']), MedicineController.findSingleMedicine.bind(MedicineController));
        this.router.post("/medicine/create", authenticateToken(['admin', 'doctor', 'patient']), MedicineController.addMedicine.bind(MedicineController));
        this.router.put("/medicine/update/:id", authenticateToken(['admin', 'doctor', 'patient']), MedicineController.updateMedicine.bind(MedicineController));
        this.router.delete("/medicine/delete/:id", authenticateToken(['admin', 'doctor', 'patient']), MedicineController.deleteMedicine.bind(MedicineController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new MedicineRoutes().getRouter();

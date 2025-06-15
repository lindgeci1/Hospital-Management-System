const express = require("express");
const { authenticateToken } = require('../../middleware/authMiddleware');
const DepartmentController = require("../controllers/DepartmentController"); // Update the path if necessary
const cookieParser = require("cookie-parser");
class DepartmentRoutes {
    constructor() {
        this.router = express.Router();
                this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/department", authenticateToken(['admin', 'doctor', 'patient']), DepartmentController.findAllDepartments.bind(DepartmentController));
        this.router.get("/department/:id", authenticateToken(['admin', 'doctor', 'patient']), DepartmentController.findSingleDepartment.bind(DepartmentController));
        this.router.post("/department/create", authenticateToken(['admin', 'doctor']), DepartmentController.addDepartment.bind(DepartmentController));
        this.router.put("/department/update/:id", authenticateToken(['admin', 'doctor']), DepartmentController.updateDepartment.bind(DepartmentController));
        this.router.delete("/department/delete/:id", authenticateToken(['admin', 'doctor']), DepartmentController.deleteDepartment.bind(DepartmentController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new DepartmentRoutes().getRouter();

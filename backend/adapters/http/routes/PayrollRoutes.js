const express = require("express");
const Factory = require("../../../core/factory_pattern/Factory");
const { authenticateToken } = require('../../middleware/authMiddleware');
const cookieParser = require("cookie-parser");
class PayrollRoutes {
    constructor() {
        this.router = express.Router();
        this.payrollController = Factory.createComponent('payroll');
        this.router.use(cookieParser()); // ✅ Create controller once
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/payroll", authenticateToken(['admin', 'doctor']), (req, res) => this.payrollController.findAllPayrolls(req, res));
        this.router.get("/payroll/:id", authenticateToken(['admin', 'doctor']), (req, res) => this.payrollController.findSinglePayroll(req, res));
        this.router.post("/payroll/create", authenticateToken(['admin', 'doctor']), (req, res) => this.payrollController.addPayroll(req, res));
        this.router.put("/payroll/update/:id", authenticateToken(['admin', 'doctor']), (req, res) => this.payrollController.updatePayroll(req, res));
        this.router.delete("/payroll/delete/:id", authenticateToken(['admin', 'doctor']), (req, res) => this.payrollController.deletePayroll(req, res));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new PayrollRoutes().getRouter();

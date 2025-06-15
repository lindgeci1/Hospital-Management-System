const express = require("express");
const BillController = require("../controllers/BillController"); // Ensure the correct path is specified
const { authenticateToken } = require('../../middleware/authMiddleware');
const cookieParser = require("cookie-parser");
class BillRoutes {
    constructor() {
        this.router = express.Router();
                this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("/payments/create", authenticateToken(['admin', 'doctor', 'patient']), BillController.createPaymentIntent.bind(BillController));
        this.router.post("/payments/confirm", authenticateToken(['admin', 'doctor', 'patient']), BillController.confirmPayment.bind(BillController));
        this.router.get("/bills/all", authenticateToken(['admin', 'doctor', 'patient']), BillController.findAllBills.bind(BillController));
        this.router.delete("/bills/delete/:id", authenticateToken(['admin', 'doctor', 'patient']), BillController.deleteBill.bind(BillController));
        this.router.post("/payments/send-confirmation", authenticateToken(['admin', 'doctor', 'patient']), BillController.sendPaymentConfirmation.bind(BillController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new BillRoutes().getRouter();

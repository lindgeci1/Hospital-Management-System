const express = require('express');
const { authenticateToken } = require('../../middleware/authMiddleware');
const ReportController = require("../controllers/ReportController"); // Update the path if necessary
const cookieParser = require("cookie-parser");
class ReportRoutes {
    constructor() {
        this.router = express.Router();
                this.initializeRoutes();
                this.router.use(cookieParser());
    }

    initializeRoutes() {
        this.router.post('/report/create-pdf', authenticateToken(['admin', 'doctor', 'patient']), ReportController.createPdf.bind(ReportController));
        this.router.post('/report/send-email', authenticateToken(['admin', 'doctor', 'patient']), ReportController.sendEmailWithPdf.bind(ReportController));
        this.router.post('/report/save-report-to-db', authenticateToken(['admin', 'doctor', 'patient']), ReportController.saveReportToDB.bind(ReportController));
        this.router.get('/report/fetch-reports', authenticateToken(['admin', 'doctor', 'patient']), ReportController.fetchReportsFromDB.bind(ReportController));
        this.router.get('/reports/check/:patientId', authenticateToken(['admin', 'doctor', 'patient']), ReportController.checkPatientReport.bind(ReportController));
        this.router.get('/reports', authenticateToken(['admin', 'doctor', 'patient']), ReportController.findAllReports.bind(ReportController));
        this.router.delete('/report/delete/:id', authenticateToken(['admin', 'doctor', 'patient']), ReportController.deleteReport.bind(ReportController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new ReportRoutes().getRouter();

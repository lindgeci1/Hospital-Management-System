const ReportService = require("../../../core/services/ReportService");

class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }

    async fetchReportsFromDB(req, res) {
        try {
            await this.reportService.fetchReportsFromDB(req, res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findAllReports(req, res) {
        try {
            await this.reportService.findAllReports(req, res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async checkPatientReport(req, res) {
        try {
            await this.reportService.checkPatientReport(req, res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createPdf(req, res) {
        try {
            await this.reportService.createPdf(req, res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async sendEmailWithPdf(req, res) {
        try {
            await this.reportService.sendEmailWithPdf(req, res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async saveReportToDB(req, res) {
        try {
            await this.reportService.saveReportToDB(req, res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteReport(req, res) {
        try {
            await this.reportService.deleteReport(req, res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ReportController(ReportService);

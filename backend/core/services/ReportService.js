const ReportRepository = require("../../adapters/repositories/ReportRepository");
const IReportService = require("../../ports/ServicePorts/IReportService");
class ReportService extends IReportService {
    
    constructor(reportRepository) {
        super();
        this.reportRepository = reportRepository;
        Object.getOwnPropertyNames(IReportService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IReportService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async fetchReportsFromDB(req, res) {
        try {
            await this.reportRepository.fetchReportsFromDB(req, res);
        } catch (error) {
            console.error('Error fetching reports in ReportService:', error);
            res.status(500).json({ error: 'Error fetching reports' });
        }
    }

    async findAllReports(req, res) {
        try {
            await this.reportRepository.findAllReports(req, res);
        } catch (error) {
            console.error('Error fetching all reports in ReportService:', error);
            res.status(500).json({ error: 'Error fetching reports' });
        }
    }

    async checkPatientReport(req, res) {
        try {
            await this.reportRepository.checkPatientReport(req, res);
        } catch (error) {
            console.error('Error checking patient report in ReportService:', error);
            res.status(500).json({ error: 'Error checking patient report' });
        }
    }

    async createPdf(req, res) {
        try {
            await this.reportRepository.createPdf(req, res);
        } catch (error) {
            console.error('Error generating PDF in ReportService:', error);
            res.status(500).json({ error: 'Error generating PDF' });
        }
    }

    async sendEmailWithPdf(req, res) {
        try {
            await this.reportRepository.sendEmailWithPdf(req, res);
        } catch (error) {
            console.error('Error sending email in ReportService:', error);
            res.status(500).json({ error: 'Error sending email with PDF' });
        }
    }

    async saveReportToDB(req, res) {
        try {
            await this.reportRepository.saveReportToDB(req, res);
        } catch (error) {
            console.error('Error saving report in ReportService:', error);
            res.status(500).json({ error: 'Error saving report' });
        }
    }

    async deleteReport(req, res) {
        try {
            await this.reportRepository.deleteReport(req, res);
        } catch (error) {
            console.error('Error deleting report in ReportService:', error);
            res.status(500).json({ error: 'Error deleting report' });
        }
    }
}

module.exports = new ReportService(ReportRepository);

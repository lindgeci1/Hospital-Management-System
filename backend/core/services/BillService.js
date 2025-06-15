const BillRepository = require("../../adapters/repositories/BillRepository");
const IBillService = require("../../ports/ServicePorts/IBillService");

class BillService extends IBillService {
    constructor(billRepository) {
        super();
        this.billRepository = billRepository;
        Object.getOwnPropertyNames(IBillService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IBillService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async createPaymentIntent(billData) {
        const { Amount, Patient_ID, Description } = billData;

        if (!Amount || !Patient_ID || !Description) {
            throw new Error("Invalid or missing data");
        }

        return await this.billRepository.createPaymentIntent(Amount, 'USD', Patient_ID, Description);
    }

    async sendPaymentConfirmationEmail(patientEmail, amount) {
        return this.billRepository.sendPaymentConfirmationEmail(patientEmail, amount);
    }

    async confirmPayment(paymentIntentId, patientId, paymentMethodId) {
        if (!paymentIntentId || !patientId) {
            throw new Error("Missing required payment details");
        }

        return await this.billRepository.confirmPayment(paymentIntentId, patientId, paymentMethodId);
    }

    async findAllBills(user) {
        const { email, role } = user;

        switch (role) {
            case "admin":
                return await this.billRepository.findAll();
            case "patient":
                return await this.billRepository.findByPatientEmail(email);
            case "doctor":
                return await this.billRepository.findByDoctorEmail(email);
            default:
                throw new Error("Unauthorized access");
        }
    }
    
    async deleteBill(billId) {
        return await this.billRepository.delete(billId);
    }
}

module.exports = new BillService(BillRepository);

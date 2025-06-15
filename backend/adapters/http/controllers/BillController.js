const BillService = require("../../../core/services/BillService");

class BillController {
    constructor(billService) {
        this.billService = billService;
    }

    async createPaymentIntent(req, res) {
        try {
            const paymentIntent = await this.billService.createPaymentIntent(req.body);
            res.status(201).json(paymentIntent);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async confirmPayment(req, res) {
        try {
            const { paymentIntentId, patientId, paymentMethodId } = req.body;

            if (!paymentIntentId || !patientId || !paymentMethodId) {
                return res.status(400).json({ error: "Payment Intent ID, Patient ID, and Payment Method ID are required." });
            }

            const updatedBill = await this.billService.confirmPayment(paymentIntentId, patientId, paymentMethodId);

            if (!updatedBill) {
                return res.status(404).json({ message: "Bill not found or payment not confirmed" });
            }

            res.status(200).json(updatedBill);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async sendPaymentConfirmation(req, res) {
        const { patientEmail, amount } = req.body;

        try {
            await this.billService.sendPaymentConfirmationEmail(patientEmail, amount);
            res.status(200).json({ message: 'Payment confirmation email sent successfully.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findAllBills(req, res) {
        try {
            const bills = await this.billService.findAllBills(req.user);
            res.status(200).json(bills);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async deleteBill(req, res) {
        try {
            const deletedBill = await this.billService.deleteBill(req.params.id);
            if (!deletedBill) {
                return res.status(404).json({ message: "Bill not found" });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new BillController(BillService);
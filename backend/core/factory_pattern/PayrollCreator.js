const Creator = require("./Creator");
const PayrollController = require("../../adapters/http/controllers/PayrollController");
const PayrollService = require("../services/PayrollService");
const PayrollRepository = require("../../adapters/repositories/PayrollRepository");

class PayrollCreator extends Creator {
    createHandler() {
        try {
            const repository = new PayrollRepository();
            const service = new PayrollService(repository);
            return new PayrollController(service); 
        } catch (error) {
            console.error("Error creating PayrollHandler:", error.message);
            throw new Error("Failed to create PayrollHandler. Please check the configuration.");
        }
    }
}

module.exports = PayrollCreator;
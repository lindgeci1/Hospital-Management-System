class IBillService {
    async findAllBills(user) {
        try {
            console.log(`Internal: findAllBills called with user: ${JSON.stringify(user)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAllBills: ${error.message}`);
        }
    }


    async createPaymentIntent(billData) {
        try {
            console.log(`Internal: createPaymentIntent called with billData: ${JSON.stringify(billData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in createPaymentIntent: ${error.message}`);
        }
    }

    async deleteBill(billId) {
        try {
            console.log(`Internal: deleteBill called with billId: ${billId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deleteBill: ${error.message}`);
        }
    }
}

module.exports = IBillService;

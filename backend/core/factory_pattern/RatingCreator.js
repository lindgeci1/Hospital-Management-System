const Creator = require("./Creator");
const RatingController = require("../../adapters/http/controllers/RatingController");
const RatingService = require("../services/RatingServices");
const RatingRepository = require("../../adapters/repositories/RatingRepository");

class RatingCreator extends Creator {
    createHandler() {
        try {
            const repository = new RatingRepository();
            const service = new RatingService(repository);
            return new RatingController(service); 
        } catch (error) {
            console.error("Error creating RatingHandler:", error.message);
            throw new Error("Failed to create RatingHandler. Please check the configuration.");
        }
    }
}

module.exports = RatingCreator;
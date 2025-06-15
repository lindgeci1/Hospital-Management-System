const express = require("express");
const Factory = require("../../../core/factory_pattern/Factory");
const { authenticateToken } = require('../../middleware/authMiddleware');
const cookieParser = require("cookie-parser");
class RatingRoutes {
    constructor() {
        this.router = express.Router();
        this.ratingController = Factory.createComponent('rating'); // ✅ Create once
        this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/rating", authenticateToken(['admin', 'doctor']), (req, res) => this.ratingController.findAllRatings(req, res));
        this.router.get("/rating/:id", authenticateToken(['admin', 'doctor']), (req, res) => this.ratingController.findSingleRating(req, res));
        this.router.post("/rating/create", authenticateToken(['admin', 'doctor']), (req, res) => this.ratingController.addRating(req, res));
        this.router.put("/rating/update/:id", authenticateToken(['admin', 'doctor']), (req, res) => this.ratingController.updateRating(req, res));
        this.router.delete("/rating/delete/:id", authenticateToken(['admin', 'doctor']), (req, res) => this.ratingController.deleteRating(req, res));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new RatingRoutes().getRouter();

class RatingController {
    constructor(ratingService) {
        this.ratingService = ratingService;
    }
    async findAllRatings(req, res) {
        try {
            const ratings = await this.ratingService.findAllRatings(req.user);
            res.status(200).json(ratings);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findSingleRating(req, res) {
        try {
            const rating = await this.ratingService.findSingleRating(req.params.id);
            if (!rating) {
                return res.status(404).json({ message: "Rating not found" });
            }
            res.status(200).json(rating);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addRating(req, res) {
        try {
            const newRating = await this.ratingService.addRating(req.body);
            res.status(201).json(newRating);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateRating(req, res) {
        try {
            const updatedRating = await this.ratingService.updateRating(req.params.id, req.body);
            if (!updatedRating) {
                return res.status(404).json({ message: "Rating not found or could not be updated" });
            }
            res.status(200).json(updatedRating);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteRating(req, res) {
        try {
            const deletedRating = await this.ratingService.deleteRating(req.params.id);
            if (!deletedRating) {
                return res.status(404).json({ message: "Rating not found" });
            }
            res.status(204).send(); // No content to send back
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RatingController;
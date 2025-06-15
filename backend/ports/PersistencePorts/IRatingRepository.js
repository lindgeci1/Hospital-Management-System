class IRatingRepository {
    async create(ratingData) {
        try {
            console.log("Method: create called with data:", JSON.stringify(ratingData));
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in create: ${error.message}`);
        }
    }

    async update(ratingId, ratingData) {
        try {
            console.log(`Method: update called with ratingId: ${ratingId} and data:`, JSON.stringify(ratingData));
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in update: ${error.message}`);
        }
    }

    async delete(ratingId) {
        try {
            console.log(`Method: delete called with ratingId: ${ratingId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in delete: ${error.message}`);
        }
    }
    async findAll() {
        try {
            console.log("Method: findAll");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAll: ${error.message}`);
        }
    }

    async findById(ratingId) {
        try {
            console.log(`Method: findById called with ratingId: ${ratingId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findById: ${error.message}`);
        }
    }

    async findAllForDoctor(email) {
        try {
            console.log(`Method: findAllForDoctor called with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAllForDoctor: ${error.message}`);
        }
    }

    async findByStaffId(empId) {
        try {
            console.log(`Method: findByStaffId called with empId: ${empId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByStaffId: ${error.message}`);
        }
    }
}

module.exports = IRatingRepository;

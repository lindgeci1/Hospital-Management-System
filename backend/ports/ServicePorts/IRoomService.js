class IRoomService {
    async findAllRooms(user) {
        try {
            console.log(`Internal: findAllRooms called with user: ${JSON.stringify(user)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findAllRooms: ${error.message}`);
        }
    }

    async findSingleRoom(ratingId) {
        try {
            console.log(`Internal: findSingleRoom called with ratingId: ${ratingId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findSingleRoom: ${error.message}`);
        }
    }

    async addRoom(ratingData) {
        try {
            console.log(`Internal: addRoom called with ratingData: ${JSON.stringify(ratingData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in addRoom: ${error.message}`);
        }
    }

    async updateRoom(ratingId, ratingData) {
        try {
            console.log(`Internal: updateRoom called with ratingId: ${ratingId}, ratingData: ${JSON.stringify(ratingData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in updateRoom: ${error.message}`);
        }
    }

    async deleteRoom(ratingId) {
        try {
            console.log(`Internal: deleteRoom called with ratingId: ${ratingId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deleteRoom: ${error.message}`);
        }
    }
}

module.exports = IRoomService;

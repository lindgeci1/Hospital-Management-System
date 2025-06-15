class IRoomRepository {
    async create(roomData) {
        try {
            console.log("Method: addRoom called with roomData:", JSON.stringify(roomData));
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in addRoom: ${error.message}`);
        }
    }
    async findByDoctorEmail(email) {
        throw new Error("Method not implemented: findByDoctorEmail");
    }
    async update(roomId, roomData) {
        try {
            console.log(`Method: updateRoom called with roomId: ${roomId} and roomData: ${JSON.stringify(roomData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in updateRoom: ${error.message}`);
        }
    }

    async delete(roomId) {
        try {
            console.log(`Method: deleteRoom called with roomId: ${roomId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in deleteRoom: ${error.message}`);
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

    async findById(roomId) {
        try {
            console.log(`Method: findById called with roomId: ${roomId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findById: ${error.message}`);
        }
    }

    async findByPatientEmail(email) {
        try {
            console.log(`Method: findByPatientEmail(Room) called with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByPatientEmail: ${error.message}`);
        }
    }

    async findByDoctorEmail(email) {
        try {
            console.log(`Method: findByDoctorEmail(Room) called with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findByDoctorEmail: ${error.message}`);
        }
    }
}

module.exports = IRoomRepository;

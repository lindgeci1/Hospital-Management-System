const RoomRepository = require("../../adapters/repositories/RoomRepository");
const IRoomService = require("../../ports/ServicePorts/IRoomService");

class RoomService  extends IRoomService{
    constructor(roomRepository) {
        super();
        this.roomRepository = roomRepository;
        Object.getOwnPropertyNames(IRoomService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IRoomService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

   async findAllRooms(user) {
    const { email, role } = user;
    switch (role) {
        case "admin":
            return await this.roomRepository.findAll();
        case "doctor":
            return await this.roomRepository.findByDoctorEmail(email);
        case "patient":
            return await this.roomRepository.findByPatientEmail(email);
        default:
            throw new Error("Unauthorized access");
    }
}

    async findSingleRoom(roomId) {
        return await this.roomRepository.findById(roomId);
    }

    async addRoom(roomData) {
        console.log("RoomServiceAdapter: Delegating to roomRepository.addRoom()");
        return await this.roomRepository.create(roomData);
    }

    async updateRoom(roomId, roomData) {
        return await this.roomRepository.update(roomId, roomData);
    }

    async deleteRoom(roomId) {
        return await this.roomRepository.delete(roomId);
    }
}

module.exports = new RoomService(RoomRepository);

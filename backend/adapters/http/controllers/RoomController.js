const RoomService = require("../../../core/services/RoomService");
class RoomController{
    constructor(roomservice) {
        this.roomservice = roomservice;
    }

    async findAllRooms(req, res) {
        try {
            const rooms = await this.roomservice.findAllRooms(req.user);
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findSingleRoom(req, res) {
        try {
            const room = await this.roomservice.findSingleRoom(req.params.id);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
            res.status(200).json(room);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addRoom(req, res) {
        try {
            const newRoom = await this.roomservice.addRoom(req.body);
            res.status(201).json(newRoom);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateRoom(req, res) {
        try {
            const updatedRoom = await this.roomservice.updateRoom(req.params.id, req.body);
            if (!updatedRoom) {
                return res.status(404).json({ message: "Room not found or could not be updated" });
            }
            res.status(200).json(updatedRoom);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteRoom(req, res) {
        try {
            const deletedRoom = await this.roomservice.deleteRoom(req.params.id);
            if (!deletedRoom) {
                return res.status(404).json({ message: "Room not found" });
            }
            res.status(204).send(); // No content to send back
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new RoomController(RoomService);
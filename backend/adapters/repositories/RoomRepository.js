const Room = require('../../core/entities/Room');
const { Op } = require('sequelize');
const Patient = require('../../core/entities/Patient');
const Staff = require('../../core/entities/Staff');
const Visit = require('../../core/entities/Visits');
const Doctor = require('../../core/entities/Doctor');
const sequelize = require('../../core/config/database');
const IRoomRepository = require("../../ports/PersistencePorts/IRoomRepository");


class RoomRepository extends IRoomRepository{
    constructor() {
        super();
        this.Room = Room;
        this.Patient = Patient;
        this.Staff = Staff;
        this.Visit = Visit;
        this.Doctor = Doctor;
        this.sequelize = sequelize;
        Object.getOwnPropertyNames(IRoomRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IRoomRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAll() {
        const rooms = await this.Room.findAll({
            include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
        });
        return rooms;
    }

    async findById(roomId) {
        return await this.Room.findByPk(roomId);
    }

    async create(roomData) {
        const { Room_type, Patient_ID, Room_cost } = roomData;

        if (!Room_type || !Patient_ID || Room_cost === undefined) {
            throw new Error('All fields (Room_type, Patient_ID, Room_cost) are required');
        }

        const existingRoom = await this.Room.findOne({ where: { Patient_ID } });
        if (existingRoom) {
            throw new Error('This patient already has a room assigned');
        }

        return await this.Room.create(roomData);
    }

    async update(roomId, roomData) {
        const { Room_type, Patient_ID, Room_cost } = roomData;

        if (!Room_type || !Patient_ID || Room_cost === undefined) {
            throw new Error('All fields (Room_type, Patient_ID, Room_cost) are required');
        }

        const existingRoom = await this.Room.findOne({
            where: { Patient_ID, Room_ID: { [Op.ne]: roomId } }
        });
        if (existingRoom) {
            throw new Error('This patient already has a room assigned. Update the existing room instead.');
        }

        const [updated] = await this.Room.update(roomData, { where: { Room_ID: roomId } });
        return updated === 0 ? null : updated;
    }

    async delete(roomId) {
        const deleted = await this.Room.destroy({ where: { Room_ID: roomId } });
        return deleted === 0 ? null : deleted;
    }

    async findByPatientEmail(email) {
        const patient = await this.Patient.findOne({ where: { Email: email } });
        if (!patient) throw new Error("Patient not found");
        return await this.Room.findAll({
            where: { Patient_ID: patient.Patient_ID },
            include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
        });
    }

    async findByDoctorEmail(email) {
        const doctor = await this.Staff.findOne({ where: { Email: email } })
            .then(staff => this.Doctor.findOne({ where: { Emp_ID: staff.Emp_ID } }));
        const visits = await this.Visit.findAll({ where: { Doctor_ID: doctor.Doctor_ID } });
        const patientIds = visits.map(visit => visit.Patient_ID);

        return await this.Room.findAll({
            where: { Patient_ID: patientIds },
            include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
        });
    }
}

module.exports = new RoomRepository();
const sequelize = require("../../core/config/database");
const IDoctorRepository = require("../../ports/PersistencePorts/IDoctorRepository");
const Doctor = require("../../core/entities/Doctor");
const Staff = require("../../core/entities/Staff");

class DoctorRepository extends IDoctorRepository{
    constructor() {
        super();
        this.Doctor = Doctor;
        this.Staff = Staff;
        this.sequelize = sequelize;
        Object.getOwnPropertyNames(IDoctorRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IDoctorRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAll() {
        try {
            return await this.Doctor.findAll({
                include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }]
            });
        } catch (error) {
            console.error('Error fetching all doctors:', error);
            throw error;
        }
    }

    async findById(doctorId) {
        console.log(`Repository: Fetching doctor with ID ${doctorId}`);
        const doctor = await this.Doctor.findByPk(doctorId);
        if (!doctor) throw new Error("Doctor not found");
        return doctor;
    }

    async create(doctorData) {
        console.log("Repository: Creating a new doctor with data:", doctorData);
        return await this.Doctor.create(doctorData);
    }

    async update(doctorId, doctorData) {
        console.log(`Repository: Updating doctor with ID ${doctorId}`);
        const [updated] = await this.Doctor.update(doctorData, { where: { Doctor_ID: doctorId } });
        if (!updated) throw new Error("Doctor not found or no changes made");
        return updated;
    }

    async delete(doctorId) {
        console.log(`Repository: Deleting doctor with ID ${doctorId}`);
        return await this.sequelize.transaction(async (transaction) => {
            const doctor = await this.Doctor.findByPk(doctorId, { transaction });
            if (!doctor) throw new Error("Doctor not found");

            await Promise.all([
                this.Staff.destroy({ where: { Emp_ID: doctor.Emp_ID }, transaction }),
                this.Doctor.destroy({ where: { Doctor_ID: doctorId }, transaction })
            ]);

            console.log(`Repository: Doctor with ID ${doctorId} deleted successfully`);
            return { success: true, message: `Doctor with ID ${doctorId} deleted successfully` };
        });
    }

    async findBySpecialization(specialization) {
        console.log(`Repository: Checking if doctor with specialization ${specialization} exists`);
        return await this.Doctor.findOne({ where: { Specialization: specialization } });
    }
}

module.exports = new DoctorRepository();
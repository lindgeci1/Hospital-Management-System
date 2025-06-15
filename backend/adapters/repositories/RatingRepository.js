const Rating = require("../../core/entities/Rating");
const Staff = require("../../core/entities/Staff");
const sequelize = require("../../core/config/database");
const IRatingRepository = require("../../ports/PersistencePorts/IRatingRepository");


class RatingRepository extends IRatingRepository{
    constructor() {
        super();
        this.Rating = Rating;
        this.Staff = Staff;
        this.sequelize = sequelize;
        Object.getOwnPropertyNames(IRatingRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IRatingRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAll() {
        return await this.Rating.findAll({
            include: [{ model: this.Staff, attributes: ["Emp_Fname", "Emp_Lname"] }],
        });
    }

    async findAllForDoctor(email) {
        const staff = await this.Staff.findOne({ where: { Email: email } });
        if (!staff) throw new Error("Staff not found");

        return await this.Rating.findAll({
            where: { Emp_ID: staff.Emp_ID },
            include: [{ model: this.Staff, attributes: ["Emp_Fname", "Emp_Lname"] }],
        });
    }

    async findById(ratingId) {
        return await this.Rating.findByPk(ratingId, {
            include: [{ model: this.Staff, attributes: ["Emp_Fname", "Emp_Lname"] }],
        });
    }

    async findByStaffId(empId) {
        return await this.Rating.findOne({ where: { Emp_ID: empId } });
    }

    async create(ratingData) {
        return await this.Rating.create(ratingData);
    }

    async update(ratingId, ratingData) {
        return await this.Rating.update(ratingData, { where: { Rating_ID: ratingId } });
    }

    async delete(ratingId) {
        return await this.Rating.destroy({ where: { Rating_ID: ratingId } });
    }
}

module.exports = RatingRepository;
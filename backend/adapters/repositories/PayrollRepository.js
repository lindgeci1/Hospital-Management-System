const Payroll = require("../../core/entities/Payroll");
const Staff = require("../../core/entities/Staff");
const sequelize = require("../../core/config/database");
const IPayrollRepository = require("../../ports/PersistencePorts/IPayrollRepository");

class PayrollRepository extends IPayrollRepository{
    constructor() {
        super();
        this.Payroll = Payroll;
        this.Staff = Staff;
        this.sequelize = sequelize;
        Object.getOwnPropertyNames(IPayrollRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IPayrollRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAll() {
        try {
            const payrolls = await this.Payroll.findAll({
                include: [{ model: this.Staff, attributes: ["Emp_Fname", "Emp_Lname"] }],
            });
            return payrolls;
        } catch (error) {
            console.error("Error fetching payroll records:", error);
            throw error;
        }
    }

    async findByStaffEmail(email) {
        try {
            const staff = await this.Staff.findOne({ where: { Email: email } });
            if (!staff) throw new Error("Staff member not found");
            return await this.Payroll.findAll({
                where: { Emp_ID: staff.Emp_ID },
                include: [{ model: this.Staff, attributes: ["Emp_Fname", "Emp_Lname"] }],
            });
        } catch (error) {
            console.error("Error fetching payroll by staff email:", error);
            throw error;
        }
    }

    async findById(payrollId) {
        try {
            const payroll = await this.Payroll.findByPk(payrollId, { include: [this.Staff] });
            if (!payroll) throw new Error("Payroll record not found");
            return payroll;
        } catch (error) {
            console.error("Error fetching payroll by ID:", error);
            throw error;
        }
    }

    async findByStaffId(staffId) {
        return await this.Payroll.findOne({ where: { Emp_ID: staffId } });
    }

    async create(payrollData) {
        try {
            const staffExists = await this.Staff.findByPk(payrollData.Emp_ID);
            if (!staffExists) {
                throw new Error("Staff member not found");
            }
            const newPayroll = await this.Payroll.create(payrollData);
            return newPayroll;
        } catch (error) {
            console.error("Error creating payroll record:", error);
            throw error;
        }
    }

    async update(payrollId, payrollData) {
        try {
            const [updatedRows] = await this.Payroll.update(payrollData, { where: { Account_no: payrollId } });
            if (updatedRows === 0) throw new Error("Payroll record not found or not updated");
            return updatedRows;
        } catch (error) {
            console.error("Error updating payroll record:", error);
            throw error;
        }
    }

    async delete(payrollId) {
        const transaction = await this.sequelize.transaction();
        try {
            const payroll = await this.Payroll.findByPk(payrollId);
            if (!payroll) throw new Error("Payroll record not found");
            await this.Payroll.destroy({ where: { Account_no: payrollId }, transaction });
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            console.error("Error deleting payroll record:", error);
            throw error;
        }
    }
}

module.exports = PayrollRepository;
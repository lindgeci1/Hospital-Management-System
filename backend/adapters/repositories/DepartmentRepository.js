const Department = require("../../core/entities/Department");
const Staff = require("../../core/entities/Staff"); // Import Staff model
const sequelize = require("../../core/config/database");
const IDepartmentRepository = require("../../ports/PersistencePorts/IDepartmentRepository");


class DepartmentRepository extends IDepartmentRepository {
    constructor() {
        super();
        this.Department = Department;
        this.Staff = Staff;
        this.sequelize = sequelize;
        Object.getOwnPropertyNames(IDepartmentRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IDepartmentRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAll() {
        return await this.Department.findAll();
    }

    async findById(departmentId) {
        console.log(`Repository: Fetching department with ID ${departmentId}`);
        const department = await this.Department.findByPk(departmentId);
        if (!department) throw new Error("Department not found");
        return department;
    }

    async create(departmentData) {
        console.log("Repository: Creating a new department with data:", departmentData);
        return await this.Department.create(departmentData);
    }

    async update(departmentId, departmentData) {
        console.log(`Repository: Updating department with ID ${departmentId}`);
        const [updated] = await this.Department.update(departmentData, { where: { Dept_ID: departmentId } });
        if (!updated) throw new Error("Department not found or no changes made");
        return updated;
    }

    async delete(departmentId) {
        console.log(`Repository: Deleting department with ID ${departmentId}`);
        const transaction = await this.sequelize.transaction();

        try {
            const department = await this.Department.findByPk(departmentId, { transaction });
            if (!department) throw new Error("Department not found");

            await this.Staff.destroy({ where: { Dept_ID: departmentId }, transaction });
            await this.Department.destroy({ where: { Dept_ID: departmentId }, transaction });

            await transaction.commit();
            console.log(`Repository: Department with ID ${departmentId} deleted successfully`);
            return { success: true, message: `Department with ID ${departmentId} deleted successfully` };
        } catch (error) {
            await transaction.rollback();
            console.error(`Repository: Failed to delete department with ID ${departmentId}`, error);
            throw error;
        }
    }

    async findByName(deptName) {
        console.log(`Repository: Checking if department with name ${deptName} exists`);
        return await this.Department.findOne({ where: { Dept_name: deptName } });
    }
}

module.exports = new DepartmentRepository();
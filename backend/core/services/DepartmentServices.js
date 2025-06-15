const DepartmentRepository = require("../../adapters/repositories/DepartmentRepository");
const IDepartmentService = require("../../ports/ServicePorts/IDepartmentService"); 
class DepartmentService extends IDepartmentService{
    constructor(departmentRepository) {
        super();
        this.departmentRepository = departmentRepository;
        Object.getOwnPropertyNames(IDepartmentService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IDepartmentService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAllDepartments() {
        console.log("Service: Finding all departments");
        return await this.departmentRepository.findAll();
    }

    async findSingleDepartment(departmentId) {
        console.log(`Service: Finding department with ID ${departmentId}`);
        return await this.departmentRepository.findById(departmentId);
    }

    async addDepartment(departmentData) {
        console.log("Service: Adding new department with data:", departmentData);
        const { Dept_head, Dept_name, Emp_Count } = departmentData;

        if (!Dept_head || !Dept_name || !Emp_Count) {
            throw new Error("Department head, name, and count are required");
        }

        const existingDepartment = await this.departmentRepository.findByName(Dept_name);
        if (existingDepartment) {
            throw new Error("A department with this name already exists");
        }

        return await this.departmentRepository.create(departmentData);
    }

    async updateDepartment(departmentId, departmentData) {
        console.log(`Service: Updating department with ID ${departmentId}`);
        const { Dept_head, Dept_name, Emp_Count } = departmentData;

        if (!Dept_head || !Dept_name || !Emp_Count) {
            throw new Error("Department head, name, and count are required");
        }

        const existingDepartment = await this.departmentRepository.findById(departmentId);
        if (!existingDepartment) {
            throw new Error("Department not found");
        }

        if (existingDepartment.Dept_name !== Dept_name) {
            const departmentWithSameName = await this.departmentRepository.findByName(Dept_name);
            if (departmentWithSameName) {
                throw new Error("A department with this name already exists");
            }
        }

        const updatedDepartment = await this.departmentRepository.update(departmentId, departmentData);
        console.log("Department updated successfully:", updatedDepartment);

        return {
            message: "Department updated successfully",
            department: updatedDepartment
        };
    }

    async deleteDepartment(departmentId) {
        console.log(`Service: Deleting department with ID ${departmentId}`);
        await this.departmentRepository.findById(departmentId);

        return await this.departmentRepository.delete(departmentId);
    }
}

module.exports = new DepartmentService(DepartmentRepository);

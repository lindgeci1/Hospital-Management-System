const IPayrollService = require("../../ports/ServicePorts/IPayrollService");
class PayrollService extends IPayrollService {
    constructor(payrollRepository) {
        super();
        this.payrollRepository = payrollRepository;
        Object.getOwnPropertyNames(IPayrollService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IPayrollService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAllPayrolls(user) {
        const { email, role } = user;
        if (role === "admin") {
            return await this.payrollRepository.findAll();
        } else if (role === "doctor") {
            return await this.payrollRepository.findByStaffEmail(email);
        } else {
            throw new Error("Unauthorized access");
        }
    }

    async findSinglePayroll(payrollId) {
        return await this.payrollRepository.findById(payrollId);
    }

    async addPayroll(payrollData) {
        console.log("CREATING A PAYROLL COMPONENT..."); //
        const { Salary, Emp_ID } = payrollData;

        if (!Salary || !Emp_ID) {
            throw new Error("Invalid or missing data");
        }

        const existingPayroll = await this.payrollRepository.findByStaffId(Emp_ID);
        if (existingPayroll) {
            throw new Error("A payroll record already exists for this employee");
        }

        return await this.payrollRepository.create(payrollData);
    }

    async updatePayroll(payrollId, payrollData) {
        const { Salary, Emp_ID } = payrollData;

        if (!Salary || !Emp_ID) {
            throw new Error("Invalid or missing data");
        }

        const existingPayroll = await this.payrollRepository.findById(payrollId);
        if (!existingPayroll) {
            throw new Error("Payroll record not found");
        }

        if (existingPayroll.Emp_ID !== Emp_ID) {
            const employeePayroll = await this.payrollRepository.findByStaffId(Emp_ID);
            if (employeePayroll) {
                throw new Error("This employee already has another payroll record");
            }
        }

        const updatedPayroll = await this.payrollRepository.update(payrollId, payrollData);
        return {
            message: "Payroll updated successfully",
            data: updatedPayroll,
        };
    }

    async deletePayroll(payrollId) {
        return await this.payrollRepository.delete(payrollId);
    }
}

module.exports = PayrollService;
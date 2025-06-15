const StaffRepository = require("../../adapters/repositories/StaffRepository");
const IStaffService = require("../../ports/ServicePorts/IStaffService");
class StaffService extends IStaffService {
    constructor(staffRepository) {
        super();
        this.staffRepository = staffRepository;
        Object.getOwnPropertyNames(IStaffService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IStaffService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAllStaff(user) {
        const { email, role } = user;
        if (role === "admin") {
            return await this.staffRepository.findAll();
        } else if (role === "doctor") {
            const doctor = await this.staffRepository.getDoctorByStaffEmail(email);
            if (!doctor) {
                throw new Error("Doctor not found(StaffService)");
            }
            return await this.staffRepository.findAll({ Emp_ID: doctor.Emp_ID });
        } else {
            throw new Error("Unauthorized access");
        }
    }

    async findSingleStaff(staffId) {
        return await this.staffRepository.findById(staffId);
    }

    async findStaffByEmail(email) {
        return await this.staffRepository.findByEmail(email);
    }

    async findDoctors() {
        return await this.staffRepository.findDoctors();
    }

    async addStaff(staffData) {
        const { Personal_Number, Emp_Fname, Emp_Lname, Joining_Date, Birth_Date, Email, Dept_ID, Gender, Phone, Qualifications, Specialization } = staffData;

        if (!Personal_Number||!Emp_Fname || !Emp_Lname || !Joining_Date || !Birth_Date||!Email || !Dept_ID || !Gender || !Phone || !Qualifications || !Specialization) {
            throw new Error('All fields are required');
        }

        if (!this.validateEmail(Email)) {
            throw new Error('Invalid email format');
        }

        return await this.staffRepository.create(staffData);
    }

    async updateStaff(staffId, staffData) {
        const { Personal_Number, Emp_Fname, Emp_Lname, Joining_Date, Birth_Date, Email, Dept_ID, Gender, Phone, Qualifications, Specialization } = staffData;

        if (!Personal_Number||!Emp_Fname || !Emp_Lname || !Joining_Date || !Birth_Date|| !Email || !Dept_ID || !Gender || !Phone ||!Qualifications || !Specialization) {
            throw new Error('All fields are required');
        }

        if (!this.validateEmail(Email)) {
            throw new Error('Invalid email format');
        }

        return await this.staffRepository.update(staffId, staffData);
    }

    async deleteStaff(staffId) {
        return await this.staffRepository.delete(staffId);
    }

    async checkStaffExistence(staffId) {
        return await this.staffRepository.checkExistence(staffId);
    }

    async getDoctorByStaffEmail(email) {
        return await this.staffRepository.getDoctorByStaffEmail(email);
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
}

module.exports = new StaffService(StaffRepository);

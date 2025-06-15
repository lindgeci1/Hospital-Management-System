const Staff = require("../../core/entities/Staff");
const Department = require("../../core/entities/Department");
const Doctor = require("../../core/entities/Doctor");
const User = require("../../core/entities/User");
const { Op, Sequelize } = require("sequelize");
const IStaffRepository = require("../../ports/PersistencePorts/IStaffRepository");


class StaffRepository extends IStaffRepository{
    constructor() {
        super();
        this.Staff = Staff;
        this.Department = Department;
        this.Doctor = Doctor;
        this.User = User;
        Object.getOwnPropertyNames(IStaffRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IStaffRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAll(condition = {}) {
        return await this.Staff.findAll({
            where: condition,
            include: [{ model: this.Department }],
        });
    }

    async findById(staffId) {
        return await this.Staff.findByPk(staffId, {
            include: [{ model: this.Department }],
        });
    }

    async findByEmail(email) {
        return await this.Staff.findOne({
            where: { Email: email },
            include: [{ model: this.Department }],
        });
    }

    async findDoctors() {
        return await this.Staff.findAll({
            where: { Emp_type: "doctor" },
            include: [{ model: this.Department, attributes: ["Dept_name"] }],
        });
    }

    async create(staffData) {
        try {
            const { Personal_Number, Emp_Fname, Emp_Lname, Joining_Date, Emp_type, Email, Dept_ID, Phone, Birth_Date, Gender, Qualifications, Specialization } = staffData;

            const existingStaff = await this.Staff.findOne({
                where: { Email, Personal_Number, Phone }
            });

            if (existingStaff) {
                throw new Error('Staff member with the same Email, Personal Number, and Phone already exists');
            }

            const department = await this.Department.findOne({ where: { Dept_ID } });
            if (!department) {
                throw new Error('Department not found');
            }
            const existingEmail = await this.Staff.findOne({ where: { Email } });
            if (existingEmail) {
                throw new Error('Staff member with the same Email already exists');
            }
            const existingPhone = await this.Staff.findOne({ where: { Phone } });
            if (existingPhone) {
                throw new Error('Staff member with the same Phone already exists');
            }
            const existingpersonalNumber = await this.Staff.findOne({ where: { Personal_Number } });
            if (existingpersonalNumber) {
                throw new Error('Staff member with the same Personal Number already exists');
            }

                // Fetch the user by email
                const user = await this.User.findOne({ where: { email: Email } });

                let userId = null;
                if (user) {
                    userId = user.user_id; // Get the user_id from the existing user
                } else {
                    // If the user does not exist, return an error
                    throw new Error('No user found with the provided email.');
                }


            const newStaff = await this.Staff.create({
                Personal_Number, Emp_Fname, Emp_Lname, Joining_Date, Emp_type, Email, Dept_ID, Birth_Date, Phone, Qualifications, Gender, Specialization, user_id: user.user_id
            });

            if (Emp_type === 'Doctor') {
                await this.Doctor.create({
                    Emp_ID: newStaff.Emp_ID,
                    Qualifications: Qualifications || 'testtest',
                    Specialization: Specialization || 'testtest'
                });
            }

            return newStaff;
        } catch (error) {
            console.error('Error adding staff:', error);
            throw new Error(error.message || 'Internal Server Error');
        }
    }

    async update(staffId, staffData) {
        try {
            const { Personal_Number, Emp_Fname, Emp_Lname, Joining_Date, Emp_type, Email, Dept_ID, Birth_Date, Phone, Gender, Qualifications, Specialization } = staffData;

            const existingStaff = await this.Staff.findOne({
                where: {
                    Email, Personal_Number, Emp_Lname, Emp_ID: { [Op.ne]: staffId }
                }
            });

            if (existingStaff) {
                throw new Error('Staff member with the same Email, Personal Number, and Phone already exists');
            }
            // Check if a staff member with the same Email exists (excluding the current staff member)
            const existingEmail = await this.Staff.findOne({
                where: {
                    Email,
                    Emp_ID: { [Op.ne]: staffId } // Exclude the current staff member
                }
            });
            if (existingEmail) {
                throw new Error('Staff member with the same Email already exists');
            }


            const existingpersonalNumber = await this.Staff.findOne({
                where: {
                    Personal_Number,
                    Emp_ID: { [Op.ne]: staffId } // Exclude the current staff member
                }
            });
            if (existingpersonalNumber) {
                throw new Error('Staff member with the same Personal Number already exists');
            }


            const existingPhone = await this.Staff.findOne({
                where: {
                    Phone,
                    Emp_ID: { [Op.ne]: staffId } // Exclude the current staff member
                }
            });
            if (existingPhone) {
                throw new Error('Staff member with the same Phone already exists');
            }


            const [updated] = await this.Staff.update(
                { Personal_Number, Emp_Fname, Emp_Lname, Joining_Date, Emp_type, Email, Dept_ID, Phone, Birth_Date, Gender, Qualifications, Specialization },
                { where: { Emp_ID: staffId } }
            );

            if (updated === 0) {
                throw new Error('Staff not found or not updated');
            }

            if (Emp_type === 'Doctor' && (Qualifications || Specialization)) {
                await this.Doctor.update(
                    { Qualifications, Specialization },
                    { where: { Emp_ID: staffId } }
                );
            }

            return { success: true, message: 'Staff updated successfully' };
        } catch (error) {
            console.error('Error updating staff:', error);
            throw new Error(error.message || 'Internal Server Error');
        }
    }

    async delete(staffId) {
        const staffMember = await this.Staff.findOne({ where: { Emp_ID: staffId } });
        if (!staffMember) {
            throw new Error("Staff not found");
        }

        const deletedStaff = await this.Staff.destroy({ where: { Emp_ID: staffId } });
        if (deletedStaff === 0) {
            throw new Error("Staff not found or not deleted");
        }

        const deletedUser = await this.User.destroy({ where: { email: staffMember.Email } });
        if (deletedUser === 0) {
            throw new Error("User associated with staff not found");
        }

        return deletedStaff;
    }

    async checkExistence(staffId) {
        const staff = await this.Staff.findByPk(staffId);
        if (!staff) {
            throw new Error("Staff not found");
        }
        return staff;
    }

    async getDoctorByStaffEmail(email) {
        const staff = await this.Staff.findOne({ where: { Email: email } });
        if (!staff) {
            throw new Error('Staff member not found');
        }

        const doctor = await this.Doctor.findOne({ where: { Emp_ID: staff.Emp_ID } });
        if (!doctor) {
            throw new Error('Doctor not found(StaffRepository)');
        }

        return doctor;
    }
}

module.exports = new StaffRepository();
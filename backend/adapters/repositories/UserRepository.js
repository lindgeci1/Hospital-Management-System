const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const VerificationCode = require("../../core/entities/VerificationCode");
const User = require("../../core/entities/User");
const UserRole = require("../../core/entities/UserRole");
require("dotenv").config();
const Role = require("../../core/entities/Role");
const { Op, Sequelize } = require("sequelize");
const Patient = require("../../core/entities/Patient");
const Staff = require("../../core/entities/Staff");
const IUserRepository = require("../../ports/PersistencePorts/IUserRepository");
const codeTemplate = require("../../core/config/passwordVerifyTemplate");
const generatePasswordChangedEmail = require("../../core/config/passwordChangedTemplate");

class UserRepository extends IUserRepository {
  constructor() {
    super();
    this.Staff = Staff;
    this.UserRole = UserRole;
    this.Role = Role;
    this.User = User;
    this.Patient = Patient;
    this.Sequelize = Sequelize;
    Object.getOwnPropertyNames(IUserRepository.prototype).forEach((m) => {
      if (m !== "constructor" && this[m] === IUserRepository.prototype[m])
        throw new Error(`Method ${m} is not implemented`);
    });
  }

  async findSingleUser(userId) {
    try {
      return await User.findByPk(userId, {
        include: [
          {
            model: UserRole,
            include: { model: Role, attributes: ["role_name"] },
          },
        ],
      });
    } catch (error) {
      throw new Error("Error finding user by ID: " + error.message);
    }
  }
  async checkUserRegistrationStatus(email, role) {
    try {
      if (role.toLowerCase() === "patient") {
        const patient = await this.Patient.findOne({ where: { Email: email } });
        if (!patient) return { error: "Patient not found" };
        return {
          message:
            patient.Personal_Number === null
              ? "Patient not registered fully"
              : "Patient registered fully",
        };
      } else if (role.toLowerCase() === "doctor") {
        const staff = await this.Staff.findOne({ where: { Email: email } });
        if (!staff) return { error: "Staff not found" };
        return {
          message:
            staff.Personal_Number === null
              ? "Staff not registered fully"
              : "Staff registered fully",
        };
      } else {
        // For roles other than patient or staff (e.g., admin), return a default message.
        return { message: "Registration check not applicable" };
      }
    } catch (error) {
      throw new Error("Error checking registration status: " + error.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email },
        include: [
          {
            model: UserRole,
            include: [{ model: Role, attributes: ["role_name"] }],
          },
        ],
      });

      if (!user) return { error: "User not found" };
      return { success: true, data: user };
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return { error: "Internal server error" };
    }
  }

  async getPatientByEmail(email) {
    try {
      const patient = await Patient.findOne({ where: { Email: email } });

      if (!patient) throw new Error("Patient not found");

      return patient;
    } catch (error) {
      console.error("Error fetching patient by email:", error);
      throw error;
    }
  }

  async getUsersWithRoles() {
    try {
      const users = await User.findAll({
        include: [
          {
            model: UserRole,
            include: [{ model: Role, attributes: ["role_name"] }],
          },
        ],
        attributes: ["user_id", "username", "email"],
      });

      return users.map((user) => ({
        ...user.toJSON(),
        role:
          user.UserRoles.length > 0
            ? user.UserRoles[0].Role.role_name
            : "No Role",
      }));
    } catch (error) {
      console.error("Error fetching users with roles:", error);
      throw new Error("Internal server error");
    }
  }

  async sendVerificationCode(email) {
    try {
      const user = await this.User.findOne({ where: { email } });
      if (!user) {
        console.error("User not found for email:", email);
        return { error: "Email does not exist" };
      }

      console.log("Retrieved user:", user); // Debugging log
      console.log("User ID:", user.user_id);
      // ✅ Fix: Use user.user_id instead of user.id
      const activeVerificationCode = await VerificationCode.findOne({
        where: {
          user_id: user.user_id,
          expiration: { [Op.gt]: new Date() },
        },
        order: [["created_at", "DESC"]],
      });

      if (activeVerificationCode) {
        await VerificationCode.destroy({
          where: { user_id: user.user_id, code: activeVerificationCode.code },
        });
        console.log("Previous active verification code deleted");
      }

      const code = crypto.randomInt(100000, 999999).toString();
      await VerificationCode.create({
        user_id: user.user_id, // ✅ Fix: Using `user.user_id`
        email: user.email, // ✅ Keep email for reference
        code,
        expiration: new Date(Date.now() + 1 * 60 * 1000),
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: "Password Reset Verification Code",
        html: codeTemplate(user.username, code),
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Verification code sent successfully");

      setTimeout(async () => {
        await VerificationCode.destroy({
          where: { user_id: user.user_id, code },
        });
        console.log("⏳ Verification code expired and removed from database");
      }, 60 * 1000);

      return { success: true, message: "Verification code sent successfully" };
    } catch (error) {
      console.error("❌ Error sending verification code:", error);
      return { error: "Internal server error" };
    }
  }
  async checkVerificationCode(email, code) {
    try {
      if (!/^\d{6}$/.test(code))
        return {
          error: "Invalid verification code. The code must be 6 digits long.",
        };

      const user = await this.User.findOne({ where: { email } });
      if (!user) return { error: "Email does not exist" };

      const verificationRecord = await VerificationCode.findOne({
        where: { user_id: user.user_id, code}, // ✅ Now using user_id
        order: [["created_at", "DESC"]],
      });

      if (!verificationRecord) return { error: "Invalid verification code" };
      if (verificationRecord.expiration < new Date())
        return { error: "Verification code has expired" };

      console.log("Verification code is valid");
      return { success: true, message: "Verification code is valid" };
    } catch (error) {
      console.error("Error checking verification code:", error);
      return { error: "Internal server error" };
    }
  }

  async AddUser(userData) {
    try {
      const { email, username, password, role } = userData;

      if (!email || !username || !password || !role)
        return { error: "All fields are required" };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return { error: "Invalid email address" };

      if (username.length < 3)
        return { error: "Username must be at least 3 characters long" };

      if (password.length < 6)
        return { error: "Password must be at least 6 characters long" };

      const existingUser = await User.findOne({ where: { username } });
      if (existingUser)
        return { error: "User with the same username already exists" };

      const existingUser1 = await User.findOne({ where: { email } });
      if (existingUser1)
        return { error: "User with the same email already exists" };

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
      });

      const userRole = await Role.findOne({ where: { role_name: role } });
      if (!userRole) return { error: "Invalid role" };

      await UserRole.create({
        user_id: newUser.user_id,
        role_id: userRole.role_id,
      });

      return {
        success: true,
        message: "User added successfully",
        data: newUser,
      };
    } catch (error) {
      console.error("Error adding user:", error.message, error.stack);
      return { error: "Internal Server Error" };
    }
  }

  async UpdateUser(userId, userData) {
    try {
      const { email, username, password, role } = userData;

      if (!email || !username || !role || !password)
        return { error: "Email, Username, and Role are required" };

      const user = await User.findOne({ where: { user_id: userId } });
      if (!user) return { error: "User not found" };

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) return { error: "You entered the old password!" };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return { error: "Invalid email address" };

      if (username.length < 3)
        return { error: "Username must be at least 3 characters long" };

      const existingEmail = await User.findOne({
        where: { email, user_id: { [Op.ne]: userId } },
      });
      if (existingEmail)
        return { error: "User with the same email already exists" };

      const existingUsername = await User.findOne({
        where: { username, user_id: { [Op.ne]: userId } },
      });
      if (existingUsername)
        return { error: "User with the same username already exists" };

      const dataChanged =
        user.email !== email ||
        user.username !== username ||
        user.role !== role ||
        user.password !== password;

      if (!dataChanged)
        return { success: true, message: "No changes detected" };

      if (password && user.password !== password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.update(
          { email, username, role, password: hashedPassword },
          { where: { user_id: userId } }
        );

        const mailOptions = generatePasswordChangedEmail(username, email);
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        await transporter.sendMail(mailOptions);
      } else {
        await User.update(
          { email, username, role },
          { where: { user_id: userId } }
        );
      }

      const updatedUser = await User.findOne({ where: { user_id: userId } });

      const userRole = await Role.findOne({ where: { role_name: role } });
      if (!userRole) return { error: "Invalid role" };

      await UserRole.update(
        { role_id: userRole.role_id },
        { where: { user_id: userId } }
      );

      return {
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      return { error: "Internal Server Error" };
    }
  }

  async DeleteUser(userId) {
    try {
      const existingUser = await User.findOne({ where: { user_id: userId } });
      if (!existingUser) return { error: "User not found" };

      const userEmail = existingUser.email;

      await Staff.destroy({ where: { email: userEmail } });
      await Patient.destroy({ where: { email: userEmail } });

      await User.destroy({ where: { user_id: userId } });

      return {
        success: true,
        message: "User and associated staff/patients deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { error: "Internal Server Error" };
    }
  }
}
module.exports = new UserRepository();

const UserRepository = require("../../adapters/repositories/UserRepository");
const IUserService = require("../../ports/ServicePorts/IUserService");

class UserService extends IUserService {
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
        Object.getOwnPropertyNames(IUserService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IUserService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });

    }

    async findSingleUser(userId) {
        return await this.userRepository.findSingleUser(userId);
    }

    async AddUser(userData) {
        try {
            return await this.userRepository.AddUser(userData);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async checkUserRegistrationStatus(email, role) {
        try {
          const result = await this.userRepository.checkUserRegistrationStatus(email, role);
          return result;
        } catch (error) {
          console.error("Error in UserService.checkUserRegistrationStatus:", error);
          return { error: "Internal Server Error" };
        }
      }
      
      async sendVerificationCode(email) {  // Default to 'payment' if not specified
        console.log("Service: Sending verification code to email:", email);
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("Service: Invalid email format:", email);
            return { error: 'Invalid email address format' };
        }
    
        try {
            const result = await this.userRepository.sendVerificationCode(email);  // Pass type to repository method
            console.log("Service: Verification code sent successfully");
            return result;
        } catch (error) {
            console.error("Error in UserService.sendVerificationCode:", error);
            return { error: 'Internal Server Error' };
        }
    }
    

    async checkVerificationCode(email, code) {  // Default to 'payment' if not specified
        console.log("Service: Checking verification code for email:", email);
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("Service: Invalid email format:", email);
            return { error: 'Invalid email address format' };
        }
    
        if (!/^\d{6}$/.test(code)) {
            console.log("Service: Invalid code format:", code);
            return { error: 'Verification code must be 6 digits' };
        }
    
        try {
            const result = await this.userRepository.checkVerificationCode(email, code);  // Pass type to repository method
            console.log("Service: Verification code is valid");
            return result;
        } catch (error) {
            console.error("Error in UserService.checkVerificationCode:", error);
            return { error: 'Internal Server Error' };
        }
    }
    

    async getUserByEmail(email) {
        console.log("Service: Fetching user by email:", email);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { error: 'Invalid email address format' };
        }

        try {
            const result = await this.userRepository.getUserByEmail(email);
            console.log("Service: User fetched successfully");
            return result;
        } catch (error) {
            console.error("Error in UserService.getUserByEmail:", error);
            return { error: 'Internal Server Error' };
        }
    }

    async UpdateUser(userId, userData) {
        return await this.userRepository.UpdateUser(userId, userData);
    }

    async DeleteUser(userId) {
        try {
            return await this.userRepository.DeleteUser(userId);
        } catch (error) {
            console.error("Error in UserService.DeleteUser:", error);
            return { error: 'Internal Server Error' };
        }
    }

    async getUsersWithRoles() {
        return await this.userRepository.getUsersWithRoles();
    }
}

module.exports = new UserService(UserRepository);
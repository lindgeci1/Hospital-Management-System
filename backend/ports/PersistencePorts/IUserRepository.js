class IUserRepository {
    async getUserByEmail(userData) {
        try {
            console.log(`Method: getUserByEmail called with userData: ${JSON.stringify(userData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in getUserByEmail: ${error.message}`);
        }
    }

    async UpdateUser(userId, userData) {
        try {
            console.log(`Method: UpdateUser called with userId: ${userId} and userData: ${JSON.stringify(userData)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in UpdateUser: ${error.message}`);
        }
    }
    async checkUserRegistrationStatus(email, role) {
        try {
            console.log(`Method: checkUserRegistrationStatus called with userId: ${email} and userData: ${JSON.stringify(role)}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in checkUserRegistrationStatus: ${error.message}`);
        }
    }


    async DeleteUser(userId) {
        try {
            console.log(`Method: DeleteUser called with userId: ${userId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in DeleteUser: ${error.message}`);
        }
    }
    
    async findSingleUser(userId) {
        try {
            console.log(`Method: findSingleUser called with userId: ${userId}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in findSingleUser: ${error.message}`);
        }
    }

    async getPatientByEmail(email) {
        try {
            console.log(`Method: getPatientByEmail called with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in getPatientByEmail: ${error.message}`);
        }
    }

    async sendVerificationCode(email) {
        try {
            console.log(`Method: sendVerificationCode called with email: ${email}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in sendVerificationCode: ${error.message}`);
        }
    }

    async checkVerificationCode(email, code) {
        try {
            console.log(`Method: checkVerificationCode called with email: ${email, code}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in checkVerificationCode: ${error.message}`);
        }
    }

    async AddUser(userData) {
        try {
            console.log(`Method: AddUser called with email: ${email, code}`);
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in AddUser: ${error.message}`);
        }
    }

    async getUsersWithRoles() {
        try {
            console.log("Method: getUsersWithRoles called");
            throw new Error("Method not implemented");
        } catch (error) {
            console.error(`Error in getUsersWithRoles: ${error.message}`);
        }
    }
}

module.exports = IUserRepository;

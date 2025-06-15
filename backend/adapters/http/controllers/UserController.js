const UserService = require("../../../core/services/UserService");

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async findSingleUser(req, res) {
        try {
            const user = await this.userService.findSingleUser(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
                // In UserController.js, add this method:
            async checkUserRegistrationStatus(req, res) {
                const { email, role } = req.params;
                try {
                const result = await this.userService.checkUserRegistrationStatus(email, role);
                if (result.error) {
                    return res.status(400).json({ error: result.error });
                }
                return res.status(200).json(result);
                } catch (error) {
                console.error("Error in Controller.checkUserRegistrationStatus:", error);
                return res.status(500).json({ error: 'Internal Server Error' });
                }
            }
  
        async sendVerificationCode(req, res) {
            const { email, type = 'password' } = req.body;  // Include type in the request body, default to 'payment'
            console.log("Controller: Sending verification code to email:", email);

            try {
                const result = await this.userService.sendVerificationCode(email, type);  // Pass type to service method
                if (result.error) {
                    return res.status(400).json({ error: result.error });
                }
                res.status(200).json(result);
            } catch (error) {
                console.error("Error in Controller.sendVerificationCode:", error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }


    async getUserByEmail(req, res) {
        const { email } = req.params;
        console.log("Controller: Fetching user by email:", email);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address format' });
        }

        try {
            const result = await this.userService.getUserByEmail(email);
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error("Error in Controller.getUserByEmail:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async checkVerificationCode(req, res) {
        const { email, code, type = 'password' } = req.body;  // Include type in the request body, default to 'payment'
        console.log("Controller: Checking verification code for email:", email);
    
        try {
            const result = await this.userService.checkVerificationCode(email, code, type);  // Pass type to service method
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error("Error in Controller.checkVerificationCode:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    


    async AddUser(req, res) {
        const { email, username, password, role } = req.body;
        try {
            const result = await this.userService.AddUser({ email, username, password, role });
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            res.json({ success: true, message: result.message, data: result.data });
        } catch (error) {
            console.error("Error in Controller.AddUser:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async UpdateUser(req, res) {
        try {
            const updatedUser = await this.userService.UpdateUser(req.params.id, req.body);
            if (updatedUser.success) {
                return res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser.data });
            }
            res.status(400).json({ error: updatedUser.error });
        } catch (error) {
            console.error("Error in Controller.UpdateUser:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async DeleteUser(req, res) {
        try {
            const deletedUser = await this.userService.DeleteUser(req.params.id);
            if (deletedUser.error) {
                return res.status(404).json({ message: deletedUser.error });
            }
            res.json({ success: true, message: deletedUser.message });
        } catch (error) {
            console.error("Error in Controller.DeleteUser:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getUsersWithRoles(req, res) {
        try {
            const users = await this.userService.getUsersWithRoles();
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserController(UserService);
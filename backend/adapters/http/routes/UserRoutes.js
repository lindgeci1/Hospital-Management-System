const express = require("express");
const cookieParser = require("cookie-parser");
const { authenticateToken } = require('../../middleware/authMiddleware');
const UserController = require("../controllers/UserController");
const { loginUser, registerUser, refreshToken, logoutUser, getLoggedInUserData, getTokenExpiration } = require("../../repositories/AuthRepository");

class UserRoutes {
    constructor() {
        this.router = express.Router();
        // Use cookie-parser middleware for all routes in this router
        this.router.use(cookieParser());
        this.initializeRoutes();
    }

    initializeRoutes() {
        // User routes with role-based authentication
        this.router.get("/users", UserController.getUsersWithRoles.bind(UserController));
        this.router.get("/users/:id", UserController.findSingleUser.bind(UserController));
        this.router.post("/users/create", authenticateToken(['admin', 'doctor', 'patient']), UserController.AddUser.bind(UserController));
        this.router.put("/users/update/:id", UserController.UpdateUser.bind(UserController));
        this.router.delete("/users/delete/:id", authenticateToken(['admin', 'doctor', 'patient']), UserController.DeleteUser.bind(UserController));

        // Additional user-specific routes
        this.router.post("/users/send-verification-code", UserController.sendVerificationCode.bind(UserController));
        this.router.get("/users/email/:email", UserController.getUserByEmail.bind(UserController));
        this.router.post("/users/check-verification-code", UserController.checkVerificationCode.bind(UserController));
        this.router.get("/users/registration-status/:email/:role", UserController.checkUserRegistrationStatus.bind(UserController));
  
        // Routes for login, registration, and token refreshing
        this.router.post("/login", loginUser);
        this.router.post("/register", registerUser);
        this.router.post("/refresh", refreshToken);
        this.router.post("/logout",  logoutUser);
        this.router.get("/user", authenticateToken(['admin', 'doctor', 'patient']), getLoggedInUserData);
        this.router.get("/token-expiration", getTokenExpiration);  // This is the new route
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new UserRoutes().getRouter();

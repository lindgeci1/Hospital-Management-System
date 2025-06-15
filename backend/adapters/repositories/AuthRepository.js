require("dotenv").config(); // Load environment variables from .env file
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../core/entities/User");
const Role = require("../../core/entities/Role");
const UserRole = require("../../core/entities/UserRole");
const Patient = require("../../core/entities/Patient");
const Doctor = require("../../core/entities/Doctor");
const Staff = require("../../core/entities/Staff");
const loginTemplate = require("../../core/config/registerTemplate");
const { Op, Sequelize } = require("sequelize");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

class AuthRepository {
  constructor() {
    // Bind methods to preserve context
    this.loginUser = this.loginUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.generateRefreshToken = this.generateRefreshToken.bind(this);
  }

  // Generate a refresh token with a 7-day expiration
generateRefreshToken() {
    const token = crypto.randomBytes(32).toString("hex");
    const now = new Date();
    const expires = new Date(now.getTime() + 7*24*60*60 * 1000); // 1 week from now
    console.log("Current time:", now);
    console.log("Refresh token expires at:", expires);
    return { token, expires };
}
async  getLoggedInUserData(req, res) {
    try {
      // Retrieve the JWT from the HttpOnly cookie
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }
  
      // Verify the token using your JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Fetch the user from the database using the userId from the token
      const user = await User.findByPk(decoded.userId, { include: UserRole });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Retrieve the role name from the associated UserRole
      let roleName = null;
      if (user.UserRoles && user.UserRoles.length > 0) {
        const roleId = user.UserRoles[0].role_id;
        const role = await Role.findByPk(roleId);
        roleName = role ? role.role_name : null;
      }
  
      // Return the fresh user data from the database
      res.status(200).json({
        userId: user.user_id,
        username: user.username,
        email: user.email,
        role: roleName,
      });
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
      res.status(403).json({ message: "Invalid token" });
    }
}

// Updated loginUser method
async loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username },
      include: UserRole,
    });
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    let roleName = null;
    if (user.UserRoles.length > 0) {
      const roleId = user.UserRoles[0].role_id;
      const role = await Role.findByPk(roleId);
      roleName = role ? role.role_name : null;
    }

    // Create a short-lived JWT (15 minutes)
    const jwtToken = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        role: roleName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate a refresh token with a 7-day expiration
    const { token: refreshToken, expires: refreshTokenExpires } = this.generateRefreshToken();

    // Update user record with the refresh token and its expiry
    await user.update({
      refresh_token: refreshToken,
      refresh_token_expires: refreshTokenExpires,
    }); 

    // Set the tokens as HttpOnly cookies
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15*60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7*24*60*60 * 1000, // 7 days
    });

    // Return non-sensitive user info (tokens are in cookies)
    res.status(200).json({
      username: user.username,
      email: user.email,
      role: roleName,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  console.log("🔄 Received refreshToken:", refreshToken || "No token received");

  if (!refreshToken) {
      console.log("🚨 No refreshToken provided, attempting to clear expired tokens in DB.");

      // **Find and remove expired refresh tokens from the database**
      const expiredTokens = await User.findAll({
          where: { refresh_token_expires: { [Op.lt]: new Date() } }
      });

      if (expiredTokens.length > 0) {
          await User.update({ refresh_token: null, refresh_token_expires: null }, {
              where: { refresh_token_expires: { [Op.lt]: new Date() } }
          });
          console.log(`✅ Cleared ${expiredTokens.length} expired refresh tokens from DB.`);
      } else {
          console.log("✅ No expired refresh tokens found.");
      }

      res.clearCookie('token');
      res.clearCookie('refreshToken');
      return res.status(400).json({ message: "Refresh token required" });
  }

  try {
      console.log("🔍 Searching for user with refresh token...");
      const user = await User.findOne({ 
          where: { refresh_token: refreshToken }, 
          include: [{ model: UserRole, include: [{ model: Role }] }] 
      });

      if (!user) {
          console.log("🚨 No user associated with this refresh token. Clearing cookies.");
          res.clearCookie('token');
          res.clearCookie('refreshToken');
          return res.status(403).json({ message: "Invalid refresh token" });
      }

      console.log(`✅ User found: ${user.username} (ID: ${user.user_id})`);

      if (new Date() > new Date(user.refresh_token_expires)) {
          console.log("❌ Refresh token has expired. Removing it from DB and cookies.");

          // **Remove expired refresh token from DB**
          await user.update({ refresh_token: null, refresh_token_expires: null });

          res.clearCookie('token');
          res.clearCookie('refreshToken');
          return res.status(401).json({ message: "Refresh token expired. Please log in again." });
      }

      console.log("✅ Refresh token is still valid. Issuing new JWT.");
      let roleName = null;
      if (user.UserRoles && user.UserRoles.length > 0) {
          const roleId = user.UserRoles[0].role_id;
          const role = await Role.findByPk(roleId);
          roleName = role ? role.role_name : null;
      }

      console.log(`👤 User role: ${roleName || "No role assigned"}`);

      // **Issue a new JWT token**
      const newJwtToken = jwt.sign(
          { userId: user.user_id, username: user.username, email: user.email, role: roleName },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
      );

      console.log(`🔐 New JWT token generated for user ${user.username}`);

      res.cookie('token', newJwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15*60 * 1000,
      });

      const refreshTokenExp = Math.floor(new Date(user.refresh_token_expires).getTime() / 1000);
      const currentTime = Math.floor(Date.now() / 1000);

      console.log(`🕒 Refresh token expires in: ${refreshTokenExp - currentTime} seconds`);

      res.status(200).json({
          message: "Token refreshed",
          refreshTokenExp: refreshTokenExp,
          refreshTokenTimeRemaining: refreshTokenExp - currentTime,
          role: roleName
      });

  } catch (error) {
      console.error("🚨 Error refreshing token:", error);
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      res.status(500).json({ message: "Internal server error" });
  }
}

async getTokenExpiration(req, res) {
  try {
      const token = req.cookies.token;
      const refreshToken = req.cookies.refreshToken;

      if (!token) {
          return res.status(401).json({ message: "No token provided" });
      }

      // Decode JWT token to get expiration time
      const decoded = jwt.decode(token);
      if (!decoded) {
          return res.status(400).json({ message: "Invalid token" });
      }

      // Get refresh token expiration from database
      const user = await User.findOne({ where: { refresh_token: refreshToken } });

      if (!user || !user.refresh_token_expires) {
          return res.status(403).json({ message: "Invalid or missing refresh token" });
      }

      // Convert refresh token expiration to UNIX timestamp
      const refreshTokenExp = Math.floor(new Date(user.refresh_token_expires).getTime() / 1000);
      const currentTime = Math.floor(Date.now() / 1000);

      res.status(200).json({
          message: "Token expiration retrieved successfully",
          jwtExp: decoded.exp,  // JWT expiration time (UNIX timestamp)
          jwtTimeRemaining: decoded.exp - currentTime, // JWT remaining time in seconds
          refreshTokenExp,  // Refresh token expiration time (UNIX timestamp)
          refreshTokenTimeRemaining: refreshTokenExp - currentTime // Refresh token remaining time in seconds
      });
  } catch (error) {
      console.error("Error retrieving token expiration:", error);
      res.status(500).json({ message: "Internal server error" });
  }
}


async logoutUser(req, res) {
  try {
      console.log("🚪 Logging out user...");

      // Clear both the JWT and refresh token cookies
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      console.log("✅ Cleared HTTP-only cookies (token & refreshToken)");

      // Remove refresh token from the database
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (refreshToken) {
          console.log(`🔄 Searching for user with refresh token: ${refreshToken}`);

          const user = await User.findOne({ where: { refresh_token: refreshToken } });

          if (user) {
              console.log(`✅ User found: ${user.username} (ID: ${user.user_id})`);
              await user.update({ refresh_token: null, refresh_token_expires: null });
              console.log("✅ Refresh token removed from database");
          } else {
              console.log("❌ No user found with the provided refresh token");
          }
      } else {
          console.log("❌ No refresh token found in request");
      }

      res.status(200).json({ message: "User logged out successfully" });

  } catch (error) {
      console.error("🚨 Error logging out user:", error);
      res.status(500).json({ message: "Internal server error" });
  }
}

async  registerUser(req, res) {
    try {
      const { email, username, password } = req.body;
  
      if (!email || !username || !password) {
        return res.status(400).json({ message: "Email, username, and password are required" });
      }
  
      if (username.length < 2) {
        return res.status(400).json({ message: "Username must be at least 2 characters long" });
      }
  
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z-]+\.[a-z]{3}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
  
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()\-_=+`~{}\[\]|\\:;"'<>,.?\/]{6,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
        });
      }
  
      const existingUserWithEmail = await User.findOne({ where: { email } });
      if (existingUserWithEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
  
      const existingUserWithUsername = await User.findOne({ where: { username } });
      if (existingUserWithUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Determine role based on email format
      let assignedRole = "patient";
      if (email.indexOf(".") !== -1 && email.indexOf("@") !== -1 && email.lastIndexOf(".", email.indexOf("@")) !== -1) {
        assignedRole = "doctor";
      }
  
      // Create user
      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
      });
  
      // Assign role
      const role = await Role.findOne({ where: { role_name: assignedRole } });
      if (!role) {
        return res.status(500).json({ message: "Default role not found" });
      }
  
      await UserRole.create({
        user_id: newUser.user_id,
        role_id: role.role_id,
      });
  
      // Auto-create an **incomplete** patient or staff record linked to the user
      if (assignedRole === "patient") {
        await Patient.create({
            user_id: newUser.user_id,
            Email: newUser.email, // Use the email from User
            Personal_Number: null,
            Patient_Fname: null,
            Patient_Lname: null,
            Joining_Date: new Date().toISOString().split('T')[0], // Set Joining Date to current date (YYYY-MM-DD format)
            Birth_Date: null,
            Gender: null,
            Phone: null,
        });
    }  else if (assignedRole === "doctor") {
      // Create Staff record for the doctor and capture the created record
      const newStaff = await Staff.create({
          user_id: newUser.user_id,
          Email: newUser.email, // Use the email from User
          Personal_Number: null,
          Emp_Fname: null,
          Emp_Lname: null,
          Joining_Date: new Date().toISOString().split('T')[0], // current date (YYYY-MM-DD)
          Birth_Date: null,
          Gender: null,
          Phone: null,
          Emp_type: "Doctor", // Set Emp_type to Doctor
          Dept_ID: null,
          Qualifications: null,
          Specialization: null,
      });
  
      // Create the Doctor record linked to the Staff record using the same Emp_ID.
      await Doctor.create({
           Emp_ID: newStaff.Emp_ID,
           Qualifications: null, // Leave as null
           Specialization: null, // Leave as null
           Dept_ID: null,
      });
    }
    
  
      // Send welcome email
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Welcome to Life-Life Hospital",
        html: loginTemplate(username),
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
  
      res.status(201).json({ message: "User registered successfully" });
    }
      catch (error) {
        console.error("Error registering user:", error); // Log the full error
        res.status(500).json({ message: error.message || "Internal server error" });
      }
}
}
module.exports = new AuthRepository();
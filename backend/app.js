const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
// Import route handlers
const routes = [
  require("./adapters/http/routes/MedicineRoutes"),
  require("./adapters/http/routes/Emergency_ContactRoutes"),
  require("./adapters/http/routes/PatientRoutes"),
  require("./adapters/http/routes/DepartmentRoutes"),
  require("./adapters/http/routes/InsuranceRoutes"),
  require("./adapters/http/routes/StaffRoutes"),
  require("./adapters/http/routes/MedicalHistoryRoutes"),
  require("./adapters/http/routes/RoomRoutes"),
  require("./adapters/http/routes/UserRoutes"),
  require("./adapters/http/routes/RatingRoutes"),
  require("./adapters/http/routes/DoctorRoutes"),
  require("./adapters/http/routes/ReportRoutes"),
  require("./adapters/http/routes/BillRoutes"),
  require("./adapters/http/routes/VisitRoutes"),
  require("./adapters/http/routes/PayrollRoutes"),
];

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 9004;
    this.middlewares();
    this.routes();
  }

  // Initialize middleware
  middlewares() {
    this.app.use(express.json());
    this.app.use(cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }));
    
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(fileUpload());
  }

  // Initialize routes
  routes() {
    routes.forEach((route) => {
      this.app.use("/api", route);
    });
  }

  // Start the server
  start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

// Initialize and start the server
const server = new Server();
server.start();

module.exports = server;

const DoctorService = require("../../../core/services/DoctorService");

class DoctorController {
    constructor(doctorService) {
        this.doctorService = doctorService;
    }
    async findAllDoctors(req, res) {
        console.log("Fetching all doctors");
        try {
            const doctors = await this.doctorService.findAllDoctors();
            res.status(200).json(doctors);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findSingleDoctor(req, res) {
        try {
            const doctor = await this.doctorService.findSingleDoctor(req.params.id);
            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
            res.status(200).json(doctor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addDoctor(req, res) {
        try {
            const newDoctor = await this.doctorService.addDoctor(req.body);
            res.status(201).json(newDoctor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateDoctor(req, res) {
        try {
            const updatedDoctor = await this.doctorService.updateDoctor(req.params.id, req.body);
            if (!updatedDoctor) {
                return res.status(404).json({ message: "Doctor not found or could not be updated" });
            }
            res.status(200).json(updatedDoctor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteDoctor(req, res) {
        try {
            const deletedDoctor = await this.doctorService.deleteDoctor(req.params.id);
            if (!deletedDoctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
            res.status(204).send(); // No content to send back
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DoctorController(DoctorService);

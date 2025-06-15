const MedicineRepository = require("../../adapters/repositories/MedicineRepository");
const IMedicineService = require("../../ports/ServicePorts/IMedicineService");  

class MedicineService extends IMedicineService{
    constructor(medicineRepository) {
        super();
        this.medicineRepository = medicineRepository;
        Object.getOwnPropertyNames(IMedicineService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IMedicineService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAllMedicines(user) {
        console.log("Service: Finding all medicines for user:", user);
        const { email, role } = user;
        switch (role) {
            case "admin":
                return await this.medicineRepository.findAll();
            case "doctor":
                return await this.medicineRepository.findByDoctorEmail(email);
            case "patient":
                return await this.medicineRepository.findByPatientEmail(email);
            default:
                throw new Error("Unauthorized access");
        }
    }

    async findSingleMedicine(medicineId) {
        return await this.medicineRepository.findById(medicineId);
    }

    async addMedicine(medicineData) {
        const { M_name, M_Quantity, M_Cost, Patient_ID } = medicineData;

        if (!M_name || M_Quantity === undefined || M_Cost === undefined || !Patient_ID) {
            throw new Error("Medicine Name, Quantity, Cost, and Patient ID are required.");
        }

        return await this.medicineRepository.create(medicineData);
    }

    async updateMedicine(medicineId, medicineData) {
        const { M_name, M_Quantity, M_Cost, Patient_ID } = medicineData;

        if (!M_name || M_Quantity === undefined || M_Cost === undefined || !Patient_ID) {
            throw new Error("Medicine Name, Quantity, Cost, and Patient ID are required.");
        }

        return await this.medicineRepository.update(medicineId, medicineData);
    }

    async deleteMedicine(medicineId) {
        return await this.medicineRepository.delete(medicineId);
    }
}

module.exports = new MedicineService(MedicineRepository);

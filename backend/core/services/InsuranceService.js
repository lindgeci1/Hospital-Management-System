const InsuranceRepository = require("../../adapters/repositories/InsuranceRepository");
const IInsuranceService = require("../../ports/ServicePorts/IInsuranceService")
class InsuranceService extends IInsuranceService{
    constructor(insuranceRepository) {
        super();
        this.insuranceRepository = insuranceRepository;
        Object.getOwnPropertyNames(IInsuranceService.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IInsuranceService.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAllInsurances(user) {
        console.log("Service: Finding all insurances for user:", user);
        const { email, role } = user;
        switch (role) {
            case "admin":
                return await this.insuranceRepository.findAll();
            case "patient":
                return await this.insuranceRepository.findByPatientEmail(email);
            case "doctor":
                return await this.insuranceRepository.findByDoctorEmail(email);
            default:
                throw new Error("Unauthorized access");
        }
    }

    async findSingleInsurance(insuranceId) {
        return await this.insuranceRepository.findById(insuranceId);
    }

    async findCoverageByPatientId(patientId) {
        return await this.insuranceRepository.findCoverageByPatientId(patientId);
    }

    async addInsurance(insuranceData) {
        const { Patient_ID, Ins_Code, End_Date, Provider} = insuranceData;

        if (!Patient_ID || !Ins_Code || !End_Date || !Provider) {
            throw new Error("Invalid or missing data");
        }

        const patientExists = await this.insuranceRepository.Patient.findByPk(Patient_ID);
        if (!patientExists) {
            throw new Error("Patient not found");
        }

        const existingInsurance = await this.insuranceRepository.findOtherInsuranceByPolicyNumber(Ins_Code);
        if (existingInsurance) {
            throw new Error("An insurance policy with this Ins_Code already exists");
        }

        const newInsurance = await this.insuranceRepository.create(insuranceData);
        return {
            message: "Insurance created successfully",
            data: newInsurance,
        };
    }

    async updateInsurance(insuranceId, insuranceData) {
        const { Patient_ID, Ins_Code, End_Date, Provider} = insuranceData;

        if (!Patient_ID || !Ins_Code || !End_Date || !Provider) {
            throw new Error("Invalid or missing data");
        }

        const existingInsurance = await this.insuranceRepository.findById(insuranceId);
        if (!existingInsurance) {
            throw new Error("Insurance record not found");
        }

        if (existingInsurance.Ins_Code !== Ins_Code) {
            const existingPolicy = await this.insuranceRepository.findOtherInsuranceByPolicyNumber(Ins_Code);
            if (existingPolicy) {
                throw new Error("An insurance policy with this Ins_Code already exists");
            }
        }

        const updatedInsurance = await this.insuranceRepository.update(insuranceId, insuranceData);
        return {
            message: "Insurance updated successfully",
            data: updatedInsurance,
        };
    }

    async deleteInsurance(insuranceId) {
        return await this.insuranceRepository.delete(insuranceId);
    }
}

module.exports = new InsuranceService(InsuranceRepository);
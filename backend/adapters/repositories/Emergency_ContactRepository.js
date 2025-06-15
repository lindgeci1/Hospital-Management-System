const EmergencyContact = require('../../core/entities/Emergency_Contact');
const Patient = require('../../core/entities/Patient');
const { Op } = require('sequelize');
const IEmergencyContactRepository = require("../../ports/PersistencePorts/IEmergencyContactRepository");

class EmergencyContactRepository extends IEmergencyContactRepository {
    constructor() {
        super();
        this.EmergencyContact = EmergencyContact;
        this.Patient = Patient;
        Object.getOwnPropertyNames(IEmergencyContactRepository.prototype)
        .forEach(m => { if (m !== "constructor" && this[m] === IEmergencyContactRepository.prototype[m]) throw new Error(`Method ${m} is not implemented`); });
    }

    async findAll() {
        console.log("Repository: Fetching all emergency contacts");
        const contacts = await this.EmergencyContact.findAll({
            include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
        });
        console.log("Repository: All emergency contacts fetched:", contacts);
        return contacts;
    }

    async create(data) {
        const newContact = await this.EmergencyContact.create(data);
        return {
            message: 'Emergency contact created successfully.',
            createdData: newContact
        };
    }

    async findById(contactId) {
        return await this.EmergencyContact.findByPk(contactId, { include: [this.Patient] });
    }

    async update(id, data) {
        const { Phone } = data;

        const existingContact = await this.EmergencyContact.findByPk(id);
        if (!existingContact) {
            throw new Error('Emergency contact not found.');
        }

        if (existingContact.Phone !== Phone) {
            const existingContactWithSamePhone = await this.EmergencyContact.findOne({
                where: {
                    Phone: Phone,
                    Contact_ID: { [Op.ne]: id }
                }
            });

            if (existingContactWithSamePhone) {
                throw new Error("Phone number is already in use by another emergency contact");
            }
        }

        const [updatedRowsCount] = await this.EmergencyContact.update(data, { where: { Contact_ID: id } });
        if (updatedRowsCount === 0) {
            throw new Error('Failed to update emergency contact: No rows were updated.');
        }

        return {
            message: 'Emergency contact updated successfully.',
            updatedData: data,
        };
    }

    async delete(id) {
        const deleted = await this.EmergencyContact.destroy({ where: { Contact_ID: id } });

        if (deleted === 0) {
            console.log("No records found to delete.");
            return { message: "No emergency contact found to delete.", deleted: false };
        }

        console.log("Record deleted successfully.");
        return { message: "Emergency contact deleted successfully.", deleted: true };
    }

    async findByPatientEmail(email) {
        const patient = await this.Patient.findOne({ where: { Email: email } });
        if (!patient) throw new Error("Patient not found");

        return await this.EmergencyContact.findAll({
            where: { Patient_ID: patient.Patient_ID },
            include: [{ model: this.Patient, attributes: ["Patient_Fname", "Patient_Lname"] }],
        });
    }
}

module.exports = new EmergencyContactRepository();

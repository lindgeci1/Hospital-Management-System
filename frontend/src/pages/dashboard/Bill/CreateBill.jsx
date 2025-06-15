import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Select, MenuItem, InputLabel, FormHelperText, FormControl, Modal, TextField } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

function CreateBill({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Description: '',
        Amount: 0,
        Payment_Status: 'Pending',
    });
    const [patients, setPatients] = useState([]);
    const [patientPersonalNumber, setPatientPersonalNumber] = useState('');
    const [roomCost, setRoomCost] = useState(0);
    const [medicineCost, setMedicineCost] = useState(0);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);    
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedDescription, setSelectedDescription] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [insuranceCoverage, setInsuranceCoverage] = useState(0);
    useEffect(() => {
        fetchPatients();
        const patientId = location.state?.patientId; // Get patient ID from location state
        if (patientId) {
            setFormData((prevState) => ({ ...prevState, Patient_ID: patientId }));
            fetchPatientPersonalNumber(patientId);
            fetchRoomCost(patientId);
            fetchMedicineCost(patientId);
            fetchInsuranceCoverage(patientId);
        }
    }, [location.state]);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/patient', { withCredentials: true });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const fetchPatientPersonalNumber = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:9004/api/patient/${patientId}`, { withCredentials: true });
            setPatientPersonalNumber(response.data.Personal_Number);
        } catch (error) {
            console.error('Error fetching patient personal number:', error);
        }
    };

    const fetchRoomCost = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:9004/api/patient/${patientId}/room-cost`,{ withCredentials: true });
            const roomCostValue = parseFloat(response.data.Room_Cost) || 0;
            setRoomCost(roomCostValue);
        } catch (error) {
            console.error('Error fetching room cost:', error);
        }
    };

    const fetchMedicineCost = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:9004/api/patients/${patientId}/medicine-cost`, { withCredentials: true });
            const medicineCostValue = response.data && response.data.costs ? parseFloat(response.data.costs[0]) || 0 : 0;
            setMedicineCost(medicineCostValue);
        } catch (error) {
            console.error('Error fetching medicine cost:', error);
        }
    };

    const fetchInsuranceCoverage = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:9004/api/insurance/coverage/${patientId}`, { withCredentials: true });
            // console.log("Fetched Insurance Coverage:", response.data.coverage); // Check the fetched coverage value
            setInsuranceCoverage(response.data.coverage);  // Set the fetched coverage value
        } catch (error) {
            console.error('Error fetching insurance coverage:', error);
        }
    };
    const handleDescriptionChange = (e) => {
        const description = e.target.value;
        setSelectedDescription(description);
    
        const baseFee = 10;
        let updatedTotalCost = baseFee + roomCost + medicineCost;
    
        // console.log("Room Cost:", roomCost);
        // console.log("Medicine Cost:", medicineCost);
        // console.log("Insurance Coverage:", insuranceCoverage);
    
        if (insuranceCoverage !== null) {
            updatedTotalCost *= (1 - insuranceCoverage / 100); // Apply discount based on coverage
        }
    
        // console.log("Updated Total Cost after applying coverage:", updatedTotalCost); // Log the final total cost
    
        setTotalCost(updatedTotalCost);
    
        setFormData((prevState) => ({
            ...prevState,
            Amount: updatedTotalCost,
            Description: description
        }));
    };
    
    
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    
        if (name === 'Patient_ID') {
            fetchPatientPersonalNumber(value);
            fetchRoomCost(value);
            fetchMedicineCost(value);
            fetchInsuranceCoverage(value);  // Ensure that this is called after setting Patient_ID
        }
    };
    

    const handleAddBill = async () => {
        try {
            console.log('Creating Payment Intent...');
            
            const roundedTotalCost = parseFloat(totalCost.toFixed(2)); // Round to 2 decimal places
            const billData = { 
                Patient_ID: formData.Patient_ID, 
                Amount: roundedTotalCost * 100, // Convert to cents for Stripe
                Description: selectedDescription 
            };
    
            const response = await axios.post('http://localhost:9004/api/payments/create', billData, { withCredentials: true });
    
            // console.log('✅ Payment Intent Created:', response.data);
    
            alert("Bill Created! Redirecting...");
            navigate('/dashboard/bills');
            window.location.reload();
        } catch (error) {
            console.error('Error creating Bill:', error);
    
            // Extract backend validation error message
            let errorMessage = "Error adding bill. Please try again.";
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error; // ✅ Fetch error message from backend
            }
    
            showAlert(errorMessage); // Show backend validation message
        }
    };
    

    const handleValidation = async () => {
        // console.log('Current formData:', formData);
        const { Patient_ID, Description } = formData;

        if (!Patient_ID || !Description) {
            showAlert('All fields are required');
            return;
        }

        if (parseInt(Patient_ID) < 1) {
            showAlert('Patient ID cannot be less than 1');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, { withCredentials: true });
            handleAddBill();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <Typography variant="h6" component="h1" gutterBottom>Add Bill</Typography>

                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel id="patient-select-label">Patient</InputLabel>
                    <Select
                        labelId="patient-select-label"
                        name="Patient_ID"
                        value={formData.Patient_ID}
                        onChange={handleChange}
                        label="Patient"
                    >
                        <MenuItem value=""><em>Select Patient</em></MenuItem>
                        {patients.map(patient => (
                            <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select the patient for this bill</FormHelperText>
                </FormControl>

                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel id="description-select-label">Description</InputLabel>
                    <Select
                        labelId="description-select-label"
                        id="Description"
                        name="Description"
                        value={selectedDescription}
                        onChange={handleDescriptionChange}
                        label="Description"
                    >
                        <MenuItem value=""><em>Select Description</em></MenuItem>
                        <MenuItem value="Pagesa per Kontroll">Pagesa per Kontroll</MenuItem>
                    </Select>
                    <FormHelperText>Select the Description</FormHelperText>
                </FormControl>

                <TextField fullWidth label="Amount" variant="outlined" margin="dense" value={totalCost} readOnly />
                <FormHelperText>Select the payment status of the bill (default is Pending)</FormHelperText>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateBill;

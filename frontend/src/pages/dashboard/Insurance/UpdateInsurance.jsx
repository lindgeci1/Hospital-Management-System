import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Grid, InputAdornment, Button, Typography, Modal, MenuItem } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdateInsurance({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Ins_Code: '',
        End_Date: '',
        Provider: '',
        Coverage: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [patients, setPatients] = useState([]);
    const [patientPhone, setPatientPhone] = useState(''); // New state for patient's phone number
    

    useEffect(() => {
        fetchPatients();
        fetchInsuranceData();
    }, [id]);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/patient', { withCredentials: true });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };
    const providerCoverageMapping = {
        "Aetna": 80,
        "Blue Cross Blue Shield": 75,
        "UnitedHealthcare": 85,
        "Cigna": 70,
        "Humana": 90,
        "Kaiser Permanente": 100,
        "MetLife": 60,
        "Prudential": 50,
        "Allianz": 90,
        "State Farm": 95,
    };

    const fetchInsuranceData = async () => {
        try {
            const response = await axios.get(`http://localhost:9004/api/insurance/${id}`, { withCredentials: true });
            const data = response.data;
            setOriginalData(data);
            setFormData({
                Patient_ID: data.Patient_ID,
                Ins_Code: data.Ins_Code,
                End_Date: data.End_Date,
                Provider: data.Provider,
                Coverage: data.Coverage,
            });
            fetchPatientPhone(data.Patient_ID); // Fetch phone number of the patient
        } catch (error) {
            console.error('Error fetching insurance:', error);
            showAlert('Error fetching insurance details.');
        }
    };

    const fetchPatientPhone = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:9004/api/patient/${patientId}`, { withCredentials: true });
            setPatientPhone(response.data.Phone); // Assuming the response contains a `Phone` field
        } catch (error) {
            console.error('Error fetching patient phone:', error);
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };
const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If the provider is selected, set coverage based on the selected provider
    if (name === "Provider") {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
            Coverage: providerCoverageMapping[value] || '', // Set the corresponding coverage percentage
        }));
    } else {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    
};


    const handleUpdateInsurance = async () => {
        // Validation logic
        if (!formData.Patient_ID || formData.Patient_ID < 1) {
            showAlert("Patient ID must be a positive number.");
            return;
        }
    
        if (!formData.Ins_Code) {
            showAlert("Insurance Code is required.");
            return;
        }
    
        if (formData.Ins_Code.length !== 7) {
            showAlert("Ins_Code must be 7 characters long");
            return;
        }
    
        if (formData.Ins_Code.startsWith('0')) {
            showAlert("Please remove the leading 0 from the Ins_Code.");
            return;
        }
    
        if (!formData.End_Date) {
            showAlert("End Date is required.");
            return;
        }
    
        if (!formData.Provider.trim()) {
            showAlert("Provider cannot be empty.");
            return;
        }
    
        if (!formData.Coverage) {
            showAlert("Coverage cannot be empty.");
            return;
        }
    
        if (
            formData.Patient_ID === originalData.Patient_ID &&
            formData.Ins_Code === originalData.Ins_Code &&
            formData.End_Date === originalData.End_Date &&
            formData.Provider === originalData.Provider &&
            formData.Coverage === originalData.Coverage
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }
    
        try {
            await axios.put(`http://localhost:9004/api/insurance/update/${id}`, formData, { withCredentials: true });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error updating insurance:', error);
            // Check if the error response exists and set the alert message accordingly
            if (error.response && error.response.data && error.response.data.error) {
                showAlert(error.response.data.error);
            } else {
                showAlert('Error updating insurance. Please try again later.');
            }
        }
    };
    

    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 bg-black/50">
        <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 600, mx: 'auto' }}>
            {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
            
            <Typography variant="h6" component="h1" gutterBottom>
                Update Insurance
            </Typography>
    
            <Grid container spacing={2}>
                {/* Left Column */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        margin="dense"
                        fullWidth
                        select
                        label="Patient ID"
                        variant="outlined"
                        id="Patient_ID"
                        name="Patient_ID"
                        value={formData.Patient_ID}
                        onChange={handleChange}
                        helperText="Select the patient for whom you're updating insurance"
                        disabled
                    >
                        <MenuItem value="">Select Patient</MenuItem>
                        {patients.map((patient) => (
                            <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </MenuItem>
                        ))}
                    </TextField>
    
                    <TextField
                        fullWidth
                        label="Patient Phone"
                        variant="outlined"
                        margin="dense"
                        value={patientPhone}
                        readOnly
                        helperText="This is the phone number of the selected patient"
                    />
    
                    <TextField
                        margin="dense"
                        fullWidth
                        label="Insurance Code"
                        variant="outlined"
                        id="Ins_Code"
                        name="Ins_Code"
                        value={formData.Ins_Code}
                        onChange={handleChange}
                        helperText="Enter the insurance code associated with the patient"
                    />
    
                </Grid>
    
                {/* Right Column */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        margin="dense"
                        fullWidth
                        label="End Date"
                        type="date"
                        variant="outlined"
                        id="End_Date"
                        name="End_Date"
                        value={formData.End_Date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Prevent past dates
                        helperText="Select the insurance end date"
                    />
    
 <TextField
                        fullWidth
                    select
                    label="Provider"
                    variant="outlined"
                    margin="dense"
                    id="Provider"
                    name="Provider"
                    value={formData.Provider}
                    onChange={handleChange}
                    helperText="Select the insurance provider"
                >
                    <MenuItem value=""><em>Select Provider</em></MenuItem>
                    <MenuItem value="Aetna">Aetna</MenuItem>
                    <MenuItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</MenuItem>
                    <MenuItem value="UnitedHealthcare">UnitedHealthcare</MenuItem>
                    <MenuItem value="Cigna">Cigna</MenuItem>
                    <MenuItem value="Humana">Humana</MenuItem>
                    <MenuItem value="Kaiser Permanente">Kaiser Permanente</MenuItem>
                    <MenuItem value="MetLife">MetLife</MenuItem>
                    <MenuItem value="Prudential">Prudential</MenuItem>
                    <MenuItem value="Allianz">Allianz</MenuItem>
                    <MenuItem value="State Farm">State Farm</MenuItem>
                </TextField>
    
                    <TextField
                                        fullWidth
                                        label="Coverage"
                                        variant="outlined"
                                        margin="dense"
                                        id="Coverage"
                                        name="Coverage"
                                        type="number"
                                        value={formData.Coverage}
                                        onChange={handleChange}
                                        disabled
                                        inputProps={{
                                            min: 1,
                                            max: 100,
                                            step: 1,
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                        helperText="This is the coverage of insurance (in %)"
                    />
                    
                </Grid>
            </Grid>
    
            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleUpdateInsurance} sx={{ mr: 1 }}>
                    Submit
                </Button>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
            </Box>
        </Box>
    </Modal>
    

    );
}

export default UpdateInsurance;

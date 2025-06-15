import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, Grid,  InputAdornment, TextField, Button, Typography, Select, FormHelperText, MenuItem, InputLabel, FormControl } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';

function CreateInsurance({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Ins_Code: '',
        End_Date: '',
        Provider: '',
        Coverage: '',
    });
    const [patients, setPatients] = useState([]);
    const [insurance, setInsurance] = useState([]);
    const [patientPhone, setPatientPhone] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); //

    //const [test, setTest] = useState([]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    
        if (name === 'Provider') {
            // Automatically set Coverage based on the selected Provider
            const coverage = providerCoverageMapping[value] || '';
            setFormData((prevState) => ({
                ...prevState,
                Coverage: coverage,
            }));
        }
    
        if (name === 'Patient_ID') {
            fetchPatientPhone(value);
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

    
    
//this part
    useEffect(() => {
        fetchPatients();
        fetchInsurance();

        const patientId = location.state?.patientId; // Get patient ID from location state
        if (patientId) {
            setFormData((prevState) => ({ ...prevState, Patient_ID: patientId })); // Set patient ID
            fetchPatientPhone(patientId); // Fetch phone number for the selected patient
        }
    }, [location.state]);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/patient', { withCredentials: true });
            setPatients(response.data);
            // Remove the auto-select logic:
            // if (response.data.length === 1) {
            //     setFormData((prev) => ({ ...prev, Patient_ID: response.data[0].Patient_ID }));
            // }
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };
    const fetchInsurance = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/insurance', { withCredentials: true });
            setInsurance(response.data);
        } catch (error) {
            console.error('Error fetching insurance:', error);
        }
    };

    const fetchPatientPhone = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:9004/api/patient/${patientId}`, { withCredentials: true });
            setPatientPhone(response.data.Phone);
        } catch (error) {
            console.error('Error fetching patient phone:', error);
        }
    };
    const handleAddInsurance = async () => {
        try {
            await axios.post("http://localhost:9004/api/insurance/create", formData, { withCredentials: true });
            navigate('/dashboard/insurance');
            window.location.reload();
        } catch (error) {
            // Log the full response for debugging
            console.error('Error adding insurance:', error.response?.data || error);
    
            // Show specific error message from the backend if available
            if (error.response && error.response.data && error.response.data.error) {
                showAlert(error.response.data.error);  // Display backend error message
            } else {
                showAlert('Error adding insurance. Please try again.');
            }
        }
    };
    
    
    

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleValidation = async () => {
        const { Patient_ID, Ins_Code, End_Date, Provider, Coverage } = formData;

        if (!Patient_ID || !Ins_Code || !End_Date || !Provider || !Coverage) {
            showAlert('All fields are required!');
            return;
        }

        if (Ins_Code.length !== 7) {
            showAlert("Ins_Code must be 7 characters long");
            return;
        }

        if (Ins_Code.startsWith('0')) {
            showAlert("Please remove the leading 0 from the Ins_Code.");
            return;
        }
        if (isNaN(Coverage) || Coverage < 1 || Coverage > 100) {
            showAlert('Coverage must be a number between 1 and 100.');
            return;
        }
        

        const existingInsuranceWithCode = insurance.find(ins => ins.Ins_Code === Ins_Code);
        if (existingInsuranceWithCode) {
            showAlert('This insurance code is already in use.');
            return;
        }

        // const existingInsuranceForPatient = insurance.find(ins => ins.Patient_ID === Patient_ID);
        // if (existingInsuranceForPatient) {
        //     showAlert('This patient already has insurance records. Please choose a different patient.');
        //     return;
        // }

        const currentDate = new Date().setHours(0, 0, 0, 0);
        const selectedEndDate = new Date(End_Date).setHours(0, 0, 0, 0);
        if (selectedEndDate < currentDate) {
            showAlert('End date cannot be in the past.');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, { withCredentials: true });
            handleAddInsurance();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
        }
    };
    

    return (
<Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 bg-black/50">
    <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 600, mx: 'auto' }}>
        {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
        
        <Typography variant="h6" component="h1" gutterBottom>
            Add Insurance
        </Typography>

        <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="patient-select-label">Patient</InputLabel>
                    <Select
                        labelId="patient-select-label"
                        id="Patient_ID"
                        name="Patient_ID"
                        value={formData.Patient_ID}
                        label="Patient"
                        onChange={handleChange}
                    >
                        <MenuItem value=""><em>Select Patient</em></MenuItem>
                        {patients.map((patient) => (
                            <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select the patient for this insurance</FormHelperText>
                </FormControl>

                <TextField
                    fullWidth
                    label="Insurance Code"
                    variant="outlined"
                    margin="dense"
                    name="Ins_Code"
                    value={formData.Ins_Code}
                    onChange={handleChange}
                    type="number"
                    helperText="Enter the insurance code (7 characters long)"
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

            </Grid>

            {/* Right Column */}
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    type="date"
                    label="End Date"
                    variant="outlined"
                    margin="dense"
                    name="End_Date"
                    value={formData.End_Date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split("T")[0] }} // Prevent past dates
                    helperText="Select the end date for the insurance"
                />
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

                <TextField
                    fullWidth
                    label="Patient Phone"
                    variant="outlined"
                    margin="dense"
                    value={patientPhone}
                    readOnly
                    helperText="This is the phone number of the selected patient"
                />
            </Grid>
        </Grid>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>
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

export default CreateInsurance;

import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Grid, Typography, FormHelperText, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import Cookies from 'js-cookie';

// Lazy load the ErrorModal component
const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function CreatePatient({ onClose }) {
    const [formData, setFormData] = useState({
        Personal_Number: '',
        Patient_Fname: '',
        Patient_Lname: '',
        Birth_Date: '',
        Joining_Date: '',
        Email: '',
        Gender: '',
        Phone: ''
    });

    const [patients, setPatients] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/patient', { withCredentials: true });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddPatient = async () => {
        try {
            await axios.post('http://localhost:9004/api/patient/create', formData, { withCredentials: true });
            navigate('/dashboard/patient');
            window.location.reload();
        } catch (error) {
            // Check the response for the specific error message
            if (error.response && error.response.data.error) {
                // Set the alert message based on the backend response
                setAlertMessage(error.response.data.error);
            } else {
                setAlertMessage('Error adding patient. Please try again.');
            }
            console.error('Error adding Patient:', error.response ? error.response.data : error.message);
            setShowErrorModal(true);
        }
    };
    
    

    const handleValidation = () => {
        const { Personal_Number, Patient_Fname, Patient_Lname, Birth_Date, Joining_Date, Email, Gender, Phone } = formData;
        
        const personalNumberStr = String(Personal_Number);
        if (Personal_Number === '' || Patient_Fname === '' || Patient_Lname === '' || Joining_Date === '' ||Birth_Date === '' || Email === '' || Gender === '' || Phone === '') {
            showAlert('All fields are required.');
            return;
        }
        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.(com|ubt-uni\.net)$/;
            return re.test(String(email).toLowerCase());
        };

        if (!validateEmail(Email)) {
            showAlert('Email must end with @ubt-uni.net or .com');
            return;
        }
        const validateName = (name) => /^[A-Za-z]+$/.test(name);
        
        if (!validateName(Patient_Fname)) {
            showAlert('First Name can only contain letters');
            return;
        }

        if (!validateName(Patient_Lname)) {
            showAlert('Last Name can only contain letters');
            return;
        }

    
        const existingStaffByPersonal_Number = patients.find(patient => String(patient.Personal_Number) === personalNumberStr);
        if (existingStaffByPersonal_Number) {
            showAlert('Patient member with the same Personal Number already exists.');
            return;
        }
    
        const existingStaffByPhone = patients.find(patients => patients.Phone === Phone);
        if (existingStaffByPhone) {
            showAlert('Patient member with the same Phone already exists.');
            return;
        }

        const existingStaffByEmail = patients.find(patients => patients.Email === Email);
        if (existingStaffByEmail) {
            showAlert('Patient member with the same Email already exists.');
            return;
        }
        const existingStaff = patients.find(patients => 
            patients.Personal_Number === formData.Personal_Number && 
            patients.Phone === formData.Phone && 
            patients.Email === formData.Email
        );

        if (existingStaff) {
            showAlert('Patient member with the same personal number, phone number, and email already exists.');
            return;
        }

        handleAddPatient();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
<Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 bg-black/50">
    <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 600, mx: 'auto' }}>
        <Suspense fallback={<div>Loading...</div>}>
            {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
        </Suspense>
        
        <Typography variant="h6" component="h1" gutterBottom>
            Add Patient
        </Typography>

        <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Personal Number"
                    variant="outlined"
                    id="Personal_Number"
                    name="Personal_Number"
                    type="number"
                    placeholder="Enter Personal Number"
                    value={formData.Personal_Number}
                    onChange={handleChange}
                    helperText="Enter a unique personal number."
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="First Name"
                    variant="outlined"
                    id="Patient_Fname"
                    name="Patient_Fname"
                    placeholder="Enter Firstname"
                    value={formData.Patient_Fname}
                    onChange={handleChange}
                    helperText="Only letters are allowed."
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Last Name"
                    variant="outlined"
                    id="Patient_Lname"
                    name="Patient_Lname"
                    placeholder="Enter Lastname"
                    value={formData.Patient_Lname}
                    onChange={handleChange}
                    helperText="Only letters are allowed."
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Birth Date"
                    variant="outlined"
                    type="date"
                    id="Birth_Date"
                    name="Birth_Date"
                    value={formData.Birth_Date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    helperText="Enter your birth date."
                />
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} sm={6}>

            <TextField
                    fullWidth
                    margin="dense"
                    label="Joined Date"
                    variant="outlined"
                    type="date"
                    id="Joining_Date"
                    name="Joining_Date"
                    value={formData.Joining_Date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    helperText="Enter your birth date."
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    variant="outlined"
                    id="Email"
                    name="Email"
                    placeholder="Enter email"
                    value={formData.Email}
                    onChange={handleChange}
                    helperText="Must end with @ubt-uni.net or .com."
                />
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel id="gender-select-label">Gender</InputLabel>
                    <Select
                        labelId="gender-select-label"
                        id="Gender"
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                        label="Gender"
                    >
                        <MenuItem value=""><em>Select Gender</em></MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                    </Select>
                    <FormHelperText>Please select your Gender.</FormHelperText>
                </FormControl>

                <TextField
                    fullWidth
                    margin="dense"
                    label="Phone"
                    variant="outlined"
                    id="Phone"
                    name="Phone"
                    type="number"
                    placeholder="Enter Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    helperText="Enter a valid phone number."
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

export default CreatePatient;

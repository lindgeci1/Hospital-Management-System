    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { Modal, Box, TextField, FormHelperText, Grid, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
    import ErrorModal from '../../../components/ErrorModal';
    import Cookies from 'js-cookie';
    import { jwtDecode } from 'jwt-decode';
    import { useNavigate } from 'react-router-dom';
    function UpdateStaff({ id, onClose }) {
        const [formData, setFormData] = useState({
            Personal_Number:'',
            Emp_Fname: '',
            Emp_Lname: '',
            Joining_Date: new Date().toISOString().split('T')[0],
            Emp_type: 'Doctor',
            Email: '',
            Phone:'',
            Dept_ID: '',
            Birth_Date: '',
            Gender:'',
            Qualifications: '',
            Specialization: ''
        });
        const [department, setDepartments] = useState([]);
        const [originalData, setOriginalData] = useState({});
        const [staff, setStaff] = useState([]); // New state for staff data
        const [alertMessage, setAlertMessage] = useState('');
        const [showErrorModal, setShowErrorModal] = useState(false);
        const [userRole, setUserRole] = useState('');
        const navigate = useNavigate();
        useEffect(() => {
            const fetchUserData = async () => {
            try {
                // Fetch user data from the secure API endpoint
                const response = await axios.get('http://localhost:9004/api/user', { withCredentials: true });
                const {email, role } = response.data;
                setUserRole(role);
                //console.log(role)
                // Fetch registration status based on fetched email and role
                const statusResponse = await axios.get(
                `http://localhost:9004/api/users/registration-status/${email}/${role}`, 
                { withCredentials: true }
                );
                const statusMessage = statusResponse.data.message;
                if (statusMessage === "Patient not registered fully") {
                navigate('/dashboard/patient');
                } else if (statusMessage === "Staff not registered fully") {
                navigate('/dashboard/staffs'    );
                }
            } catch (err) {
                console.error('Error fetching user data:', err.response ? err.response.data : err.message);
            }
            };
    
            fetchUserData();
        }, [navigate]);
        useEffect(() => {
            fetchStaffDetails();
            fetchDepartments();
            fetchAllStaff(); // Fetch all staff data
        }, [id]);

        const fetchStaffDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/staff/${id}`, { withCredentials: true });
                const data = response.data;
                setOriginalData(data); // Save original data
                setFormData({
                    Personal_Number: data.Personal_Number || '',
                    Emp_Fname: data.Emp_Fname || '',
                    Emp_Lname: data.Emp_Lname || '',
                    Joining_Date: data.Joining_Date || new Date().toISOString().split('T')[0],
                    Emp_type: data.Emp_type || 'Doctor',
                    Email: data.Email || '',
                    Phone: data.Phone || '',
                    Dept_ID: data.Dept_ID || '',
                    Birth_Date: data.Birth_Date || '',
                    Gender: data.Gender || '',
                    Qualifications: data.Qualifications || '',
                    Specialization: data.Specialization || '',
                  });
                  
            } catch (error) {
                console.error('Error fetching staff details:', error);
                showAlert('Error fetching staff details.');
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/department', { withCredentials: true });
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        // Fetch all staff members
        const fetchAllStaff = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/staff',{ withCredentials: true });
                setStaff(response.data); // Set the staff data
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        };

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        };

        const handleValidation = async () => {
            const { 
                Personal_Number,
                Emp_Fname,
                Emp_Lname,
                Emp_type,
                Email,
                Dept_ID,
                Birth_Date,
                Joining_Date,
                Phone,
                Gender,
                Qualifications,
                Specialization
            } = formData;
        
            // Step 1: Validate all required fields
            if (!Personal_Number || !Emp_Fname || !Emp_Lname || !Email || !Dept_ID || !Joining_Date ||!Gender|| !Birth_Date || !Phone|| !Qualifications || !Specialization) {
                showAlert('All fields are required!');
                return;
            }
        
            // Step 2: Validate email format
            const validateEmail = (email) => {
                const re = /^[^\s@]+@[^\s@]+\.(com|ubt-uni\.net)$/;
                return re.test(String(email).toLowerCase());
            };
        
            if (!validateEmail(Email)) {
                showAlert('Email must end with @ubt-uni.net or .com');
                return;
            }
        
            // Step 3: Validate name and surname to contain only letters
            const validateName = (name) => /^[A-Za-z]+$/.test(name);
            
            if (!validateName(Emp_Fname)) {
                showAlert('First Name can only contain letters');
                return;
            }
            
            if (!validateName(Emp_Lname)) {
                showAlert('Last Name can only contain letters');
                return;
            }
        
            // Step 3: Check if any data has been changed
            if (
                formData.Personal_Number === originalData.Personal_Number &&
                formData.Emp_Fname === originalData.Emp_Fname &&
                formData.Emp_Lname === originalData.Emp_Lname &&
                formData.Email === originalData.Email &&
                formData.Birth_Date === originalData.Birth_Date &&
                formData.Joining_Date === originalData.Joining_Date &&
                formData.Phone === originalData.Phone &&
                formData.Qualifications === originalData.Qualifications &&
                formData.Specialization === originalData.Specialization
            ) {
                showAlert('Data must be changed before updating.');
                return;
            }
        
            // Step 4: Check for existing staff with the same first name, last name, and email
            const existingStaff = staff.find(staff =>
                staff.Personal_Number === formData.Personal_Number && 
                staff.Phone === formData.Phone && 
                staff.Email === formData.Email &&
                staff.Emp_ID !== id // Exclude the current staff member
            );
        
            if (existingStaff) {
                showAlert('Staff member with the same Personal Number, Phone, and Email already exists.');
                return;
            }

            
        
            // Step 5: Check for existing staff with the same email
            const existingStaffByEmail = staff.find(staff => 
                staff.Email === formData.Email && 
                staff.Emp_ID !== id // Exclude the current staff member
            );
        
            if (existingStaffByEmail) {
                showAlert('Staff member with the same Email already exists.');
                return;
            }

                       
            const existingStaffByPhone = staff.find(staff => 
                staff.Phone === formData.Phone && 
                staff.Emp_ID !== id // Exclude the current staff member
            );
        
            if (existingStaffByPhone) {
                showAlert('Staff member with the same Phone already exists.');
                return;
            }


            const existingStaffByPersonalNumber = staff.find(staff => 
                staff.Personal_Number === formData.Personal_Number && 
                staff.Emp_ID !== id // Exclude the current staff member
            );
        
            if (existingStaffByPersonalNumber) {
                showAlert('Staff member with the same Personal Number already exists.');
                return;
            }
        
            // Step 6: Proceed with the update request if validation passes
            try {
                await axios.put(`http://localhost:9004/api/staff/update/${id}`, formData, { withCredentials: true });
        
                // Success: Close the modal and reload the page
                onClose(); // Close the modal after updating
                window.location.reload(); // Reload the page
            } catch (error) {
                console.error('Error updating staff:', error);
        // Show specific backend error message if available
        const backendError = error.response?.data?.error || 'Error updating staff.';

        showAlert(backendError);
            }
        };
        
        const showAlert = (message) => {
            setAlertMessage(message);
            setShowErrorModal(true);
        };

        return (
<Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 bg-black/50">
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, width: 600, mx: 'auto' }}>
        {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}

        <Typography variant="h6" component="h1" gutterBottom>
            Fill your staff profile
        </Typography>

        <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={12} sm={6}>
            <TextField
                    fullWidth
                    margin="dense"
                    type='number'
                    label="Personal Number"
                    variant="outlined"
                    id="Personal_Number"
                    name="Personal_Number"
                    value={formData.Personal_Number}
                    onChange={handleChange}
                    helperText="Only letters are allowed."
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="First Name"
                    variant="outlined"
                    id="Emp_Fname"
                    name="Emp_Fname"
                    value={formData.Emp_Fname}
                    onChange={handleChange}
                    helperText="Only letters are allowed."
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Last Name"
                    variant="outlined"
                    id="Emp_Lname"
                    name="Emp_Lname"
                    value={formData.Emp_Lname}
                    onChange={handleChange}
                    helperText="Only letters are allowed."
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    variant="outlined"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    helperText="Must end with @ubt-uni.net or .com."
                    disabled
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Date of Birth"
                    variant="outlined"
                    type="date"
                    id="Birth_Date"
                    name="Birth_Date"
                    value={formData.Birth_Date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    helperText="Only dates are allowed."
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
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} sm={6}>
                {userRole === 'admin' && (

                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel id="department-select-label">Department</InputLabel>
                        <Select
                            labelId="department-select-label"
                            id="visitDepartmentID"
                            name="Dept_ID"
                            value={formData.Dept_ID}
                            onChange={handleChange}
                            label="Department"
                        >
                            <MenuItem value=""><em>Select Department</em></MenuItem>
                            {department.map((departmenttype) => (
                                <MenuItem key={departmenttype.Dept_ID} value={departmenttype.Dept_ID}>
                                    {departmenttype.Dept_name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>Please select a department.</FormHelperText>
                    </FormControl>
                )}
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
                    // disabled                     
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="qualifications-label">Qualifications</InputLabel>
                    <Select
                        labelId="qualifications-label"
                        id="Qualifications"
                        name="Qualifications"
                        value={formData.Qualifications}
                        onChange={handleChange}
                        label="Qualifications"
                        // disabled
                    >
                        <MenuItem value=""><em>Select Qualifications</em></MenuItem>
                        <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
                        <MenuItem value="Master's Degree">Master's Degree</MenuItem>
                        <MenuItem value="PhD">PhD</MenuItem>
                        <MenuItem value="Diploma">Diploma</MenuItem>
                    </Select>
                    <FormHelperText>Select your qualifications.</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="dense">
                    <InputLabel id="specialization-label">Specialization</InputLabel>
                    <Select
                        labelId="specialization-label"
                        id="Specialization"
                        name="Specialization"
                        value={formData.Specialization}
                        onChange={handleChange}
                        label="Specialization"
                        // disabled
                    >
                        <MenuItem value=""><em>Select Specialization</em></MenuItem>
                        <MenuItem value="Emergency medicine">Emergency medicine</MenuItem>
                        <MenuItem value="Diagnostic radiology">Diagnostic radiology</MenuItem>
                        <MenuItem value="Medical genetics">Medical genetics</MenuItem>
                        <MenuItem value="Internal medicine">Internal medicine</MenuItem>
                    </Select>
                    <FormHelperText>Select your specialization.</FormHelperText>
                </FormControl>

                <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel id="department-select-label">Department</InputLabel>
                <Select
                        labelId="department-select-label"
                        id="visitDepartmentID"
                        name="Dept_ID"
                        value={formData.Dept_ID}
                        onChange={handleChange}
                        label="Department"
                        >
                        <MenuItem value=""><em>Select Department</em></MenuItem>
                            {department.map((departmenttype) => (
                                <MenuItem key={departmenttype.Dept_ID} value={departmenttype.Dept_ID}>
                                    {`${departmenttype.Dept_name}`}
                                </MenuItem>
                        ))}
                </Select>
                        <FormHelperText>Please select a department.</FormHelperText>
                </FormControl>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Joining Date"
                    variant="outlined"
                    type="date"
                    id="Joining_Date"
                    name="Joining_Date"
                    value={formData.Joining_Date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    helperText="Only dates are allowed."
                    disabled
                />
            </Grid>
        </Grid>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mx: 0.5 }}>
                Submit
            </Button>
            <Button variant="outlined" onClick={onClose} sx={{ mx: 0.5 }}>
                Cancel
            </Button>
        </Box>

    </Box>
</Modal>

        );
    }

    export default UpdateStaff;

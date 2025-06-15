import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Modal, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import Cookies from 'js-cookie';

const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function CreateUser({ onClose }) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        role: 'patient' // Default role set to 'patient'
    });

    const [users, setUsers] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
const [userRole, setUserRole] = useState('');
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch the current logged-in user's details
                const userResponse = await axios.get('http://localhost:9004/api/user', { withCredentials: true });
                const currentUserEmail = userResponse.data.email;
    
                // Fetch all users
                const allUsersResponse = await axios.get('http://localhost:9004/api/users', { withCredentials: true });
    
                if (userRole === 'admin') {
                    // If the user is an admin, set all users
                    setUsers(allUsersResponse.data);
                } else {
                    // If not an admin, set only the current user
                    const currentUser = allUsersResponse.data.find(user => user.email === currentUserEmail);
                    setUsers(currentUser ? [currentUser] : []);
                }
            } catch (err) {
                console.error('Error fetching users:', err.response ? err.response.data : err.message);
            }
        };
    
        if (userRole) {
            fetchUsers();
        }
    }, [userRole]); // Removing token as it's not needed for comparison
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddUser = async () => {
        try {
            await axios.post("http://localhost:9004/api/users/create", formData, { withCredentials: true });
            navigate('/dashboard/user');
            window.location.reload();
        } catch (error) {
            console.error('Error adding user:', error);
            if (error.response && error.response.data && error.response.data.error) {
                showAlert(error.response.data.error); // Display the error message from the backend
            } else {
                showAlert('An unexpected error occurred.');
            }
        }
    };

    const handleValidation = () => {
        const { email, username, password, role } = formData;

        if (!email.trim() || !username.trim() || !password.trim() || !role.trim()) {
            showAlert('All fields are required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Invalid email address');
            return;
        }

        if (username.length < 3) {
            showAlert('Username must be at least 3 characters long');
            return;
        }

        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long');
            return;
        }
        const validateName = (name) => /^[A-Za-z]+$/.test(name);
        if (!validateName(username)) {
            showAlert('Username can only contain letters.');
            return;
        }
        const existingUserByUsername = users.find(user => user.username === username);
        if (existingUserByUsername) {
            showAlert('User with the same username already exists');
            return;
        }

        
        const existingUserByemail = users.find(user => user.email === email);
        if (existingUserByemail) {
            showAlert('User with the same email already exists');
            return;
        }

        handleAddUser();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                </Suspense>
                <Typography variant="h6" component="h1" gutterBottom>Add User</Typography>

                {/* Email Field */}
                <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    variant="outlined"
                    // id="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <FormHelperText>Enter a valid email address (e.g., example@domain.com).</FormHelperText>

                {/* Username Field */}
                <TextField
                    fullWidth
                    margin="dense"
                    label="Username"
                    variant="outlined"
                    // id="username"
                    name="username"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <FormHelperText>Username must be at least 3 characters long.</FormHelperText>

                {/* Password Field */}
                <TextField
                    fullWidth
                    margin="dense"
                    label="Password"
                    variant="outlined"
                    type="password"
                    // id="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <FormHelperText>Password must be at least 6 characters long.</FormHelperText>

                {/* Role Field */}
                <FormControl fullWidth margin="dense">
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        label="Role"
                    >
                        <MenuItem value="patient">Patient</MenuItem>
                        <MenuItem value="doctor">Doctor</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                    <FormHelperText>Select the role for the new user.</FormHelperText>
                </FormControl>

                {/* Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateUser;

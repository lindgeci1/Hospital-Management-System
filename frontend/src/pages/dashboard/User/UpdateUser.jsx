import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { Box, TextField, Button, FormHelperText , Typography, Modal, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';
import {jwtDecode}from 'jwt-decode';
const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function UpdateUser({ id, onClose }) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        role: '',
        password: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [users, setUsers] = useState([]);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/users/${id}`, { withCredentials: true });
                const data = response.data;
                setOriginalData(data);
                setFormData({
                    email: data.email,
                    username: data.username,
                    role: data.UserRoles && data.UserRoles.length > 0 ? data.UserRoles[0].Role.role_name : '',
                    password: ''
                });
            } catch (error) {
                console.error('Error fetching user:', error);
                showAlert('Error fetching user details.');
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/users', { withCredentials: true });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchAllUsers();
    }, []);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdateUser = async () => {
        const { email, username, password, role } = formData;

        if (!email.trim()) {
            showAlert('Email cannot be empty.');
            return;
        }

        if (!username.trim()) {
            showAlert('Username cannot be empty.');
            return;
        }

        // if (!role.trim()) {
        //     showAlert('Role cannot be empty.');
        //     return;
        // }

        if (!password.trim()) {
            showAlert('Password cannot be empty.');
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Invalid email address');
            return;
        }

        if (email === originalData.email && username === originalData.username && role === (originalData.UserRoles && originalData.UserRoles.length > 0 ? originalData.UserRoles[0].Role.role_name : '') && password === originalData.password) {
            showAlert('Data must be changed before updating.');
            return;
        }

        const existingUserByUsername = users.find(user => user.username === username && user.user_id !== id);
        if (existingUserByUsername) {
            showAlert('User with the same username already exists');
            return;
        }

        const existingUserByUsername1 = users.find(user => user.email === email && user.user_id !== id);
        if (existingUserByUsername1) {
            showAlert('User with the same email already exists');
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/users/update/${id}`, formData, { withCredentials: true });

            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating user:', error);
            showAlert('Error updating user. Please try again.');
        }
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                </Suspense>
                <Typography variant="h6" component="h1" gutterBottom>Update User</Typography>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    variant="outlined"
                    id="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    helperText="Please enter a valid email address."
                    // disabled
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Username"
                    variant="outlined"
                    id="username"
                    name="username"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleChange}
                    helperText="Username must be at least 3 characters long."
                />
                {/* {userRole == 'admin' && (
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
                    <Typography variant="caption" display="block" gutterBottom>
                        Select the user role from the list.
                    </Typography>
                </FormControl>
                )} */}

                        <FormControl fullWidth margin="dense">
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Password"
                            variant="outlined"
                            type="password"
                            name="password"
                            placeholder="Enter new password" // or "******" if you prefer
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Typography variant="caption" display="block" gutterBottom>
                            Password must be at least 6 characters long.
                        </Typography>
                        </FormControl>




                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateUser} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
                
            </Box>
        </Modal>
    );
}

export default UpdateUser;

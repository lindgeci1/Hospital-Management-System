import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateUser from './CreateUser';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import Cookies from 'js-cookie'; // Import js-cookie
import {jwtDecode}from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
function User({
    showCreateForm,
    setShowCreateForm,
    setShowUpdateForm,
    showUpdateForm,
    setSelectedUserId,
}) {
    const [users, setUsers] = useState([]);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
        try {
            // Fetch user data from the secure API endpoint
            const response = await axios.get('http://localhost:9004/api/user', { withCredentials: true });
            const {email, role } = response.data;
            setUserRole(role);
            // console.log(role)
            // Fetch registration status based on fetched email and role
            const statusResponse = await axios.get(
            `http://localhost:9004/api/users/registration-status/${email}/${role}`, 
            { withCredentials: true }
            );
            const statusMessage = statusResponse.data.message;
            if (statusMessage === "Patient not registered fully") {
            navigate('/dashboard/patient',{ state: { openUpdateForm: true, patientId: email } });
            } else if (statusMessage === "Staff not registered fully") {
            navigate('/dashboard/staffs' ,{ state: { openUpdateForm: true, staffId: email } }   );
            }
        } catch (err) {
            console.error('Error fetching user data:', err.response ? err.response.data : err.message);
        }
        };

        fetchUserData();
    }, [navigate]);
    
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
    
    

    const handleUpdateButtonClick = (userId) => {
        setSelectedUserId(userId);
        setShowUpdateForm((prevState) => prevState === userId ? null : userId);
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };

    const handleDelete = (id) => {
        setDeleteUserId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/users/delete/${deleteUserId}`, { withCredentials: true });
            setUsers(users.filter((user) => user.user_id !== deleteUserId));
            // Close the create form if open
            if (showCreateForm) {
                setShowCreateForm(false);
            }
            // Close the update form if open
            if (showUpdateForm) {
                setShowUpdateForm(false);
            }
        } catch (err) {
            console.log(err);
        }
        setDeleteUserId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        ...(userRole !== 'patient' ? [
        { field: 'user_id', headerName: 'User ID', flex: 1 },
    ] : []),
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'username', headerName: 'Username', flex: 1 },
        { field: 'role', headerName: 'Role', flex: 1 }, // Role column
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.user_id)}
                    startIcon={<Edit />}
                >
                </Button>
            ),
        },
        ...(userRole == 'admin' ? [
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.user_id)}
                    startIcon={<Delete />}
                >
                </Button>
            ),
        }
    ] : [])
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteUserId && (
                <Dialog
                    open={!!deleteUserId}
                    onClose={() => setDeleteUserId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteUserId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Box mt={4} display="flex" alignItems="center">
                <Typography variant="h6" style={{ marginRight: 'auto' }}>
                    Users
                </Typography>
                {userRole == 'admin' && !showCreateForm && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreateUser onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.user_id}
                    autoHeight
                />
            </Box>
        </div>
    );
}

export default User;

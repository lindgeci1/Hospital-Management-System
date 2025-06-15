import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import {jwtDecode}from 'jwt-decode';
const CreateRoom = lazy(() => import('./CreateRoom'));
const UpdateRoom = lazy(() => import('./UpdateRoom'));

function Room({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedRoomId }) {
    const [rooms, setRooms] = useState([]);
    const [deleteRoomId, setDeleteRoomId] = useState(null);
    const [email, setEmail] = useState('');
    const location = useLocation();
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();
    const handleUpdateButtonClick = (roomId) => {
        setSelectedRoomId(roomId);
        setShowUpdateForm(true);
    };

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
        const fetchData = async () => {
            try {
                const [roomRes, patientRes] = await Promise.all([
                    axios.get('http://localhost:9004/api/room', { withCredentials: true }),
                    axios.get('http://localhost:9004/api/patient', { withCredentials: true })
                ]);

                const patients = patientRes.data;
                const roomsDataWithNames = roomRes.data.map(room => {
                    const patient = patients.find(p => p.Patient_ID === room.Patient_ID);
                    return {
                        ...room,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown',
                    };
                });

                setRooms(roomsDataWithNames);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();

        // Check if navigation state contains patientId to show the CreateRoom form
        if (location.state?.patientId && location.state?.showCreateForm) {
            setShowCreateForm(true);
        }
    }, [ location.state, setShowCreateForm]);

    const handleDelete = (id) => {
        setDeleteRoomId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/room/delete/${deleteRoomId}`, { withCredentials: true });
            setRooms(rooms.filter(item => item.Room_ID !== deleteRoomId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error(err);
        }
        setDeleteRoomId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        ...(userRole !== 'patient' ? [
        { field: 'Room_ID', headerName: 'ID', flex: 1 },
    ] : []),
        { field: 'Room_type', headerName: 'Room Type', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 1 },
        { field: 'Room_cost', headerName: 'Cost (€)', flex: 1 },
        ...(userRole !== 'patient' ? [
        {
            
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Room_ID)}
                    startIcon={<Edit />}
                >
                </Button>
            )
        },
    ] : []),
    ...(userRole == 'admin' ? [
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Room_ID)}
                    startIcon={<Delete />}
                >
                </Button>
            )
        }
    ] : [])
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteRoomId && (
                <Dialog
                    open={!!deleteRoomId}
                    onClose={() => setDeleteRoomId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this room record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteRoomId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Box mt={4} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">
                    Rooms
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

            {showCreateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <CreateRoom onClose={() => setShowCreateForm(false)} />
                </Suspense>
            )}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={rooms}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Room_ID}
                />
            </Box>

            {showUpdateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateRoom onClose={() => setShowUpdateForm(false)}/>
                </Suspense>
            )}
        </div>
    );
}

export default Room;

import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateEmergencyContact = lazy(() => import('./CreateEmergency_Contact'));
const UpdateEmergencyContact = lazy(() => import('./UpdateEmergency_Contact'));

function EmergencyContact({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedEmergency_ContactId }) {
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [deleteContactId, setDeleteContactId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const location = useLocation(); // Get location from React Router
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleUpdateButtonClick = (contactId) => {
        setSelectedEmergency_ContactId(contactId);
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
        const fetchEmergencyContacts = async () => {
            try {
                const endpoint = 'http://localhost:9004/api/emergency_contact';
                const response = await axios.get(endpoint, { withCredentials: true });
                const data = response.data || [];  // Ensure data is always an array
        
                const emergencyContactsDataWithNames = data.map(contact => ({
                    ...contact,
                    Patient_Name: contact.Patient ? `${contact.Patient.Patient_Fname} ${contact.Patient.Patient_Lname}` : 'Unknown Patient'
                }));
    
                setEmergencyContacts(emergencyContactsDataWithNames);
            } catch (err) {
                // console.error('Error fetching emergency contacts:', err);  // Log the full error object
            }
        };
    
        fetchEmergencyContacts();

        // Check if navigation state contains patientId to show the CreateEmergencyContact form
        if (location.state?.patientId && location.state?.showCreateForm) {
            setShowCreateForm(true);
        }
    }, [location.state, setShowCreateForm]);

    const handleDelete = (id) => {
        setDeleteContactId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/emergency_contact/delete/${deleteContactId}`, { withCredentials: true });
            setEmergencyContacts(emergencyContacts.filter(item => item.Contact_ID !== deleteContactId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error deleting emergency contact:', err.response ? err.response.data : err.message);
        }
        setDeleteContactId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        ...(userRole !== 'patient' ? [
        { field: 'Contact_ID', headerName: 'Contact ID', flex: 1 },
    ] : []),
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 1 },
        { field: 'Contact_Name', headerName: 'Contact Name', flex: 1 },
        { field: 'Phone', headerName: 'Phone', flex: 1 },
        { field: 'Relation', headerName: 'Relation', flex: 1 },
        ...(userRole !== 'doctor' ? [
            {
                field: 'update',
                headerName: 'Update',
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateButtonClick(params.row.Contact_ID)}
                        startIcon={<Edit />}
                    >
                    </Button>
                ),
            },
            {
                field: 'delete',
                headerName: 'Delete',
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(params.row.Contact_ID)}
                        startIcon={<Delete />}
                    >
                    </Button>
                ),
            }
        ] : [])
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteContactId && (
                <Dialog
                    open={!!deleteContactId}
                    onClose={() => setDeleteContactId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this emergency contact?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteContactId(null)} color="primary">
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
                    Emergency Contacts
                </Typography>
                {userRole !== 'doctor' && !showCreateForm && (
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
                    <CreateEmergencyContact onClose={() => setShowCreateForm(false)} />
                </Suspense>
            )}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={emergencyContacts}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Contact_ID}
                />
            </Box>

            {showUpdateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateEmergencyContact onClose={() => setShowUpdateForm(false)} />
                </Suspense>
            )}
        </div>
    );
}

export default EmergencyContact;

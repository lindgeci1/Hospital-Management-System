import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import {jwtDecode} from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
const CreateMedicalHistory = lazy(() => import('./CreateMedicalHistory'));
const UpdateMedicalHistory = lazy(() => import('./UpdateMedicalHistory'));

function MedicalHistory({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedMedicalHistoryId }) {
    const [medicalHistorys, setMedicalHistorys] = useState([]);
    const [deleteMedicalHistoryId, setDeleteMedicalHistoryId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [email, setEmail] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const handleUpdateButtonClick = (medicalHistoryId) => {
        setSelectedMedicalHistoryId(medicalHistoryId);
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
        const fetchMedicalHistories = async () => {
            try {
                const endpoint = 'http://localhost:9004/api/medicalhistory';
                const response = await axios.get(endpoint, { withCredentials: true });
                

                // console.log('API Response:', response.data);
                // Check if response.data is an array
                if (!Array.isArray(response.data)) {
                    console.error('Unexpected response structure:', response.data);
                    setMedicalHistorys([]); // Set an empty array if response is not an array
                    return;
                }
    
                const data = response.data;
    
                const medicalHistoriesDataWithNames = data.map(history => ({
                    ...history,
                    Patient_Name: history.Patient ? `${history.Patient.Patient_Fname} ${history.Patient.Patient_Lname}` : 'Unknown Patient'
                }));
    
                setMedicalHistorys(medicalHistoriesDataWithNames);
            } catch (err) {
                console.error('Error fetching medical histories:', err.response ? err.response.data : err.message);
            }
        };
    
        fetchMedicalHistories();
    
        if (location.state?.patientId && location.state?.showCreateForm) {
            setShowCreateForm(true);
        }
    }, [location.state, setShowCreateForm]);
    
    

    const handleDelete = (id) => {
        setDeleteMedicalHistoryId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/medicalhistory/delete/${deleteMedicalHistoryId}`, { withCredentials: true });
            setMedicalHistorys(medicalHistorys.filter(item => item.Record_ID !== deleteMedicalHistoryId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error deleting medical history:', err.response ? err.response.data : err.message);
        }
        setDeleteMedicalHistoryId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date));
    };

    const columns = [
        ...(userRole !== 'doctor' ? [
        { field: 'Record_ID', headerName: 'ID', flex: 1 },
    ] : []),
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 1 },
        { field: 'Allergies', headerName: 'Allergies', flex: 1 },
        { field: 'Pre_Conditions', headerName: 'Pre Conditions', flex: 1 },
        ...(userRole !== 'doctor' ? [
            {
                field: 'update',
                headerName: 'Update',
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateButtonClick(params.row.Record_ID)}
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
                        onClick={() => handleDelete(params.row.Record_ID)}
                        startIcon={<Delete />}
                    >
                    </Button>
                )
            }
        ] : [])
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteMedicalHistoryId && (
                <Dialog
                    open={!!deleteMedicalHistoryId}
                    onClose={() => setDeleteMedicalHistoryId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this medical history record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteMedicalHistoryId(null)} color="primary">
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
                    Medical Histories
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
                    <CreateMedicalHistory onClose={() => setShowCreateForm(false)} />
                </Suspense>
            )}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={medicalHistorys}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Record_ID}
                />
            </Box>

            {showUpdateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateMedicalHistory onClose={() => setShowUpdateForm(false)} />
                </Suspense>
            )}
        </div>
    );
}

export default MedicalHistory;

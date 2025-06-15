import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateInsurance from './CreateInsurance';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import {jwtDecode}from 'jwt-decode';

function Insurance({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedInsuranceId,
}) {
    const [insurance, setInsurance] = useState([]);
    const [deleteInsuranceId, setDeleteInsuranceId] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [patients, setPatients] = useState([]);
    const location = useLocation(); // Get location from React Router
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
        const deleteExpiredInsurance = async () => {
            const currentDate = new Date();
            const expiredInsurance = insurance.filter(ins => new Date(ins.End_Date) < currentDate);

            for (const ins of expiredInsurance) {
                try {
                    await axios.delete(`http://localhost:9004/api/insurance/delete/${ins.Policy_Number}`, { withCredentials: true });
                    setInsurance(prevInsurance => prevInsurance.filter(data => data.Policy_Number !== ins.Policy_Number));
                } catch (err) {
                    console.error('Error deleting expired insurance:', err);
                }
            }
        };

        if (isDataLoaded) {
            deleteExpiredInsurance();
        }
    }, [insurance, isDataLoaded ]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const insuranceRes = await axios.get('http://localhost:9004/api/insurance', { withCredentials: true });

                const patientsRes = await axios.get('http://localhost:9004/api/patient', { withCredentials: true });

                const patientsData = patientsRes.data;

                const insuranceDataWithNames = insuranceRes.data.map(ins => {
                    const patient = patientsData.find(pat => pat.Patient_ID === ins.Patient_ID);
                    return {
                        ...ins,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown'
                    };
                });

                setInsurance(insuranceDataWithNames);
                setPatients(patientsData);
                setIsDataLoaded(true);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();

        // Check if navigation state contains patientId to show the CreateInsurance form
        if (location.state?.patientId && location.state?.showCreateForm) {
            setShowCreateForm(true);
        }
    }, [location.state, setShowCreateForm]);

    const handleUpdateButtonClick = (insuranceId) => {
        setSelectedInsuranceId(insuranceId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteInsuranceId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/insurance/delete/${deleteInsuranceId}`, { withCredentials: true });
            setInsurance(insurance.filter((data) => data.Policy_Number !== deleteInsuranceId));
        } catch (err) {
            console.error('Error deleting insurance:', err);
        }
        setDeleteInsuranceId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        ...(userRole !== 'patient' ? [
        { field: 'Policy_Number', headerName: 'Policy Number', flex: 1 },
    ] : []),
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 1 },
        { field: 'Ins_Code', headerName: 'Ins. Code', flex: 1 },
        { field: 'End_Date', headerName: 'End Date', flex: 1 },
        { field: 'Provider', headerName: 'Provider', flex: 1 },
        { field: 'Coverage', headerName: 'Coverage(in %)', flex: 1 },

        {
            field: 'update',
            headerName: 'Update',
            flex: 1 ,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Policy_Number)}
                    startIcon={<Edit />}
                >
                </Button>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1 ,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Policy_Number)}
                    startIcon={<Delete />}
                >
                </Button>
            ),
        }
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteInsuranceId && (
                <Dialog
                    open={!!deleteInsuranceId}
                    onClose={() => setDeleteInsuranceId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this insurance record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteInsuranceId(null)} color="primary">
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
                    Insurance Records
                </Typography>
                {showCreateForm ? null : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreateInsurance onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                {isDataLoaded && (
                    <DataGrid
                        rows={insurance}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.Policy_Number}
                        autoHeight
                        hideFooterSelectedRowCount
                    />
                )}
            </Box>
        </div>
    );
}

export default Insurance;

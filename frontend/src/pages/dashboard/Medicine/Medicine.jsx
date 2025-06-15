import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateMedicine from './CreateMedicine';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import Cookies from 'js-cookie';
import {jwtDecode}from 'jwt-decode'; // Make sure jwtDecode is imported
import { useLocation, useNavigate } from 'react-router-dom';

function Medicine({
    showCreateForm,
    setShowCreateForm,
    setShowUpdateForm,
    setSelectedMedicineId,
}) {
    const [medicine, setMedicine] = useState([]);
    const [patients, setPatients] = useState([]);
    const [deleteMedicineId, setDeleteMedicineId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [email, setEmail] = useState('');
      const navigate = useNavigate();
    const location = useLocation();

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
        const fetchMedicines = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/medicine', { withCredentials: true });
                const data = response.data; // Accessing data directly from the response
                const medicineDataWithNames = data.map(item => ({
                    ...item,
                    Patient_Name: item.Patient ? `${item.Patient.Patient_Fname} ${item.Patient.Patient_Lname}` : 'Unknown Patient'
                }));
    
                setMedicine(medicineDataWithNames);
            } catch (err) {
                console.error('Error fetching medicines:',  err.response ? err.response.data : err.message); // Log the entire error object
            }
        };
    
        fetchMedicines();
    
        // Check if navigation state contains patientId to show the CreateInsurance form
        if (location.state?.patientId && location.state?.showCreateForm) {
            setShowCreateForm(true);
        }
    }, [ location.state, setShowCreateForm]);
    
    
    

    const handleUpdateButtonClick = (medicineId) => {
        setSelectedMedicineId(medicineId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteMedicineId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/medicine/delete/${deleteMedicineId}`, { withCredentials: true });
            setMedicine(medicine.filter((item) => item.Medicine_ID !== deleteMedicineId));
        } catch (err) {
            console.error('Error deleting medicine:', err);
        }
        setDeleteMedicineId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        ...(userRole !== 'patient' ? [
        { field: 'Medicine_ID', headerName: 'ID', flex: 1 },
    ] : []),
        { field: 'M_name', headerName: 'Name', flex: 1 },
        { field: 'M_Quantity', headerName: 'Quantity', flex: 1 },
        { field: 'M_Cost', headerName: 'Cost', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 1 },
        ...(userRole !== 'patient' ? [
            {
                field: 'update',
                headerName: 'Update',
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateButtonClick(params.row.Medicine_ID)}
                        startIcon={<Edit />}
                    />
                ),
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
                        onClick={() => handleDelete(params.row.Medicine_ID)}
                        startIcon={<Delete />}
                    />
                ),
            }
        ] : [])
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteMedicineId && (
                <Dialog open={!!deleteMedicineId} onClose={() => setDeleteMedicineId(null)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this medicine record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteMedicineId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Box mt={4} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Medicines</Typography>
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

            {showCreateForm && <CreateMedicine onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={medicine}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Medicine_ID}
                />
            </Box>
        </div>
    );
}

export default Medicine;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateDepartment from './CreateDepartment';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Department({ showCreateForm, setShowCreateForm, setShowUpdateForm, setSelectedDepartmentIdId }) {
    const [department, setDepartment] = useState([]);
    const [deleteDepartmentId, setDeleteDepartmentId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();
    const hasFetchedData = useRef(false); // Track API calls

    // Fetch user data once on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/user', { withCredentials: true });
                const { email, role } = response.data;
                setUserRole(role);

                // Check if the user needs to be redirected
                const statusResponse = await axios.get(
                    `http://localhost:9004/api/users/registration-status/${email}/${role}`, 
                    { withCredentials: true }
                );
                const statusMessage = statusResponse.data.message;

                if (statusMessage === "Patient not registered fully") {
                    navigate('/dashboard/patient', { state: { openUpdateForm: true, patientId: email } });
                } else if (statusMessage === "Staff not registered fully") {
                    navigate('/dashboard/staffs', { state: { openUpdateForm: true, staffId: email } });
                }
            } catch (err) {
                console.error('Error fetching user data:', err.response ? err.response.data : err.message);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Fetch department data once on mount
    useEffect(() => {
        if (hasFetchedData.current) return;
        hasFetchedData.current = true;

        const fetchDepartmentData = async () => {
            try {
                const res = await axios.get('http://localhost:9004/api/department', { withCredentials: true });
                setDepartment(res.data);
            } catch (err) {
                console.error('Error fetching department data:', err);
            }
        };

        fetchDepartmentData();
    }, []);

    // Handle updating a department
    const handleUpdateButtonClick = (departmentId) => {
        setSelectedDepartmentIdId(departmentId);
        setShowUpdateForm((prevState) => prevState === departmentId ? null : departmentId);
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };

    // Handle deleting a department
    const handleDelete = (id) => {
        setDeleteDepartmentId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/department/delete/${deleteDepartmentId}`, { withCredentials: true });
            setDepartment(department.filter((item) => item.Dept_ID !== deleteDepartmentId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error deleting department:', err);
        }
        setDeleteDepartmentId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false); 
    };

    // Define DataGrid columns
    const columns = [
        { field: 'Dept_ID', headerName: 'ID', flex: 1 },
        { field: 'Dept_head', headerName: 'Department Head', flex: 1 },
        { field: 'Dept_name', headerName: 'Department Name', flex: 1 },
        { field: 'Emp_Count', headerName: 'Employee Count', flex: 1 },
        ...(userRole === 'admin' ? [
            {
                field: 'update',
                headerName: 'Update',
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateButtonClick(params.row.Dept_ID)}
                        startIcon={<Edit />}
                    />
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
                        onClick={() => handleDelete(params.row.Dept_ID)}
                        startIcon={<Delete />}
                    />
                ),
            }
        ] : [])
    ];

    return (
        <Box className='container-fluid mt-4' display="flex" flexDirection="column" flexGrow={1}>
            {/* Delete Confirmation Dialog */}
            {deleteDepartmentId && (
                <Dialog open={!!deleteDepartmentId} onClose={() => setDeleteDepartmentId(null)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Are you sure you want to delete this department record?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDepartmentId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Header & Create Button */}
            <Box mt={4} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Departments</Typography>
                {userRole === 'admin' && !showCreateForm && (
                    <Button variant="contained" color="primary" onClick={handleCreateFormToggle} startIcon={<Add />} />
                )}
            </Box>

            {/* Create Department Form */}
            {showCreateForm && <CreateDepartment onClose={() => setShowCreateForm(false)} />}

            {/* DataGrid */}
            <Box mt={4} flexGrow={1} width="100%">
                <DataGrid
                    rows={department}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Dept_ID}
                />
            </Box>
        </Box>
    );
}

export default Department;

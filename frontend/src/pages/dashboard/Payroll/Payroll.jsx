import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreatePayroll from './CreatePayroll';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Payroll({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedPayrollId,
}) {
    const [payroll, setPayroll] = useState([]);
    const [deletePayrollId, setDeletePayrollId] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [userRole, setUserRole] = useState('');
    const location = useLocation();
    const [email, setEmail] = useState('');
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
                const payrollRes = await axios.get('http://localhost:9004/api/payroll', { withCredentials: true });

                const employeesRes = await axios.get('http://localhost:9004/api/staff', { withCredentials: true });

                const employeesData = employeesRes.data;

                // Add employee names to the payroll data
                const payrollDataWithNames = payrollRes.data.map(payroll => {
                    const employee = employeesData.find(emp => emp.Emp_ID === payroll.Emp_ID);
                    return {
                        ...payroll,
                        Employee_Name: employee ? `${employee.Emp_Fname} ${employee.Emp_Lname}` : 'Unknown'
                    };
                });

                setPayroll(payrollDataWithNames);
                setEmployees(employeesData);
                setIsDataLoaded(true);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
        if (location.state?.staffid && location.state?.showCreateForm) {
            setShowCreateForm(true);
        }
    }, [location.state, setShowCreateForm]);

    const handleUpdateButtonClick = (payrollId) => {
        setSelectedPayrollId(payrollId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeletePayrollId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/payroll/delete/${deletePayrollId}`, { withCredentials: true });
            setPayroll(payroll.filter((data) => data.Account_no !== deletePayrollId));
        } catch (err) {
            console.error('Error deleting payroll:', err);
        }
        setDeletePayrollId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        { field: 'Account_no', headerName: 'ID', flex: 1 },
        { field: 'Salary', headerName: 'Salary(Amount)', flex: 1 },
        { field: 'Employee_Name', headerName: 'Employee', flex: 1 },
        ...(userRole === 'admin' ? [
            {
                field: 'update',
                headerName: 'Update',
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateButtonClick(params.row.Account_no)}
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
                        onClick={() => handleDelete(params.row.Account_no)}
                        startIcon={<Delete />}
                    >
                    </Button>
                ),
            }
        ] : [])
    ];

    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <div className="container-fluid mt-4">
            {deletePayrollId && (
                <Dialog
                    open={!!deletePayrollId}
                    onClose={() => setDeletePayrollId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this payroll record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeletePayrollId(null)} color="primary">
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
                    Payroll
                </Typography>
                {userRole === 'admin' && !showCreateForm && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreatePayroll onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                {isDataLoaded && (
                    <DataGrid
                        rows={payroll}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.Account_no}
                        autoHeight
                        hideFooterSelectedRowCount
                    />
                )}
            </Box>
        </div>
    );
}

export default Payroll;

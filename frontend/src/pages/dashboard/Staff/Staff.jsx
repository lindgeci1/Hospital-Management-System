import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateStaff from './CreateStaff';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useRef } from 'react'; // Import useRef

function Staff({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedStaffId,
}) {
    const [staff, setStaff] = useState([]);
    const [deleteStaffId, setDeleteStaffId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const hasFetchedData = useRef(false); // Track API call execution

    const handleCreateRatingButtonClick = (staffid) => {
        setShowCreateForm(true);
        navigate('/dashboard/rating', { state: { staffid, showCreateForm: true } });
    };
    useEffect(() => {
        const checkAndOpenUpdateForm = async () => {
            if (location.state?.openUpdateForm && staff.length > 0) {
                try {
                    // Fetch the current logged-in user's details
                    const userResponse = await axios.get('http://localhost:9004/api/user', { withCredentials: true });
                    const currentUserEmail = userResponse.data.email;
    
                    // Find the matching staff based on email
                    const matchingStaff = staff.find(item => item.Email === currentUserEmail);
    
                    if (matchingStaff) {
                        setSelectedStaffId(matchingStaff.Emp_ID);
                        setShowUpdateForm(true);
                        // Clear location state so that on refresh the update form does not re-open
                        navigate(location.pathname, { replace: true, state: {} });
                    } else {
                        console.warn("No staff record found for email:", currentUserEmail);
                    }
                } catch (err) {
                    console.error('Error fetching user email:', err.response ? err.response.data : err.message);
                }
            }
        };
    
        checkAndOpenUpdateForm();
    }, [location.state, staff]); // Removed token from dependencies as it's no longer needed
    
      
    const handleCreatePayrollButtonClick = (staffid) => {
        setShowCreateForm(true);
        navigate('/dashboard/payroll', { state: { staffid, showCreateForm: true } });
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
    if (hasFetchedData.current) return; 
    hasFetchedData.current = true;

    const fetchData = async () => {
        try {
            const staffRes = await axios.get('http://localhost:9004/api/staff', { withCredentials: true });

            const staffData = Array.isArray(staffRes.data) ? staffRes.data : staffRes.data.data;
            
            if (Array.isArray(staffData)) {
                const staffDataWithNames = staffData.map(staff => {
                    const department = staff.Department || {};  
                    return {
                        ...staff,
                        Dept_Name: department.Dept_name || '' 
                    };
                });
                setStaff(staffDataWithNames);
                setIsDataLoaded(true);
            } else {
                console.error('Unexpected staff data format:', staffRes.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    fetchData();
}, []);
    
    
    

    const handleUpdateButtonClick = (staffId) => {
        setSelectedStaffId(staffId);
        setShowUpdateForm((prevState) => prevState === staffId ? null : staffId);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteStaffId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            console.log(`Deleting staff with ID: ${deleteStaffId}`);
            await axios.delete(`http://localhost:9004/api/staff/delete/${deleteStaffId}`, { withCredentials: true });
            console.log('Staff deleted successfully');
            setStaff(staff.filter((data) => data.Emp_ID !== deleteStaffId));
            setDeleteStaffId(null);
        } catch (err) {
            console.error('Error deleting staff:', err);
        }
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
    };

    const filteredStaff = staff.filter((staff) => {
        const departmentFullName = staff.Department && staff.Department.Dept_name ? staff.Department.Dept_name.toLowerCase() : '';
        const searchQueryLower = searchQuery.toLowerCase();
        return departmentFullName.includes(searchQueryLower);
    });

    const columns = [
        
        { field: 'Emp_ID', headerName: 'ID', flex: 1 },
        { field: 'Personal_Number', headerName: 'Personal_Number', flex: 1 },
        { field: 'Emp_Fname', headerName: 'Name', flex: 1 },
        { field: 'Emp_Lname', headerName: 'Surname', flex: 1 },
        { field: 'Joining_Date', headerName: 'Joining Date', flex: 1 },
        // { field: 'Emp_type', headerName: 'Employee Type', flex: 1 },
        { field: 'Email', headerName: 'Email', flex: 1 },
        { field: 'Dept_Name', headerName: 'Department', flex: 1 },
        { field: 'Gender', headerName: 'Gender', flex: 1 },
        { field: 'Phone', headerName: 'Phone', flex: 1 },
        { field: 'Birth_Date', headerName: 'Date of Birth', flex: 1 },
        { field: 'Qualifications', headerName: 'Qualifications', flex: 1 },
        { field: 'Specialization', headerName: 'Specialization', flex: 1 },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Emp_ID)}
                    startIcon={<Edit />}
                >
                </Button>
            )
        },
        ...(userRole  == 'admin' ? [
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Emp_ID)}
                    startIcon={<Delete />}
                >
                </Button>
            )
        },
   
        {
            field: 'createRating',
            headerName: 'Rating',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCreateRatingButtonClick(params.row.Emp_ID)}
                    startIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                    }
                >
                    
                </Button>
            )
        },
        {
            field: 'createPayroll',
            headerName: 'Payroll',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCreatePayrollButtonClick(params.row.Emp_ID)}
                    startIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
</svg>
                    }
                >
                    
                </Button>
            )
        }
    ] : []),
    ];

    return (
        <div className="container-fluid mt-4">
            {deleteStaffId && (
                <Dialog
                    open={!!deleteStaffId}
                    onClose={() => setDeleteStaffId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this staff record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteStaffId(null)} color="primary">
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
                    Staff
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

            {showCreateForm && <CreateStaff onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={filteredStaff}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Emp_ID}
                    autoHeight
                />
            </Box>
        </div>
    );
}

export default Staff;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateRating from './CreateRating';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
function Rating({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedRatingId,
}) {
    const [rating, setRating] = useState([]);
    const [deleteRatingId, setDeleteRatingId] = useState(null);
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
                const ratingRes = await axios.get('http://localhost:9004/api/rating',  { withCredentials: true });

                const employeesRes = await axios.get('http://localhost:9004/api/staff',  { withCredentials: true });

                const employeesData = employeesRes.data;

                // Add employee names to the rating data
                const ratingDataWithNames = ratingRes.data.map(rating => {
                    const employee = employeesData.find(emp => emp.Emp_ID === rating.Emp_ID);
                    return {
                        ...rating,
                        Employee_Name: employee ? `${employee.Emp_Fname} ${employee.Emp_Lname}` : 'Unknown'
                    };
                });

                setRating(ratingDataWithNames);
                setEmployees(employeesData);
                setIsDataLoaded(true);
                // console.log('Fetched rating data with names:', ratingDataWithNames);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
        if (location.state?.staffid && location.state?.showCreateForm) {
            setShowCreateForm(true);
        }
    }, [location.state, setShowCreateForm]);

    const handleUpdateButtonClick = (ratingId) => {
        setSelectedRatingId(ratingId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteRatingId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/rating/delete/${deleteRatingId}`,  { withCredentials: true });
            setRating(rating.filter((data) => data.Rating_ID !== deleteRatingId));
        } catch (err) {
            console.error('Error deleting rating:', err);
        }
        setDeleteRatingId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        { field: 'Rating_ID', headerName: 'ID', flex: 1 },
        { field: 'Employee_Name', headerName: 'Employee', flex: 1 },
        { field: 'Rating', headerName: 'Rating (1-5)', flex: 1 },
        { field: 'Comments', headerName: 'Comments', flex: 1 },
        { field: 'Date', headerName: 'Date', flex: 1 },
        ...(userRole == 'admin' ? [
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Rating_ID)}
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
                    onClick={() => handleDelete(params.row.Rating_ID)}
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
            {deleteRatingId && (
                <Dialog
                    open={!!deleteRatingId}
                    onClose={() => setDeleteRatingId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this rating record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteRatingId(null)} color="primary">
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
                    Ratings
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

            {showCreateForm && <CreateRating onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                {isDataLoaded && (
                    <DataGrid
                        rows={rating}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.Rating_ID}
                        autoHeight
                        hideFooterSelectedRowCount
                    />
                )}
            </Box>
        </div>
    );
}

export default Rating;

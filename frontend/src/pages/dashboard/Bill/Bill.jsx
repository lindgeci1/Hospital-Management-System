import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit,Paid } from '@mui/icons-material';
import {jwtDecode} from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentWrapper from "./PaymentForm"; // Import the PaymentForm component
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';
const CreateBill = lazy(() => import('./CreateBill'));
const UpdateBill = lazy(() => import('./UpdateBill'));

function Bill({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedBillId }) {
    const [bills, setBills] = useState([]);
    const [deleteBillId, setDeleteBillId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const location = useLocation(); // Get location from React Router
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [selectedBill, setSelectedBill] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const handleUpdateButtonClick = (billId) => {
        setSelectedBillId(billId);
        setShowUpdateForm(true);
    };
    const stripePromise = loadStripe("your-publishable-stripe-key-here");

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
        const fetchBills = async () => {
            try {
                const endpoint = 'http://localhost:9004/api/bills/all';
                const response = await axios.get(endpoint, { withCredentials: true });
    
                // console.log('API Response:', response.data); // Log the full response
    
                // Directly use the response data as the bills array
                const data = response.data; // Assuming response.data is an array of bills
    
                const billsDataWithNames = data.map(bill => ({
                    ...bill,
                    Patient_Name: bill.Patient ? `${bill.Patient.Patient_Fname} ${bill.Patient.Patient_Lname}` : 'Unknown Patient'
                }));
    
                setBills(billsDataWithNames);
            } catch (err) {
                console.error('Error fetching bills:', err.response ? err.response.data : err.message);
            }
        };
    
        fetchBills();
        // Check if navigation state contains patientId to show the CreateInsurance form
        if (location.state?.patientId && location.state?.showCreateForm) {
            setShowCreateForm(true);
        }
    }, [location.state, setShowCreateForm]);
    
    const handleDelete = (id) => {
        setDeleteBillId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/bills/delete/${deleteBillId}`, { withCredentials: true });
            setBills(bills.filter(item => item.Bill_ID !== deleteBillId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error deleting bill:', err.response ? err.response.data : err.message);
        }
        setDeleteBillId(null);
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
    const handleOpenPaymentModal = (bill) => {
        setSelectedBill(bill);
        setShowPaymentModal(true);
    };
    
    const handleClosePaymentModal = () => {
        setSelectedBill(null);
        setShowPaymentModal(false);
    };
    const columns = [
        ...(userRole !== 'patient' ? [
        { field: 'Bill_ID', headerName: 'ID', flex: 1 },
    ] : []),
       ,
        { 
            field: 'Date_Issued', 
            headerName: 'Date Payed', 
            flex: 1,
            renderCell: (params) => formatDate(params.row.Date_Issued)
        },
        { field: 'Description', headerName: 'Description', flex: 1 },
        { field: 'Amount', headerName: 'Amount', flex: 1 },
        { field: 'Payment_Status', headerName: 'Payment Status', flex: 1 },
        
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 1 },
        // { field: 'Stripe_PaymentIntent_ID', headerName: 'Stripe_PaymentIntent_ID', flex: 1 },
        { field: 'Stripe_Status', headerName: 'Stripe_Status', flex: 1 },
        // { field: 'Stripe_ClientSecret', headerName: 'Stripe_ClientSecret', flex: 1 },
        ...(userRole !== 'patient' ? [
            // {
            //     field: 'update',
            //     headerName: 'Update',
            //     flex: 1,
            //     renderCell: (params) => (
            //         <Button
            //             variant="contained"
            //             color="primary"
            //             onClick={() => handleUpdateButtonClick(params.row.Bill_ID)}
            //             startIcon={<Edit />}
            //         >
            //         </Button>
            //     )
            // },
            {
                field: 'delete',
                headerName: 'Delete',
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(params.row.Bill_ID)}
                        startIcon={<Delete />}
                    >
                    </Button>
                )
            }
        ] : []),
        // ...(userRole == 'patient' ? [
            {
                field: 'pay',
                headerName: 'Pay',
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenPaymentModal(params.row)} // Open payment form
                        startIcon={<Paid />}
                        disabled={params.row.Payment_Status === "paid"}
                    >
                        {params.row.Payment_Status === "paid" ? "Paid" : "Pay"}
                    </Button>
                )
            },
    // ] : []),
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteBillId && (
                <Dialog open={!!deleteBillId} onClose={() => setDeleteBillId(null)}>
                    <DialogTitle>Confirm {userRole === 'patient' ? 'Payment' : 'Deletion'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {userRole === 'patient' ? 
                                'Are you sure you want to pay this bill?' : 
                                'Are you sure you want to delete this bill?'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteBillId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            {userRole === 'patient' ? 'Pay' :'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
    
            <Box mt={4} display="flex" alignItems="center">
                <Typography variant="h6" style={{ marginRight: 'auto' }}>Bills</Typography>
                {userRole === 'admin' && !showCreateForm && (
                    <Button variant="contained" color="primary" onClick={handleCreateFormToggle} startIcon={<Add />}>
                    </Button>
                )}
            </Box>
    
            {showCreateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <CreateBill onClose={() => setShowCreateForm(false)} />
                </Suspense>
            )}
    
            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={bills}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Bill_ID}
                />
            </Box>
    
            {showUpdateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateBill onClose={() => setShowUpdateForm(false)} />
                </Suspense>
            )}
    
            {/* ✅ Show Payment Form when user clicks "Pay" */}
            {showPaymentModal && (
    <Elements stripe={stripePromise}>
        <PaymentForm bill={selectedBill} onClose={handleClosePaymentModal} />
    </Elements>
)}
        </div>
    );
    
}

export default Bill;

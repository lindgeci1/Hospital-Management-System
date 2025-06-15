import React, { useState, useEffect } from 'react';
 import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
 import axios from 'axios';
 import Cookies from 'js-cookie';
 import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography, CircularProgress, Card, CardContent, Dialog, DialogActions, DialogTitle } from '@mui/material';
 import { loadStripe } from '@stripe/stripe-js';
 import { jwtDecode } from 'jwt-decode';
 import { useLocation, useNavigate } from 'react-router-dom';
 // console.log('Stripe Key:', import.meta.env.VITE_STRIPE_KEY); // This should log the actual API key
 const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
 const PaymentForm = ({ bill, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(null); // Initialize as null
    const navigate = useNavigate();
    useEffect(() => {
        if (userRole === "patient") {
            setPaymentMethod("credit_card");
        } else {
            setPaymentMethod("cash");
        }
    }, [userRole]); // Update when userRole changes
    
    useEffect(() => {
        const fetchUserData = async () => {
        try {
            // Fetch user data from the secure API endpoint
            const response = await axios.get('http://localhost:9004/api/user', { withCredentials: true });
            const {email, role } = response.data;
            setUserRole(role);
            console.log(role)
            // Fetch registration status based on fetched email and role
            const statusResponse = await axios.get(
            `http://localhost:9004/api/users/registration-status/${email}/${role}`, 
            { withCredentials: true }
            );
            const statusMessage = statusResponse.data.message;
            if (statusMessage === "Patient not registered fully") {
            navigate('/dashboard/patient');
            } else if (statusMessage === "Staff not registered fully") {
            navigate('/dashboard/staffs'    );
            }
        } catch (err) {
            console.error('Error fetching user data:', err.response ? err.response.data : err.message);
        }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchPatientEmail = async () => {
            if (!bill.Patient_ID) return;

            try {
                const response = await axios.get(`http://localhost:9004/api/patient/${bill.Patient_ID}/email`, { withCredentials: true });

                // console.log("🔹 Full API Response for Patient Email:", response.data);

                // If the response is just a raw string, use it directly
                const email = typeof response.data === "string" ? response.data : null;

                if (email) {
                    // console.log("✅ Extracted Email:", email);
                    setPatientEmail(email);
                } else {
                    console.error("❌ Error: Email not found in response", response.data);
                }
            } catch (error) {
                console.error("❌ Error fetching patient email:", error.response ? error.response.data : error.message);
            }
        };

        fetchPatientEmail();
    }, [bill.Patient_ID]);


    const handleCloseErrorDialog = () => {
        setErrorDialogOpen(false);
    };

    const handleSendEmail = async () => {
        const amount = bill.Amount;

        console.log("Attempting to send email:", { patientEmail, amount });

        if (!patientEmail || amount === undefined) {
            console.error("Email or amount missing:", { patientEmail, amount });
            return;
        }

        try {
            const response = await axios.post('http://localhost:9004/api/payments/send-confirmation', {
                patientEmail,
                amount
            }, {
                withCredentials: true
            });
            console.log("✅ Email sent response:", response.data);
        } catch (error) {
            console.error('❌ Failed to send confirmation email:', error.response || error);
        }
    };

    const handlePayment = async () => {
        if (!stripe || !elements) return;
        setLoading(true);

        let paymentMethodId = null;

        if (paymentMethod === "credit_card") {
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement(CardElement),
            });

            if (error) {
                setErrorMessage(error.message);
                setErrorDialogOpen(true);
                setLoading(false);
                return;
            }

            paymentMethodId = paymentMethod.id;
        } else {
            paymentMethodId = "cash";
        }

        try {
            const response = await axios.post("http://localhost:9004/api/payments/confirm",
                {
                    paymentIntentId: bill.Stripe_PaymentIntent_ID,
                    patientId: bill.Patient_ID,
                    paymentMethodId: paymentMethodId,
                },
                { withCredentials: true }
            );

            if (response.data) {
                handleSendEmail();
            }

            alert("✅ Payment Successful!");
            onClose();
            window.location.reload();
        } catch (err) {
            setErrorMessage("Payment failed: " + (err.response ? err.response.data.error : 'An error occurred while processing your payment.'));
            setErrorDialogOpen(true);
        }

        setLoading(false);
    };

    return (
        <Card raised sx={{ maxWidth: 480, mx: "auto", mt: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Complete Payment
                </Typography>
                <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle1" fontWeight="bold">
        Payment Method:
    </Typography>
    <Typography variant="body1">
        {userRole === "patient" ? "Credit Card" : "Cash"}
    </Typography>
</Box>



                    {userRole === "patient" && paymentMethod === "credit_card" && (
    <Box sx={{ mb: 2 }}>
        <CardElement options={{ hidePostalCode: true }} />
    </Box>
)}



                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Confirm Payment"}
                </Button>
            </CardContent>
            <Dialog
                open={errorDialogOpen}
                onClose={handleCloseErrorDialog}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">{errorMessage}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

// Wrap with Elements Provider
const PaymentWrapper = (props) => (
    <Elements stripe={stripePromise}>
        <PaymentForm {...props} />
    </Elements>
);

export default PaymentWrapper;
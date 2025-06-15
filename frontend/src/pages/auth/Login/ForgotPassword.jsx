import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();  // For navigation
    // Validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        setErrorMessage('');  // Clear any previous error messages
    
        // Basic validation to check if email contains "@" and "."
        if (!email) {
            setErrorMessage('Email is required');
            return;  // Stop if email is not provided
        }
    
        if (!email.includes('@') || !email.includes('.')) {
            setErrorMessage('Please enter a valid email address');
            return;  // Stop if email format is invalid
        }
    
        // console.log('Sending email to backend:', email);  // Log the email being sent to the backend
    
        try {
            const response = await Axios.post(
                'http://localhost:9004/api/users/send-verification-code',
                { email: email },
                {
                    headers: {
                        'Content-Type': 'application/json',  // Ensure the content type is application/json
                    },
                }
            );
    
            // console.log('Backend response:', response);  // Log the backend response for debugging
    
            const { data } = response;
    
            // If the backend returns success, show the success message
            if (data.success) {
                setMessage('Verification code sent successfully. Please check your email.');
            } else {
                // If the backend returns an error (e.g., email not found), show the error message
                console.error('Backend error:', data.error);
                setErrorMessage(data.error || 'Error sending verification code');
            }
        } catch (error) {
            // Log the error details if the request fails
            console.error('Error during verification code request:', error);
            setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again later.');
        }
    };
    
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message
        setMessage(''); // Reset success message
    
        if (!code) {
            setErrorMessage('Verification code is required');
            return; // Don't continue if no code is entered
        }
    
        try {
            const response = await Axios.post(
                'http://localhost:9004/api/users/check-verification-code',
                { email: email, code: code },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const { data } = response;
    
            // If the backend sends a success response
            if (data.success) {
                setMessage('Verification code is valid. You can now reset your password.');
                setIsVerified(true); // Indicate successful verification
                // console.log(email);
                // Pass the email as state to CreatePassword component
                navigate('/create-password', { state: { email: email } });
            } else {
                // If the backend returns specific error messages, show them
                setErrorMessage(data.error || 'An unknown error occurred');
            }
        } catch (error) {
            // If there's an Axios error, catch it and display the error message
            if (error.response) {
                // If the response from backend contains error
                setErrorMessage(error.response.data.error || 'An error occurred. Please try again later.');
            } else {
                // Catch network or other errors
                setErrorMessage('An error occurred. Please try again later.');
            }
            console.error(error);
        }
    };
    
    
    
    
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
    
                {/* Show success message */}
                {/* Show success message */}
                    {isVerified ? (
                        <div className="bg-green-500 text-white p-4 rounded mb-4 text-center">
                            <p>{message}</p>
                            {/* You can add the Reset Password form here */}
                        </div>
                    ) : (
                        <>
                            {/* Email form */}
                            <div className="mb-4">
                            {message && !errorMessage && (
                                <div className="bg-green-500 text-white p-4 rounded mb-4">{message}</div>
                            )}
                                {/* Display error message only for email form */}
                                {errorMessage && !code && (
                                    <div className="bg-red-500 text-white p-4 rounded mb-4">{errorMessage}</div>
                                )}
                        
                                <form onSubmit={handleSendVerificationCode}>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Enter your email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Your email"
                                            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                                        Send Verification Code
                                    </button>
                                </form>
                            </div>

                            {/* Verification code form */}
                            {email && (
                                <div>
                                    {/* Display error message only for code form */}
                                    {errorMessage && code && (
                                        <div className="bg-red-500 text-white p-4 rounded mb-4">{errorMessage}</div>
                                    )}

                                    <form onSubmit={handleVerifyCode}>
                                        <div className="mb-4">
                                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Enter the verification code sent to your email</label>
                                            <input
                                                type="text"
                                                id="code"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                placeholder="Your verification code"
                                                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm"
                                            />
                                        </div>
                                        <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600">
                                            Verify Code
                                        </button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}

            </div>
        </div>
    );
    
};

export default ForgotPassword;

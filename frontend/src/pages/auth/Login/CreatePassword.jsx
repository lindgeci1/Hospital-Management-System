import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const CreatePassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('');  // Add state for role
    const [username, setUsername] = useState('');
    useEffect(() => {
        // Get the email passed from the ForgotPassword page
        const { email } = location.state || {};
        if (email) {
            setEmail(email);
            fetchUserData(email);  // Fetch user data based on the email
        } else {
            setErrorMessage('Email not found. Please try again.');
        }
    }, [location]);

    const fetchUserData = async (email) => {
        try {
            const response = await Axios.get(`http://localhost:9004/api/users/email/${email}`);
            if (response.data.success) {
                const { user_id, username, UserRoles } = response.data.data;
                setUserId(user_id);  // Set user ID
                setRole(UserRoles[0]?.Role?.role_name); 
                setUsername(username)
                setMessage('User found. You can now reset your password.');
            } else {
                setErrorMessage('User not found.');
            }
        } catch (error) {
            setErrorMessage('Error fetching user data. Please try again later.');
            console.error(error);
        }
    };
    const handleChangePassword = async (e) => {
        e.preventDefault();
    
        // Clear previous success or error messages before making the API call
        setMessage('');
        setErrorMessage('');
    
        // Password match validation
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
    
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }
    
        try {
            // Make the API call to update the password
            const response = await Axios.put(
                `http://localhost:9004/api/users/update/${userId}`,  // Use the userId to update the password
                { email, password, role, username },  // Send email, password, role, and username
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            // If the update was successful
            if (response.data.success) {
                setMessage('Password changed successfully!');
    
                // Show a message before redirecting
                setTimeout(() => {
                    setMessage('Redirecting to login page...');  // Message before redirect
                    setTimeout(() => {
                        navigate('/login');  // Redirect to login page after password reset
                    }, 1000);  // Wait 1 second for the redirect message to show
                }, 2000); // 2 seconds delay for the user to see the success message
            } else {
                setErrorMessage('Failed to update password. Please try again.');
            }
        } catch (error) {
            // If the error contains a response with a custom error message, display it
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error); // Display the backend error message
            } else {
                setErrorMessage('Error resetting password. Please try again later.');
            }
            console.error('Error updating password:', error);
        }
    };
    
    
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

                {/* Success or error messages */}
                {message && !errorMessage && <div className="bg-green-500 text-white p-4 rounded mb-4">{message}</div>}
                {errorMessage && <div className="bg-red-500 text-white p-4 rounded mb-4">{errorMessage}</div>}

                <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePassword;

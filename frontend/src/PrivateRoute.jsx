import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null initially means checking, false means not authenticated

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await Axios.get('http://localhost:9004/api/user', { withCredentials: true });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Authentication error:', error);
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // or some other loading indicator
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

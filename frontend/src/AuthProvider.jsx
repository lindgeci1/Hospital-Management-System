import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showSessionExpired, setShowSessionExpired] = useState(false);
    const navigate = useNavigate();
    let refreshTimeout = null;
    let logoutTimeout = null;

    const checkUserAuthentication = async () => {
        try {
            // console.log("🔍 Checking user authentication...");
            const userResponse = await Axios.get('http://localhost:9004/api/user', { withCredentials: true });

            if (userResponse.status === 200) {
                console.log("✅ User is authenticated.");
                setIsLoggedIn(true);
            }
        } catch (error) {
            // console.error("❌ User is not authenticated:", error);
            setIsLoggedIn(false);
        }
    };

    const fetchTokenExpirationAndScheduleTasks = async () => {
        if (!isLoggedIn) return;

        try {
            console.log("📡 Fetching token expiration...");
            const { data } = await Axios.get('http://localhost:9004/api/token-expiration', { withCredentials: true });

            console.log(`🕒 JWT expires in: ${data.jwtTimeRemaining} seconds`);
            console.log(`🔄 Refresh token expires in: ${data.refreshTokenTimeRemaining} seconds`);

            // **Logout immediately if refresh token is already expired**
            if (data.refreshTokenTimeRemaining <= 0) {
                console.warn("❌ Refresh token expired. Logging out immediately...");
                handleLogout();
                return;
            }

            // **Schedule token refresh**
            scheduleTokenRefresh(data.jwtTimeRemaining);

            // **Schedule forced logout 5 seconds before refresh token expires**
            scheduleAutoLogout(data.refreshTokenTimeRemaining);

        } catch (error) {
            console.error("🚨 Error fetching token expiration:", error);
            handleLogout();
        }
    };

    const refreshAuthToken = async () => {
        if (!isLoggedIn) return;

        try {
            console.log("🔄 Refreshing JWT token...");
            const response = await Axios.post('http://localhost:9004/api/refresh', {}, { withCredentials: true });

            console.log("✅ Token refreshed successfully");

            // **Extract refresh token expiration time**
            const refreshTokenTimeRemaining = response.data?.refreshTokenTimeRemaining ?? null;
            console.log(`🔄 Refresh token expires in: ${refreshTokenTimeRemaining} seconds`);

            // **If refresh token expired, log out**
            if (refreshTokenTimeRemaining <= 0) {
                console.warn("❌ Refresh token expired. Logging out...");
                handleLogout();
                return;
            }

            // **Re-fetch token expiration after refresh**
            fetchTokenExpirationAndScheduleTasks();

        } catch (error) {
            console.error("🚨 Error refreshing token:", error);

            // If refresh token is missing/expired, log out
            if (error.response && error.response.status === 400) {
                console.warn("❌ Refresh token missing or expired. Logging out...");
                handleLogout();
                return;
            }

            handleLogout();
        }
    };

    const scheduleTokenRefresh = (jwtTimeRemaining) => {
        if (refreshTimeout) clearTimeout(refreshTimeout);

        const refreshTime = Math.max((jwtTimeRemaining - 10) * 1000, 0);
        console.log(`📅 Scheduled token refresh in ${refreshTime / 1000} seconds.`);
        refreshTimeout = setTimeout(refreshAuthToken, refreshTime);
    };

    const scheduleAutoLogout = (refreshTokenTimeRemaining) => {
        if (logoutTimeout) clearTimeout(logoutTimeout);

        const logoutTime = Math.max((refreshTokenTimeRemaining-1) * 1000, 0);
        console.log(`📅 Scheduled auto logout in ${logoutTime / 1000} seconds.`);
        logoutTimeout = setTimeout(() => {
            console.warn("⏳ Auto logout triggered before refresh token expiry...");
            handleLogout();
        }, logoutTime);
    };

    const handleLogout = () => {
        console.log("🚪 Logging out due to expired refresh token...");
        setShowSessionExpired(true);
        setIsLoggedIn(false);

        // **Clear timeouts to prevent further checks**
        if (refreshTimeout) clearTimeout(refreshTimeout);
        if (logoutTimeout) clearTimeout(logoutTimeout);
        navigate('/logout');
        setTimeout(() => {
            setShowSessionExpired(false);
        }, 1500);
    };

    useEffect(() => {
        checkUserAuthentication();
    }, []);
    useEffect(() => {
        if (isLoggedIn) {
            fetchTokenExpirationAndScheduleTasks();
        }
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn }}>
            {showSessionExpired && (
                <div style={{ 
                    position: 'absolute', 
                    top: '20%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    zIndex: 1000, 
                    background: 'red', 
                    padding: '20px', 
                    borderRadius: '10px', 
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                    color: 'white' 
                }}>
                    Session expired. Logging out...
                </div>
            )}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

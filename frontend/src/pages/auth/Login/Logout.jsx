import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {

      try {
        const response = await Axios.post("http://localhost:9004/api/logout", {}, { withCredentials: true });
      } catch (error) {
        console.error("Error logging out:", error);
      }

        navigate('/login');
        window.location.reload();
    };

    // Call the function (previously named incorrectly)
    handleLogout();
  }, [navigate]);

  return null;
};

export default Logout;

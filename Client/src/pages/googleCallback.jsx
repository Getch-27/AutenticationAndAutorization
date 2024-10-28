import React, { useEffect } from 'react';
import { useToken } from '../context/TokenContext'; // Make sure you have your AuthContext set up
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
    const { token, setToken } = useToken();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code'); // Extract the code from URL

    if (code) {
      // Make a request to your backend to exchange the code for an access token
      axios
        .post('http://localhost:3000/api/auth/google/callback', { code }) // Ensure this endpoint is set up in your backend
        .then(response => {
          const { accessToken } = response.data; // Access token from backend response
          handleLogin(accessToken); // Store access token in context
          navigate('/profile'); // Redirect to profile page
        })
        .catch(error => {
          console.error("Login failed", error);
          // Handle error (optional, e.g., display an alert)
        });
    }
  }, [location, handleLogin, navigate]);

  return <div>Loading...</div>; // Show loading while processing
};

export default GoogleCallback;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../context/TokenContext';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const { token, setToken } = useToken();
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users/profile', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        console.log(response);
        
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Token might be expired, handle refresh here
          const refreshToken = localStorage.getItem('refreshToken'); // Assuming refresh token is still in localStorage
          if (refreshToken) {
            try {
              const tokenResponse = await axios.post('http://localhost:3000/api/auth/refreshToken', { refreshToken });
              setToken(tokenResponse.data.accessToken); // Update the token in the context
              fetchProfile(); // Retry with the new token
            } catch (refreshError) {
              console.error('Token refresh failed', refreshError);
              navigate("/login");
            }
          } else {
            navigate("/login");
          }
        } else {
          console.error('Profile fetch failed', error);
        }
      }
    };

    fetchProfile();
  }, [token, setToken, navigate]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {userData.username}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
};

export default Profile;

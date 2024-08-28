import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToken } from "../context/TokenContext";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const { token, setToken } = useToken();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem("refreshToken");
  
          if (refreshToken) {
            try {
              const tokenResponse = await axios.post(
                "http://localhost:3000/api/auth/refreshToken",
                { refreshToken }
              );
  
              // Ensure the new token is set before retrying the fetchProfile call
              setToken(tokenResponse.data.accessToken);
              console.log(tokenResponse.data.accessToken);
  
              // Retry fetching the profile with the new token
              const newResponse = await axios.get(
                "http://localhost:3000/api/users/profile",
                {
                  headers: {
                    authorization: `Bearer ${tokenResponse.data.accessToken}`,
                  },
                }
              );
              setUserData(newResponse.data);
            } catch (refreshError) {
              console.error("Token refresh failed", refreshError);
              navigate("/login");
            }
          } else {
            navigate("/login");
          }
        } else {
          console.error("Profile fetch failed", error);
        }
      }
    };
  
    fetchProfile();
  }, [token, navigate]); // 'token' and 'navigate' as dependencies
  
  
  return (!userData) ? <p>Unauthorized</p> :
 

  
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Profile
        </h1>

        <div className="space-y-6">
          <p className="text-xl text-gray-700">
            <span className="font-semibold text-gray-900">Username:</span>{" "}
            {userData.username}
          </p>
          <p className="text-xl text-gray-700">
            <span className="font-semibold text-gray-900">Email:</span>{" "}
            {userData.email}
          </p>
        </div>
      </div>
    </div>
};

export default Profile;

  

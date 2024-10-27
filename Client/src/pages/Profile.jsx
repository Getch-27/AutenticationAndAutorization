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
        const response = await axios.get("http://localhost:3000/api/users/profile", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          await handleRefreshToken();
        } else {
          console.error("Profile fetch failed", error);
        }
      }
    };

    const handleRefreshToken = async () => {
      try {
       const tokenResponse = await axios.post(
            "http://localhost:3000/api/auth/refreshToken",
            {},
            { withCredentials: true } // This sends cookies with the request
        );

        // Set the new access token in context
        setToken(tokenResponse.data.accessToken);

        // Retry fetching the profile with the new access token
        fetchProfileWithNewToken(tokenResponse.data.accessToken);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        navigate("/login");
      }
    };

    const fetchProfileWithNewToken = async (newAccessToken) => {
      try {
        const newResponse = await axios.get("http://localhost:3000/api/users/profile", {
          headers: {
            authorization: `Bearer ${newAccessToken}`,
          },
        });
        setUserData(newResponse.data);
      } catch (error) {
        console.error("Profile fetch failed after refreshing token", error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [token, setToken, navigate]);

  return userData ? (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Profile</h1>

        <div className="space-y-6">
          <p className="text-xl text-gray-700">
            <span className="font-semibold text-gray-900">Username:</span> {userData.username}
          </p>
          <p className="text-xl text-gray-700">
            <span className="font-semibold text-gray-900">Email:</span> {userData.email}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <p>Unauthorized</p>
  );
};

export default Profile;

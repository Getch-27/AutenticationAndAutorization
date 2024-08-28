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
        if (error.response && error.response.status === 401) {
          // handle token expiration error
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            try {
              const tokenResponse = await axios.post(
                "http://localhost:3000/api/auth/refreshToken",
                { refreshToken }
              );
              setToken(tokenResponse.data.accessToken); // Update the token in the context
              fetchProfile(); // Retry with the new token
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
  }, [token, setToken, navigate]);

  if (!userData) {
    return <p>Unautorized</p>;
  }

  return (
    <div class="flex items-center justify-center min-h-screen ">
      <div class="max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">
          Profile
        </h1>

        <div class="space-y-6">
          <p class="text-xl text-gray-700">
            <span class="font-semibold text-gray-900">Username:</span>{" "}
            {userData.username}
          </p>
          <p class="text-xl text-gray-700">
            <span class="font-semibold text-gray-900">Email:</span>{" "}
            {userData.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

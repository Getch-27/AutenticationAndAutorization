import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useToken } from "../context/TokenContext"; //


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useToken();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    axios.defaults.withCredentials = true;
    e.preventDefault();
    try {
      const response = await axios.post("https://autentication-server.vercel.app/api/auth/login", {
        username,
        password,
      });

      const accessToken = response.data.accessToken;
      setToken(accessToken); // Set the access token in context
      navigate("/profile"); // Redirect to profile page
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed: " + (error.response?.data.message || "Unknown error"));
    }
  };

  const handleGoogleSignIn = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; 
    const redirectUri = "https://autentication-server.vercel.app/api/auth/google/callback";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid email profile`;

    // Redirect to Google for authentication
    window.location.href = googleAuthUrl;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>

      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Login
      </button>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full mt-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        LOG in with Google
      </button>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}

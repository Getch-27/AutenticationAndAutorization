import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/auth/signup", formData);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Signup failed. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    const googleClientId = "639193218184-d7k3tn0iisg0c3hprfhqj382ra0jgl4f.apps.googleusercontent.com"; // Replace with your Google Client ID
    const redirectUri = "http://localhost:3000/api/auth/google/callback";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid email profile`;

    window.location.href = googleAuthUrl; // Redirect user to Google for authentication
  };

  return (
    <div className="flex items-center justify-center max-w-md mx-auto mt-10 p-6">
      <form onSubmit={handleSubmit} className="w-96 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>

        {error && (
          <div className="mb-4 p-2 text-red-600 bg-red-100 border border-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Sign Up
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full mt-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign up with Google
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;

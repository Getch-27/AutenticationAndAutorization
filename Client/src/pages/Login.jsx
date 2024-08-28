import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToken } from "../context/TokenContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useToken();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { username, password }
      );
      const accessToken = response.data.accessToken;
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setToken(accessToken);
      navigate("/profile");
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
    >
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>

      <div class="mb-4">
        <label
          htmlFor="username"
          class="block text-gray-700 text-sm font-semibold mb-2"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="mb-6">
        <label
          htmlFor="password"
          class="block text-gray-700 text-sm font-semibold mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login
      </button>

      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" class="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
}

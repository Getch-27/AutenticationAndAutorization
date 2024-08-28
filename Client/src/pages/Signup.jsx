import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/signup', { username, password, email });
      navigate('/login');
    } catch (error) {
      console.error('Signup failed', error);
      alert('Signup failed');
    }
  };

  return (
    <div class="flex items-center justify-center max-w-md mx-auto mt-10 p-6 ">
    <form onSubmit={handleSubmit} class=" w-96 p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Signup</h1>
      
      <div class="mb-4">
        <label htmlFor="username" class="block text-gray-700 text-sm font-semibold mb-2">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      <div class="mb-4">
        <label htmlFor="email" class="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      <div class="mb-6">
        <label htmlFor="password" class="block text-gray-700 text-sm font-semibold mb-2">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      <button
        type="submit"
        class="w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Signup
      </button>
      
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">Already have an account? <a href="/login" class="text-green-500 hover:underline">Login</a></p>
      </div>
    </form>
  </div>
  
  );
};

export default Signup;

"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {

        localStorage.setItem("token", data.token);

        router.push('/home');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-green-100 to-green-200">
      {/* Left Side - Logo */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center">
        <motion.img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a1f019f7c26ef2aaf00a3e32ef7f3eb972e91e2e9cdbe126d517a742ee5a8233?placeholderIfAbsent=true&apiKey=be7d969155c74017b8611192d433b602"
          alt="Logo"
          className="w-3/4 md:w-2/3 lg:w-1/2 h-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Welcome Back!</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <motion.div
              className="mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-green-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-green-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg transition duration-300"
                required
              />
            </motion.div>
            <motion.div
              className="mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-green-700" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-green-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg transition duration-300"
                required
              />
            </motion.div>
            <motion.button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300"
              whileHover={{ scale: 1.05, backgroundColor: "#38a169" }}
              transition={{ duration: 0.3 }}
            >
              Log In
            </motion.button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-green-600 hover:text-green-700 font-semibold">
              Sign up
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

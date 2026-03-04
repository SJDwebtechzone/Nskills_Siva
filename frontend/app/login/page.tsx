"use client";

import { useState } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";

export default function Login(): JSX.Element {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  // 🔹 Email Validation
  const validateEmail = (value: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleLogin = async (): Promise<void> => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");
    setServerError("");

    // Required checks
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) return;

    try {
      setLoading(true);

      const res = await axios.post<{ token: string }>(
        "http://localhost:5000/api/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");

    } catch (error) {
      setServerError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/30">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>
          <p className="text-white/80 mt-2 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-white mb-2 text-sm">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 transition
            ${emailError ? "ring-2 ring-red-400" : "focus:ring-white"}`}
            placeholder="Enter your email"
          />
          {emailError && (
            <p className="text-red-300 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-white mb-2 text-sm">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 transition
            ${passwordError ? "ring-2 ring-red-400" : "focus:ring-white"}`}
            placeholder="Enter your password"
          />
          {passwordError && (
            <p className="text-red-300 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-4 text-center text-red-300 text-sm">
            {serverError}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition duration-300 shadow-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}
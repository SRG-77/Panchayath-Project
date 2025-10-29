import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MemberLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Logging in member:", formData);

      // ✅ API call (correct backend route)
      const res = await axios.post("http://localhost:5000/member/login", formData);

      // ✅ Check if token is returned
      if (!res.data.token) {
        alert("Login failed: No token returned from server");
        return;
      }

      // ✅ Save token separately for member
      localStorage.setItem("memberToken", res.data.token);

      console.log("Member logged in successfully!");
      navigate("/member-dashboard"); // ✅ Redirect after successful login
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300 px-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-sky-200">
          <h2 className="text-3xl font-extrabold text-center text-sky-700 mb-8">
            Member Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-sky-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-sky-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 text-white font-bold bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 rounded-xl shadow-lg transition-transform transform hover:scale-105"
            >
              Login
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MemberLogin;

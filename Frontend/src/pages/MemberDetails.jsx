import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function MemberProfile() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/member", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If API returns an array, pick the first one
        setMember(Array.isArray(data) ? data[0] : data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch member details");
        setLoading(false);
      }
    };

    fetchMember();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading member details...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!member)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No member found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border-t-8 border-blue-600"
      >
        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="w-28 h-28 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-md mb-3">
            {member.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{member.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Panchayath Member</p>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 mb-6" />

        {/* Member Info Section */}
        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">📧 Email:</span>
            <span>{member.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">📞 Phone:</span>
            <span>{member.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">🏠 Ward No:</span>
            <span>{member.wardNo}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">📅 Term Period:</span>
            <span>
              {member.startYear} - {member.endYear}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🌿 Panchayath Member Profile</p>
          <p className="text-xs mt-1">© {new Date().getFullYear()} Local Governance Portal</p>
        </div>
      </motion.div>
    </div>
  );
}

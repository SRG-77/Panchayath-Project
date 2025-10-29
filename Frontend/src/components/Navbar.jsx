import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          Panchayath Connect
        </Link>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition"
          >
            User Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

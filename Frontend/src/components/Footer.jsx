import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-20">
      <div className="text-center text-gray-600">
        &copy; {new Date().getFullYear()} Panchayath Connect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

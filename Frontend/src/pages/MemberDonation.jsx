import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import axios from "axios";

export default function MemberDonation() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // ✅ Fetch donations from backend
  const fetchDonations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/donationpost");
      setDonations(res.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // ✅ Handle Delete
  // ✅ Handle Delete
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this donation post?"
  );
  if (!confirmDelete) return;

  try {
    // Get the member token from localStorage
    const token = localStorage.getItem("memberToken");
    if (!token) {
      alert("You are not authorized. Please login first.");
      return;
    }

    // Send DELETE request with Authorization header
    await axios.delete(`http://localhost:5000/donationpost/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Remove deleted post from state
    setDonations((prev) => prev.filter((post) => post._id !== id));
    alert("Donation post deleted successfully!");
  } catch (error) {
    console.error("Error deleting post:", error);
    if (error.response && error.response.status === 401) {
      alert("Unauthorized! Please login again.");
    } else {
      alert("Failed to delete post. Please try again.");
    }
  }
};


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-teal-50 p-10">
      {/* Header / Quote */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-3">
          “Be the reason someone smiles today.”
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Every small act of kindness can bring hope, joy, and change to someone's life.
        </p>
      </motion.div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"
          ></motion.div>
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center text-gray-600 mt-20 text-lg">
          No donation posts yet. Be the first to create one!
        </div>
      ) : (
        <div className="flex flex-col gap-10 max-w-4xl mx-auto">
          {donations.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div
                className="cursor-pointer bg-gray-100 flex justify-center items-center"
                onClick={() => setSelectedImage(post.image)}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="max-h-[500px] w-full object-contain transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-3xl font-semibold text-blue-700 mb-2">
                  {post.title}
                </h2>

                {/* Amount Required */}
                {post.goalAmount && (
                  <p className="text-green-700 font-semibold text-lg mb-3">
                    Amount Required: ₹{post.goalAmount.toLocaleString()}
                  </p>
                )}

                <p className="text-gray-700 text-lg mb-5 leading-relaxed">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-auto">
                  {/* Donate Button */}
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 0px 10px rgba(0, 150, 100, 0.6)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-green-600 text-white font-medium py-2 px-6 rounded-xl hover:bg-green-700 transition-colors"
                    onClick={() =>
                      navigate("/member-dashboard/donations/payment-options")
                    }
                  >
                    DONATE
                  </motion.button>

                  {/* Edit Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      navigate(`/member-dashboard/donations/edit/${post._id}`)
                    }
                    className="bg-blue-500 text-white py-2 px-5 rounded-xl hover:bg-blue-600 flex items-center gap-2 transition-colors"
                  >
                    <Pencil size={18} />
                    Edit
                  </motion.button>

                  {/* Delete Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 text-white py-2 px-5 rounded-xl hover:bg-red-600 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={18} />
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/member-dashboard/donations/create")}
        className="fixed bottom-10 right-10 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-colors"
        title="Add New Post"
      >
        <Plus size={28} />
      </motion.button>

      {/* Image Popup */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Preview"
                className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain bg-white"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
              >
                <X size={24} className="text-gray-800" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

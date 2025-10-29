import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function EditDonation() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    image: null,
    previewImage: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch existing donation post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/donationpost/${id}`);
        const post = res.data;
        setFormData({
          title: post.title,
          description: post.description,
          goalAmount: post.goalAmount,
          image: null,
          previewImage: post.image,
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Failed to load donation post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image file
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
      previewImage: file ? URL.createObjectURL(file) : prev.previewImage,
    }));
  };

  // ✅ Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("goalAmount", formData.goalAmount);
    if (formData.image) data.append("image", formData.image);

    try {
         const token = localStorage.getItem("memberToken"); 
      await axios.put(`http://localhost:5000/donationpost/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
         },
         
      });
      alert("Donation post updated successfully!");
      navigate("/member-dashboard/donations");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update donation post.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-teal-50 flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/member-dashboard/donations")}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-blue-700">
            Edit Donation Post
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
            ></textarea>
          </div>

          {/* Amount Required */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Amount Required (₹)
            </label>
            <input
              type="number"
              name="goalAmount"
              value={formData.goalAmount}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-xl px-4 py-2 cursor-pointer"
            />
            {formData.previewImage && (
              <img
                src={formData.previewImage}
                alt="Preview"
                className="mt-3 rounded-xl max-h-60 object-contain mx-auto border"
              />
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

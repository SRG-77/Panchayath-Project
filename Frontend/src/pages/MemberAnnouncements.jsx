import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/notice";

export default function NoticeBoard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]); // store multiple files
  const [previewUrls, setPreviewUrls] = useState([]); // store preview URLs
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle file selection
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);

    // Generate preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

    const token = localStorage.getItem("memberToken");
    if (!token) {
      toast.error("You must be logged in to post");
      navigate("/login");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", description);
    media.forEach((file) => formData.append("media", file)); // append multiple files

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(API_URL, formData, config);
      toast.success(response.data.message || "Post created successfully");

      // Clear form and previews
      setTitle("");
      setDescription("");
      setMedia([]);
      setPreviewUrls([]);

      // Instant navigation to announcements
      navigate("/member-announcements", { state: { success: true } });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("memberToken");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-sky-200 flex items-center justify-center py-8">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 w-max">
            Choose Files
            <input
              type="file"
              onChange={handleMediaChange}
              className="hidden"
              multiple
            />
          </label>

          {/* Preview selected images */}
          {previewUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {previewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`preview ${idx}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Image } from "lucide-react";

const API_URL = "http://localhost:5000/userPost";

export default function AddReportPage() {
  const navigate = useNavigate();
  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    media: [],
  });
  const [previewUrls, setPreviewUrls] = useState([]);

  const categories = [
    "Education", "Roads", "Agriculture", "Waste", "Electricity", "Water"]

  const handleAddReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", newReport.title);
      formData.append("description", newReport.description);
      formData.append("category", newReport.category);
      formData.append("location", newReport.location);
      newReport.media.forEach((file) => formData.append("media", file));

      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/dashboard/report");
    } catch (err) {
      console.error(err);
      alert("Failed to add report. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewReport({ ...newReport, media: files });

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removePreview = (index) => {
    const updatedFiles = [...newReport.media];
    const updatedUrls = [...previewUrls];

    updatedFiles.splice(index, 1);
    updatedUrls.splice(index, 1);

    setNewReport({ ...newReport, media: updatedFiles });
    setPreviewUrls(updatedUrls);
  };

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen bg-gray-50">
      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Cancel Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <X size={20} /> Cancel
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create Report</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={newReport.title}
          onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
          className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 w-full mb-4 transition"
        />

        {/* Description */}
        <textarea
          placeholder="Describe the issue..."
          value={newReport.description}
          onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
          className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 w-full mb-4 resize-none transition h-28"
        />

        {/* Category */}
        <select
          value={newReport.category}
          onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
          className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 w-full mb-4 transition"
        >
          <option value="">Select Category</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          value={newReport.location}
          onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
          className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 w-full mb-4 transition"
        />

        {/* Media Upload */}
        <label className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
          <Image size={18} /> Upload Media
        </label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4 cursor-pointer transition"
        />

        {/* Preview Section */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {previewUrls.map((url, idx) =>
              url.match(/\.(mp4|webm|ogg)$/i) ? (
                <div key={idx} className="relative w-full h-24 rounded-lg overflow-hidden shadow-md">
                  <video
                    src={url}
                    controls
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removePreview(idx)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 hover:bg-red-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div key={idx} className="relative w-full h-24 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={url}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removePreview(idx)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 hover:bg-red-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {/* Post Button */}
        <button
          onClick={handleAddReport}
          className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg w-full hover:bg-blue-700 transition"
        >
          Post Report
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Image } from "lucide-react";

const API_URL = "http://localhost:5000/userPost";
const LOCATION_API = "http://localhost:5000/registration/available-user-locations";

export default function AddReportPage() {
  const navigate = useNavigate();
  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    category: "",
    district: "",
    panchayath: "",
    wardNo: "",
    media: [],
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [panchayaths, setPanchayaths] = useState([]);
  const [wards, setWards] = useState([]);

  const categories = [
    "Education", "Roads", "Agriculture", "Waste", "Electricity", "Water"
  ];

  // ✅ Fetch all districts (same as Register page)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(LOCATION_API);
        setDistricts(data.districts || []);
      } catch (err) {
        console.error("Error loading districts:", err);
        setDistricts([]);
      }
    })();
  }, []);

  // ✅ Fetch Panchayaths based on District
  useEffect(() => {
    if (!newReport.district) {
      setPanchayaths([]);
      setWards([]);
      return;
    }
    (async () => {
      try {
        const { data } = await axios.get(LOCATION_API, {
          params: { district: newReport.district },
        });
        setPanchayaths(data.panchayaths || []);
      } catch (err) {
        console.error("Error loading panchayaths:", err);
        setPanchayaths([]);
      }
    })();
  }, [newReport.district]);

  // ✅ Fetch Wards based on Panchayath
  useEffect(() => {
    if (!newReport.district || !newReport.panchayath) {
      setWards([]);
      return;
    }
    (async () => {
      try {
        const { data } = await axios.get(LOCATION_API, {
          params: { district: newReport.district, panchayath: newReport.panchayath },
        });
        setWards(data.wardNos || []);
      } catch (err) {
        console.error("Error loading wards:", err);
        setWards([]);
      }
    })();
  }, [newReport.panchayath]);

  // ✅ Handle report submission
  const handleAddReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", newReport.title);
      formData.append("description", newReport.description);
      formData.append("category", newReport.category);
      formData.append("district", newReport.district);
      formData.append("panchayath", newReport.panchayath);
      formData.append("wardNo", newReport.wardNo);
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

  // ✅ Handle media upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewReport({ ...newReport, media: files });

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
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        />

        {/* Description */}
        <textarea
          placeholder="Describe the issue..."
          value={newReport.description}
          onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 resize-none h-28 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        />

        {/* Category */}
        <select
          value={newReport.category}
          onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        >
          <option value="">Select Category</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        {/* District */}
        <select
          value={newReport.district}
          onChange={(e) => setNewReport({ ...newReport, district: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        >
          <option value="">Select District</option>
          {districts.map((dist, i) => (
            <option key={i} value={dist}>{dist}</option>
          ))}
        </select>

        {/* Panchayath */}
        <select
          value={newReport.panchayath}
          onChange={(e) => setNewReport({ ...newReport, panchayath: e.target.value })}
          disabled={!newReport.district}
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:bg-gray-100"
        >
          <option value="">Select Panchayath</option>
          {panchayaths.map((pan, i) => (
            <option key={i} value={pan}>{pan}</option>
          ))}
        </select>

        {/* Ward No */}
        <select
          value={newReport.wardNo}
          onChange={(e) => setNewReport({ ...newReport, wardNo: e.target.value })}
          disabled={!newReport.panchayath}
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:bg-gray-100"
        >
          <option value="">Select Ward No</option>
          {wards.map((ward, i) => (
            <option key={i} value={ward}>{ward}</option>
          ))}
        </select>

        {/* Media Upload */}
        <label className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
          <Image size={18} /> Upload Media
        </label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4 cursor-pointer"
        />

        {/* Preview */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative w-full h-24 rounded-lg overflow-hidden shadow-md">
                {url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={url} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                )}
                <button
                  onClick={() => removePreview(idx)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 hover:bg-red-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
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

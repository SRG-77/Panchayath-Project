import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function EditReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    district: "",
    panchayath: "",
    wardNo: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API_URL}/userPost/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(data);
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          district: data.district,
          panchayath: data.panchayath,
          wardNo: data.wardNo,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to fetch report");
      }
    };
    fetchReport();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/userPost/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Report updated successfully!");
      navigate("/dashboard/report");
    } catch (err) {
      console.error(err);
      alert("Failed to update report");
    }
  };

  if (!report) return <p className="p-4 text-center">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Report</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="border rounded-lg p-2"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border rounded-lg p-2 h-24"
          required
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="border rounded-lg p-2"
          required
        />
        <input
          name="district"
          value={formData.district}
          onChange={handleChange}
          placeholder="District"
          className="border rounded-lg p-2"
          required
        />
        <input
          name="panchayath"
          value={formData.panchayath}
          onChange={handleChange}
          placeholder="Panchayath"
          className="border rounded-lg p-2"
          required
        />
        <input
          name="wardNo"
          value={formData.wardNo}
          onChange={handleChange}
          placeholder="Ward No"
          className="border rounded-lg p-2"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

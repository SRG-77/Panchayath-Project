import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThumbsUp, ThumbsDown, MessageCircle, X } from "lucide-react";

const API_URL = "http://localhost:5000/notice";

export default function MemberAnnouncements() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupImage, setPopupImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (location.state?.success) {
      toast.success("Post added successfully!");
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Like
  const handleLike = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/like`, {}, config);
      fetchPosts(); // refresh posts to show updated counts
    } catch (error) {
      console.error("Failed to like post:", error);
      toast.error("Failed to like post");
    }
  };

  // Toggle Dislike
  const handleDislike = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/dislike`, {}, config);
      fetchPosts(); // refresh posts to show updated counts
    } catch (error) {
      console.error("Failed to dislike post:", error);
      toast.error("Failed to dislike post");
    }
  };

  const handleComment = (id) => toast.info(`Comment clicked for post ${id}`);
  const handleClick = () => navigate("/member-announcements");

  // Check if current user has liked/disliked
  const userId = localStorage.getItem("userId"); // make sure you store userId in localStorage on login

  return (
    <div className="min-h-screen bg-sky-100 relative py-6 px-4 overflow-x-hidden">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">
        Announcements
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No announcements yet.</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {posts.map((post) => {
            const liked = post.likes?.includes(userId);
            const disliked = post.dislikes?.includes(userId);

            return (
              <div
                key={post._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 w-full max-w-md overflow-hidden"
              >
                <h2 className="text-lg font-semibold mb-2 text-blue-700">
                  {post.title}
                </h2>
                <p className="text-gray-700 mb-2 break-words">{post.content}</p>

                {/* Media Section */}
                {post.media && post.media.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {post.media.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Post ${idx}`}
                        className="w-full rounded-md object-cover max-h-80 cursor-pointer hover:opacity-90 transition"
                        onClick={() => setPopupImage(url)}
                      />
                    ))}
                  </div>
                )}

                {/* Like/Dislike buttons */}
                <div className="flex items-center justify-around mt-3 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1 ${
                      liked ? "text-blue-700" : "text-blue-500 hover:text-blue-600"
                    } transition`}
                  >
                    <ThumbsUp size={20} />
                    <span>Like ({post.likes?.length || 0})</span>
                  </button>
                  <button
                    onClick={() => handleDislike(post._id)}
                    className={`flex items-center gap-1 ${
                      disliked ? "text-red-700" : "text-red-500 hover:text-red-600"
                    } transition`}
                  >
                    <ThumbsDown size={20} />
                    <span>Dislike ({post.dislikes?.length || 0})</span>
                  </button>
                  <button
                    onClick={() => handleComment(post._id)}
                    className="flex items-center gap-1 text-green-500 hover:text-green-600 transition"
                  >
                    <MessageCircle size={20} /> <span>Comment</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating '+' Button */}
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 bg-blue-500 text-white text-3xl font-bold w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition"
      >
        +
      </button>

      {/* Image Popup */}
      {popupImage && (
        <div
          className="fixed inset-0 bg-sky-200/90 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setPopupImage(null)}
        >
          <div className="relative">
            <img
              src={popupImage}
              alt="Popup"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl border-4 border-white"
            />
            <button
              onClick={() => setPopupImage(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200 transition"
            >
              <X size={24} className="text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

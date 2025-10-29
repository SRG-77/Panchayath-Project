import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Trash2,
  Send,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/notice";
const COMMENT_API = "http://localhost:5000/noticecomment";

export default function UserAnnouncementsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupImage, setPopupImage] = useState(null);
  const [openComments, setOpenComments] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const commentRefs = useRef({});

  // Fetch all announcements
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (location.state?.success) {
      toast.success("Post added successfully!");
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error.response?.data || error.message);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  // Like / Dislike Post
  const handleLike = async (post) => {
    try {
      const isLiked = post.likes?.includes(userId);
      await axios.put(`${API_URL}/${post._id}/like`, {}, config);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: isLiked
                  ? p.likes.filter((id) => id !== userId)
                  : [...(p.likes || []), userId],
                dislikes: isLiked
                  ? p.dislikes
                  : p.dislikes?.filter((id) => id !== userId) || [],
              }
            : p
        )
      );
    } catch (error) {
      console.error("Like post error:", error.response?.data || error.message);
      toast.error("Failed to like post");
    }
  };

  const handleDislike = async (post) => {
    try {
      const isDisliked = post.dislikes?.includes(userId);
      await axios.put(`${API_URL}/${post._id}/dislike`, {}, config);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id
            ? {
                ...p,
                dislikes: isDisliked
                  ? p.dislikes.filter((id) => id !== userId)
                  : [...(p.dislikes || []), userId],
                likes: isDisliked
                  ? p.likes
                  : p.likes?.filter((id) => id !== userId) || [],
              }
            : p
        )
      );
    } catch (error) {
      console.error("Dislike post error:", error.response?.data || error.message);
      toast.error("Failed to dislike post");
    }
  };

  // Toggle comments section
  const toggleComments = async (post) => {
    if (openComments === post._id) {
      setOpenComments(null);
      return;
    }

    setOpenComments(post._id);
    try {
      const res = await axios.get(`${COMMENT_API}/${post._id}`, config);
      setComments((prev) => ({ ...prev, [post._id]: res.data }));
    } catch (error) {
      console.error("Load comments error:", error.response?.data || error.message);
      toast.error("Failed to load comments");
    }
  };

  // Add comment
  const handleAddComment = async (postId) => {
    if (!newComment[postId]?.trim()) return;
    try {
      const res = await axios.post(
        COMMENT_API,
        { text: newComment[postId], NoticeId: postId },
        config
      );
      setComments((prev) => ({
        ...prev,
        [postId]: [res.data.comment, ...(prev[postId] || [])],
      }));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));

      // Scroll to newly added comment
      setTimeout(() => {
        commentRefs.current[postId]?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Add comment error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  // Like comment
  const handleLikeComment = async (postId, commentId) => {
    try {
      await axios.patch(`${COMMENT_API}/${commentId}/like`, {}, config);
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((c) =>
          c._id === commentId
            ? {
                ...c,
                likes: c.likes.includes(userId)
                  ? c.likes.filter((id) => id !== userId)
                  : [...c.likes, userId],
              }
            : c
        ),
      }));
    } catch (error) {
      console.error("Like comment error:", error.response?.data || error.message);
      toast.error("Failed to like comment");
    }
  };

  // Delete comment
  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(`${COMMENT_API}/${commentId}`, config);
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c._id !== commentId),
      }));
    } catch (error) {
      console.error("Delete comment error:", error.response?.data || error.message);
      toast.error("Failed to delete comment");
    }
  };

  const handleClick = () => navigate("/member-announcements");

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
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 w-full max-w-md"
              >
                <h2 className="text-lg font-semibold mb-2 text-blue-700">
                  {post.title}
                </h2>
                <p className="text-gray-700 mb-2 break-words">{post.content}</p>

                {post.media?.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {post.media.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Post ${idx}`}
                        className="w-full rounded-md object-cover max-h-80 cursor-pointer hover:opacity-90"
                        onClick={() => setPopupImage(url)}
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-around mt-3 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleLike(post)}
                    className={`flex items-center gap-1 ${
                      liked ? "text-blue-700" : "text-blue-500 hover:text-blue-600"
                    }`}
                  >
                    <ThumbsUp size={20} />
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => handleDislike(post)}
                    className={`flex items-center gap-1 ${
                      disliked ? "text-red-700" : "text-red-500 hover:text-red-600"
                    }`}
                  >
                    <ThumbsDown size={20} />
                    <span>{post.dislikes?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post)}
                    className="flex items-center gap-1 text-green-500 hover:text-green-600"
                  >
                    <MessageCircle size={20} />
                    <span>Comments</span>
                  </button>
                </div>

                {openComments === post._id && (
                  <div className="mt-4 border-t pt-3">
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newComment[post._id] || ""}
                        onChange={(e) =>
                          setNewComment((prev) => ({
                            ...prev,
                            [post._id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-blue-400"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post._id);
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                      >
                        <Send size={16} />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2">
                      {comments[post._id]?.length > 0 ? (
                        comments[post._id].map((c) => (
                          <div
                            key={c._id}
                            ref={(el) => (commentRefs.current[post._id] = el)}
                            className="border border-gray-200 p-2 rounded-md flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {c.createdBy?.name || "User"}
                              </p>
                              <p className="text-gray-600 text-sm">{c.text}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                              <button
                                onClick={() =>
                                  handleLikeComment(post._id, c._id)
                                }
                                className={`flex items-center gap-1 ${
                                  c.likes.includes(userId)
                                    ? "text-blue-600"
                                    : "text-gray-500 hover:text-blue-600"
                                }`}
                              >
                                <ThumbsUp size={14} />
                                <span>{c.likes.length}</span>
                              </button>
                              {c.createdBy?._id === userId && (
                                <button
                                  onClick={() =>
                                    handleDeleteComment(post._id, c._id)
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-center">
                          No comments yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

     

      {/* Image Popup */}
      {popupImage && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
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
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

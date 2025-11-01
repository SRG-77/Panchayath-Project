import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, ThumbsUp, ThumbsDown, MessageCircle, MapPin, Calendar, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";
const LOCATION_API = "http://localhost:5000/registration/available-user-locations";

/* ================================
   🧩 Recursive Comment Component
================================== */
function Comment({ comment, handleLikeComment, handleAddReply }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const userId = localStorage.getItem("userId");

  return (
    <div className="ml-10 mt-3 border-l border-gray-200 pl-4">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm text-gray-800">
          {comment.createdBy?.name || "Anonymous"}
        </span>
        <button
          onClick={() => handleLikeComment(comment._id)}
          className={`text-xs flex items-center gap-1 ${
            comment.likes?.some((id) => id.toString() === userId)
              ? "text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          👍 {comment.likes?.length || 0}
        </button>
      </div>

      <p className="text-sm text-gray-700">{comment.text}</p>

      <button
        onClick={() => setShowReplyBox(!showReplyBox)}
        className="text-xs text-gray-500 mt-1 hover:text-blue-600"
      >
        Reply
      </button>

      {showReplyBox && (
        <div className="flex gap-2 mt-2 ml-4">
          <input
            className="border rounded-lg p-2 flex-1 text-xs"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            onClick={() => {
              if (replyText.trim()) handleAddReply(comment._id, replyText);
              setReplyText("");
              setShowReplyBox(false);
            }}
            className="bg-blue-500 px-3 rounded-lg text-xs text-white hover:bg-blue-600"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
}

/* ================================
   🧩 Comment Box
================================== */
function CommentBox({ postId, handleAddComment }) {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-2 mt-3">
      <input
        className="border border-gray-300 rounded-lg p-3 flex-1 text-sm"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          if (text.trim()) handleAddComment(postId, text);
          setText("");
        }}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium"
      >
        Post
      </button>
    </div>
  );
}

/* ================================
   🧩 Main ReportProblems Component
================================== */
export default function ReportProblems() {
  const [posts, setPosts] = useState([]);
  const [openCommentPost, setOpenCommentPost] = useState(null);
  const [filter, setFilter] = useState("all");

  const [districts, setDistricts] = useState([]);
  const [panchayaths, setPanchayaths] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPanchayath, setSelectedPanchayath] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Media popup states
  const [showMediaPopup, setShowMediaPopup] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isVideo, setIsVideo] = useState(false);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  /* ================================
     📥 Fetch posts
  ================================== */
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API_URL}/userPost`);
        setPosts(res.data.reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  /* ================================
     🌍 Fetch location filters
  ================================== */
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const { data } = await axios.get(LOCATION_API);
        setDistricts(data.districts || []);
      } catch (err) {
        console.error("Error loading districts:", err);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (!selectedDistrict) return setPanchayaths([]);
    const fetchPanchayaths = async () => {
      const { data } = await axios.get(LOCATION_API, {
        params: { district: selectedDistrict },
      });
      setPanchayaths(data.panchayaths || []);
    };
    fetchPanchayaths();
  }, [selectedDistrict]);

  useEffect(() => {
    if (!selectedDistrict || !selectedPanchayath) return setWards([]);
    const fetchWards = async () => {
      const { data } = await axios.get(LOCATION_API, {
        params: { district: selectedDistrict, panchayath: selectedPanchayath },
      });
      setWards(data.wardNos || []);
    };
    fetchWards();
  }, [selectedPanchayath]);

  /* ================================
     💬 Like / Dislike / Upvote / Comments / Reply
  ================================== */
  const handlePostLikeDislike = async (postId, type) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/userPost/${postId}/${type}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedPost = res.data.updatedPost;
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? updatedPost : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/userPost/${postId}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedPost = res.data.updatedPost;
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? updatedPost : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId, text) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/postcomment`,
        { issueId: postId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newComment = res.data.comment;
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/postcomment/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedComment = res.data.updatedComment;
      setPosts((prev) =>
        prev.map((p) => ({
          ...p,
          comments: p.comments.map((c) =>
            c._id === commentId ? updatedComment : c
          ),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReply = async (commentId, replyText) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/postcomment/${commentId}/reply`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedComment = res.data.updatedComment;
      setPosts((prev) =>
        prev.map((p) => ({
          ...p,
          comments: p.comments.map((c) =>
            c._id === commentId ? updatedComment : c
          ),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================================
     🗑️ Delete report handler
  ================================== */
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/userPost/${postToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postToDelete));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
    } finally {
      setShowDeletePopup(false);
      setPostToDelete(null);
    }
  };

  /* ================================
     🧮 Filter Logic
  ================================== */
  const filteredPosts = posts
    .filter((p) => {
      const matchDistrict = !selectedDistrict || p.district === selectedDistrict;
      const matchPanchayath =
        !selectedPanchayath || p.panchayath === selectedPanchayath;
      const matchWard =
        !selectedWard || String(p.wardNo) === String(selectedWard);
      if (filter === "all" || filter === "latest")
        return matchDistrict && matchPanchayath && matchWard;
      if (filter === "pending")
        return matchDistrict && matchPanchayath && matchWard && p.status === "Pending";
      if (filter === "solved")
        return matchDistrict && matchPanchayath && matchWard && p.status === "Solved";
      return true;
    })
    .sort((a, b) => {
      if (filter === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (filter === "all")
        return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
      return 0;
    });

  /* ================================
     🖥️ JSX UI
  ================================== */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Community Reports</h1>
          <p className="text-gray-500 text-sm">Stay informed about local issues and help make a difference</p>
        </div>

        {/* Location Filters Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-blue-600" size={18} />
            <h2 className="text-base font-semibold text-gray-900">Filter by Location</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedPanchayath("");
                setSelectedWard("");
              }}
              className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Districts</option>
              {districts.map((dist, i) => (
                <option key={i} value={dist}>{dist}</option>
              ))}
            </select>

            <select
              value={selectedPanchayath}
              onChange={(e) => {
                setSelectedPanchayath(e.target.value);
                setSelectedWard("");
              }}
              disabled={!selectedDistrict}
              className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 bg-white disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Panchayaths</option>
              {panchayaths.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={!selectedPanchayath}
              className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 bg-white disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Wards</option>
              {wards.map((w, i) => (
                <option key={i} value={w}>Ward {w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Most Upvoted
          </button>
          <button
            onClick={() => setFilter("latest")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "latest"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "pending"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("solved")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "solved"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Solved
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Post Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-base">
                        {post.createdBy?.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {post.createdBy?.name || "User"}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {post.createdBy?._id === userId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/report/edit/${post._id}`)}
                          className="text-blue-600 text-xs hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setPostToDelete(post._id);
                            setShowDeletePopup(true);
                          }}
                          className="text-red-600 text-xs hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.category && (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                        <Tag size={12} />
                        {post.category}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">
                      <MapPin size={12} />
                      {post.district} • {post.panchayath} • Ward {post.wardNo}
                    </span>
                    {post.status && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                        post.status === "Solved" 
                          ? "bg-green-50 text-green-700" 
                          : "bg-yellow-50 text-yellow-700"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
                        {post.status}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">{post.description}</p>
                </div>

                {/* Media */}
                {post.media?.length > 0 && (
                  <div className="px-4 pb-3 flex flex-col gap-2">
                    {post.media.map((url, idx) =>
                      url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          key={idx}
                          src={url}
                          controls
                          onClick={() => {
                            setSelectedMedia(url);
                            setIsVideo(true);
                            setShowMediaPopup(true);
                          }}
                          className="w-full max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition"
                        />
                      ) : (
                        <img
                          key={idx}
                          src={url}
                          alt="Report media"
                          onClick={() => {
                            setSelectedMedia(url);
                            setIsVideo(false);
                            setShowMediaPopup(true);
                          }}
                          className="w-full max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition"
                        />
                      )
                    )}
                  </div>
                )}

                {/* Actions Bar */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => handlePostLikeDislike(post._id, "like")}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.likes?.includes(userId)
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      <ThumbsUp size={18} />
                      <span className="font-medium text-sm">{post.likes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => handlePostLikeDislike(post._id, "dislike")}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.dislikes?.includes(userId)
                          ? "text-red-600"
                          : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <ThumbsDown size={18} />
                      <span className="font-medium text-sm">{post.dislikes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() =>
                        setOpenCommentPost(
                          openCommentPost === post._id ? null : post._id
                        )
                      }
                      className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <MessageCircle size={18} />
                      <span className="font-medium text-sm">{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleUpvote(post._id)}
                    className={`flex items-center gap-1.5 px-4 py-2 border-2 rounded-lg text-sm font-semibold transition-all ${
                      post.upvotes?.includes(userId)
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    <span>↑</span>
                    <span>UPVOTE {post.upvotes?.length || 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {openCommentPost === post._id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50">
                    <CommentBox
                      postId={post._id}
                      handleAddComment={handleAddComment}
                    />
                    <div className="mt-4 space-y-3">
                      {post.comments?.map((comment) => (
                        <Comment
                          key={comment._id}
                          comment={comment}
                          handleLikeComment={handleLikeComment}
                          handleAddReply={handleAddReply}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No reports found.</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this report? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeletePost}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeletePopup(false);
                    setPostToDelete(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Popup */}
        {showMediaPopup && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMediaPopup(false)}
          >
            <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                onClick={() => setShowMediaPopup(false)}
                className="absolute top-4 right-4 bg-white hover:bg-gray-200 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition z-10"
              >
                ×
              </button>
              {isVideo ? (
                <video
                  src={selectedMedia}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img
                  src={selectedMedia}
                  alt="Full view"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => navigate("/dashboard/report/add-report")}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
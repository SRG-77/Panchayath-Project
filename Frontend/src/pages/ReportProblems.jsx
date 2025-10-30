import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000"; // ✅ Change if needed
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
            className="border rounded-full p-2 flex-1 text-xs"
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
            className="bg-blue-100 px-3 rounded-full text-xs text-blue-600 hover:bg-blue-200"
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
        className="border rounded-full p-2 flex-1 text-sm"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          if (text.trim()) handleAddComment(postId, text);
          setText("");
        }}
        className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600"
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

  // 🗑️ Delete popup states
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

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
    <div className="p-4 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      {/* Location Filters */}
      <div className="flex flex-col gap-3 mb-4">
        <select
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedPanchayath("");
            setSelectedWard("");
          }}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="">Select District</option>
          {districts.map((dist, i) => (
            <option key={i} value={dist}>
              {dist}
            </option>
          ))}
        </select>

        <select
          value={selectedPanchayath}
          onChange={(e) => {
            setSelectedPanchayath(e.target.value);
            setSelectedWard("");
          }}
          disabled={!selectedDistrict}
          className="border border-gray-300 rounded-lg p-2 disabled:bg-gray-100"
        >
          <option value="">Select Panchayath</option>
          {panchayaths.map((p, i) => (
            <option key={i} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          disabled={!selectedPanchayath}
          className="border border-gray-300 rounded-lg p-2 disabled:bg-gray-100"
        >
          <option value="">Select Ward No</option>
          {wards.map((w, i) => (
            <option key={i} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["all", "latest", "pending", "solved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-10 mt-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                    {post.createdBy?.name?.[0] || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {post.createdBy?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Edit/Delete buttons */}
                {post.createdBy?._id === userId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/report/edit/${post._id}`)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setPostToDelete(post._id);
                        setShowDeletePopup(true);
                      }}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {post.title}
              </h3>

              <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
                {post.category && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    🏷️ {post.category}
                  </span>
                )}
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">
                  📍 {post.district} / {post.panchayath} / Ward {post.wardNo}
                </span>
                {post.status && (
                  <span className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded-full">
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-3">{post.description}</p>

              {post.media?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.media.map((url, idx) =>
                    url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        key={idx}
                        src={url}
                        controls
                        className="w-full max-h-64 rounded-lg object-cover"
                      />
                    ) : (
                      <img
                        key={idx}
                        src={url}
                        alt="media"
                        className="w-full max-h-64 rounded-lg object-cover"
                      />
                    )
                  )}
                </div>
              )}

              <div className="flex items-center justify-between border-t pt-3 text-gray-600">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handlePostLikeDislike(post._id, "like")}
                    className={`flex items-center gap-1 ${
                      post.likes?.includes(userId)
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <ThumbsUp size={18} /> {post.likes?.length || 0}
                  </button>

                  <button
                    onClick={() => handlePostLikeDislike(post._id, "dislike")}
                    className={`flex items-center gap-1 ${
                      post.dislikes?.includes(userId)
                        ? "text-red-600"
                        : "text-gray-600 hover:text-red-600"
                    }`}
                  >
                    <ThumbsDown size={18} /> {post.dislikes?.length || 0}
                  </button>

                  <button
                    onClick={() =>
                      setOpenCommentPost(
                        openCommentPost === post._id ? null : post._id
                      )
                    }
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <MessageCircle size={18} /> {post.comments?.length || 0}
                  </button>
                </div>

                <button
                  onClick={() => handleUpvote(post._id)}
                  className={`flex items-center justify-center gap-2 px-4 py-1.5 border border-blue-600 rounded-full text-blue-600 text-sm font-medium hover:bg-blue-600 hover:text-white transition ${
                    post.upvotes?.includes(userId)
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                >
                  UPVOTE {post.upvotes?.length || 0}
                </button>
              </div>

              {openCommentPost === post._id && (
                <div className="mt-4">
                  <CommentBox
                    postId={post._id}
                    handleAddComment={handleAddComment}
                  />
                  <div className="mt-3">
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
          <p className="text-gray-600 text-center">No reports found.</p>
        )}
      </div>

     {/* 🗑️ Delete Confirmation Popup */}
{showDeletePopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-6 w-80 text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Confirm Delete
      </h3>
      <p className="text-gray-600 mb-5">
        Are you sure you want to delete this report? This action cannot be undone.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleDeletePost}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Delete
        </button>
        <button
          onClick={() => {
            setShowDeletePopup(false);
            setPostToDelete(null);
          }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

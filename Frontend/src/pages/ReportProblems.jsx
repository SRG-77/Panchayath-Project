import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, ThumbsUp, ThumbsDown, MessageCircle, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

/* Recursive Comment Component */
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

      {comment.replies?.map((reply) => (
        <div key={reply._id} className="ml-6 mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm text-gray-800">
              {reply.createdBy?.name || "Anonymous"}
            </span>
            <button
              onClick={() => handleAddReply(comment._id, reply._id, "like")}
              className={`text-xs flex items-center gap-1 ${
                reply.likes?.some((id) => id.toString() === userId)
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              👍 {reply.likes?.length || 0}
            </button>
          </div>
          <p className="text-sm text-gray-700">{reply.text}</p>
        </div>
      ))}
    </div>
  );
}

/* Comment Input */
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

export default function ReportProblems() {
  const [posts, setPosts] = useState([]);
  const [openCommentPost, setOpenCommentPost] = useState(null);
  const [filter, setFilter] = useState("all");

  const categories = [
    "Road Damage",
    "Waste Management",
    "Street Light Issue",
    "Water Supply",
    "Public Safety",
    "Other",
  ];

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

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
        prev.map((post) => (post._id === postId ? updatedPost : post))
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
        prev.map((post) => (post._id === postId ? updatedPost : post))
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
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
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
        prev.map((post) => ({
          ...post,
          comments: post.comments.map((c) =>
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
        prev.map((post) => ({
          ...post,
          comments: post.comments.map((c) =>
            c._id === commentId ? updatedComment : c
          ),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts
    .filter((post) => {
      if (filter === "all" || filter === "latest") return true;
      if (filter === "pending") return post.status === "Pending";
      if (filter === "solved") return post.status === "Solved";
      return true;
    })
    .sort((a, b) => {
      if (filter === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (filter === "all") return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
      return 0;
    });

  return (
    <div className="p-4 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["all", "latest", "pending", "solved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="flex flex-col gap-10 mt-6">
        {filteredPosts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                  {post.createdBy?.name?.[0] || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{post.createdBy?.name || "User"}</p>
                  <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>

            {/* Category & Location */}
            <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
              {post.category && (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">🏷️ {post.category}</span>
              )}
              {post.location && (
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">📍 {post.location}</span>
              )}
              {post.status && (
                <span className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded-full">
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-3">{post.description}</p>

            {/* Media */}
            {post.media?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.media.map((url, idx) =>
                  url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video key={idx} src={url} controls className="w-full max-h-64 rounded-lg object-cover" />
                  ) : (
                    <img key={idx} src={url} alt="media" className="w-full max-h-64 rounded-lg object-cover" />
                  )
                )}
              </div>
            )}

            {/* Like / Dislike / Comment / Upvote Bar */}
            <div className="flex items-center justify-between border-t pt-3 text-gray-600">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handlePostLikeDislike(post._id, "like")}
                  className={`flex items-center gap-1 ${
                    post.likes?.some((id) => id.toString() === userId)
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <ThumbsUp size={18} /> {post.likes?.length || 0}
                </button>

                <button
                  onClick={() => handlePostLikeDislike(post._id, "dislike")}
                  className={`flex items-center gap-1 ${
                    post.dislikes?.some((id) => id.toString() === userId)
                      ? "text-red-600"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  <ThumbsDown size={18} /> {post.dislikes?.length || 0}
                </button>

                <button
                  onClick={() =>
                    setOpenCommentPost(openCommentPost === post._id ? null : post._id)
                  }
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <MessageCircle size={18} /> {post.comments?.length || 0}
                </button>
              </div>

              {/* UPVOTE Button */}
              <button
                onClick={() => handleUpvote(post._id)}
                className={`flex items-center justify-center gap-2 px-4 py-1.5 border border-blue-600 rounded-full text-blue-600 text-sm font-medium hover:bg-blue-600 hover:text-white transition ${
                  post.upvotes?.some((id) => id.toString() === userId)
                    ? "bg-blue-600 text-white"
                    : ""
                }`}
              >
                UPVOTE {post.upvotes?.length || 0}
              </button>
            </div>

            {/* Comments Section */}
            {openCommentPost === post._id && (
              <div className="mt-3 border-t pt-3">
                {post.comments?.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    handleLikeComment={handleLikeComment}
                    handleAddReply={handleAddReply}
                  />
                ))}
                <CommentBox postId={post._id} handleAddComment={handleAddComment} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating + Button to navigate to AddReportPost page */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-700"
        onClick={() => navigate("/dashboard/report/add-report")}
      >
        <Plus size={26} />
      </button>
    </div>
  );
}

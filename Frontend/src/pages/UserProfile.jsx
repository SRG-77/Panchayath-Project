import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Comment({ comment, handleLikeComment }) {
  const userId = localStorage.getItem("userId");

  return (
    <div className="ml-6 mt-3 border-l border-gray-200 pl-4">
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
    </div>
  );
}

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

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

 useEffect(() => {
  const fetchUserAndPosts = async () => {
    try {
      const userId = localStorage.getItem("userId");

      // 1️⃣ Fetch user data
      const userRes = await axios.get(`${API_URL}/registration/${userId}`, config);
      const userData = userRes.data;
      setUser(userData);

      // 2️⃣ Fetch user's posts
      const postsRes = await axios.get(`${API_URL}/userPost/user/${userId}`, config);
      setPosts(postsRes.data.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchUserAndPosts();
}, []);

  const handlePostLikeDislike = async (postId, type) => {
    try {
      const res = await axios.patch(
        `${API_URL}/userPost/${postId}/${type}`,
        {},
        config
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
      const res = await axios.post(
        `${API_URL}/noticecomment`,
        { text, NoticeId: postId },
        config
      );
      const newComment = res.data.comment;
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [newComment, ...(post.comments || [])] }
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await axios.patch(`${API_URL}/noticecomment/${commentId}/like`, {}, config);
      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          comments: post.comments.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  likes: c.likes.includes(userId)
                    ? c.likes.filter((id) => id !== userId)
                    : [...c.likes, userId],
                }
              : c
          ),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">User not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 p-8 flex flex-col items-center">
      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl border-t-8 border-green-600 mb-8"
      >
        <div className="text-center mb-6">
          <div className="w-28 h-28 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-md mb-3">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-sm text-gray-500 mt-1">User Profile</p>
          <p className="text-gray-600 mt-1">📧 {user.email}</p>
        </div>
      </motion.div>

      {/* Posts */}
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">You haven't posted anything yet.</p>
        ) : (
          posts.map((post) => {
            const commentsOpen = openCommentsPostId === post._id;
            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{post.title}</h3>
                  <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
                </div>

                <p className="text-gray-700 mb-2">{post.description}</p>

                {post.media?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.media.map((url, idx) =>
                      url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video key={idx} src={url} controls className="w-full max-h-64 rounded-lg object-cover" />
                      ) : (
                        <img key={idx} src={url} alt="media" className="w-full max-h-64 rounded-lg object-cover" />
                      )
                    )}
                  </div>
                )}

                {/* Likes / Dislikes / Comments Toggle */}
                <div className="flex gap-4 mb-2">
                  <button
                    onClick={() => handlePostLikeDislike(post._id, "like")}
                    className={`flex items-center gap-1 ${
                      post.likes?.includes(userId) ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    👍 {post.likes?.length || 0}
                  </button>
                  <button
                    onClick={() => handlePostLikeDislike(post._id, "dislike")}
                    className={`flex items-center gap-1 ${
                      post.dislikes?.includes(userId) ? "text-red-600" : "text-gray-600 hover:text-red-600"
                    }`}
                  >
                    👎 {post.dislikes?.length || 0}
                  </button>
                  <button
                    onClick={() => setOpenCommentsPostId(commentsOpen ? null : post._id)}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <MessageCircle size={18} /> {post.comments?.length || 0}
                  </button>
                </div>

                {/* Expandable Comments */}
                {commentsOpen && (
                  <div className="mt-2 border-t pt-2">
                    {post.comments?.map((comment) => (
                      <Comment key={comment._id} comment={comment} handleLikeComment={handleLikeComment} />
                    ))}
                    <CommentBox postId={post._id} handleAddComment={handleAddComment} />
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      <button
        className="fixed bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-700"
        onClick={() => navigate("/dashboard/report/add-report")}
      >
        <Plus size={26} />
      </button>
    </div>
  );
}

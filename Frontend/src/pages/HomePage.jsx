import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  ClipboardList,
  Users,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const features = [
    {
      title: "Problem Reporting",
      description:
        "Report local issues like road damage, water shortage, or waste problems easily with photos, videos, and GPS support.",
      icon: <Megaphone className="w-12 h-12 text-green-600" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Solution Tracking",
      description:
        "Stay updated on progress: Pending → In Progress → Solved. Receive real-time status updates and notifications.",
      icon: <ClipboardList className="w-12 h-12 text-green-600" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Discussion Forum",
      description:
        "Join open conversations about village issues. Share suggestions, ideas, and feedback directly with members.",
      icon: <MessageSquare className="w-12 h-12 text-green-600" />,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Transparency",
      description:
        "Access public dashboards showing top issues and resolutions. Stay informed with official notices and updates.",
      icon: <ShieldCheck className="w-12 h-12 text-green-600" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Engagement",
      description:
        "Upvote urgent issues, participate in polls, and provide service feedback to improve community engagement.",
      icon: <Users className="w-12 h-12 text-green-600" />,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Analytics",
      description:
        "Visualize development trends and issue statistics. Data-driven insights help the Panchayath prioritize better.",
      icon: <BarChart3 className="w-12 h-12 text-green-600" />,
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
    },
  ];

  const benefits = [
    "Real-time issue tracking",
    "Transparent governance",
    "Community-driven solutions",
    "24/7 accessible platform",
  ];

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.7, ease: "easeOut" },
    }),
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-24 px-6">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="w-4 h-4" />
              Empowering Communities
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Welcome to{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Panchayath Connect
                </span>
                <svg
                  className="absolute bottom-0 left-0 w-full h-4 -z-0"
                  viewBox="0 0 400 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 0,20 Q 100,0 200,20 T 400,20"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    className="opacity-30"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#16a34a" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-4">
              Empowering citizens and Panchayath members to collaborate, report
              issues, and track progress
            </p>
            <p className="text-lg text-gray-500 mb-10">
              Together for a better community
            </p>

            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={() => navigate("/login")}
                className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold text-lg hover:scale-105"
              >
                Report an Issue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleLoginClick}
                className="group px-8 py-4 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all duration-300 flex items-center gap-2 font-semibold text-lg hover:scale-105"
              >
                User Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Benefits */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section on green gradient background */}
        <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-emerald-600">
          <motion.div
            className="max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              className="text-center mb-16"
              variants={fadeUp}
              custom={0}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-green-50 max-w-2xl mx-auto">
                Everything you need to stay connected with your community
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  variants={fadeUp}
                  custom={index}
                >
                  <div className="relative h-full bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-green-500 transition-all duration-300 shadow-md hover:shadow-2xl transform hover:-translate-y-2">
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                    
                    {/* Icon container */}
                    <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        
      </main>

      {/* Floating Member Login Button (mobile view) */}
      <motion.button
        onClick={handleLoginClick}
        className="fixed bottom-6 right-6 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 sm:hidden z-50 flex items-center gap-2 font-semibold hover:scale-110"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Users className="w-5 h-5" />
        User Login
      </motion.button>

      {/* Member Login CTA at the bottom */}
      <section className="py-12 px-6 bg-white">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-gray-600 font-medium mb-6">
            Are you the Member? then login here
          </p>
          <button
            onClick={() => navigate("/member-login")}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all duration-300 font-semibold"
          >
            Member Login
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
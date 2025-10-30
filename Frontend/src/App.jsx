import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Register from "./pages/UserRegistration";
import Login from "./pages/UserLogin";
import MemberLogin from "./pages/MemberLogin";
import DashboardLayout from "./pages/DashboardLayout";
import MemberDashboard from "./pages/MemberDashboard";
import ReportProblems from "./pages/ReportProblems";
import MemberReportPage from "./pages/MemberReportPage";
import MemberAnnouncementsPage from "./pages/MemberAnnouncementPage";
import MemberAnnouncements from "./pages/MemberAnnouncements"; // The page with '+'
import UserAnnouncementsPage from"./pages/UserAnnouncementPage"
import MemberDonation from"./pages/MemberDonation"
import PaymentOptions from"./pages/PaymentOptions"
import AddDonationPost from"./pages/AddDonationPost"
import EditDonation from"./pages/EditDonation"
import UserDonationPost from "./pages/UserDonationPost"
import UserDonationPayment from "./pages/UserDonationPayment"
import MemberProfile from "./pages/MemberDetails"
import UserProfile from "./pages/UserProfile"
import AddReport from "./pages/AddReportPage"
import EditReport from "./pages/EditReport"

import MemberProtectedRoute from "./pages/MemberProtectedRoute";

// ✅ ProtectedRoute for general users
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/member-login" element={<MemberLogin />} />
      

        {/* General Dashboard (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="report" replace />} />
          <Route path="report" element={<ReportProblems />} />
          <Route path="announcements" element={<UserAnnouncementsPage />} /> 
          <Route path="donationspage" element={<UserDonationPost/>}/>
          <Route path="donationspage/paymentpage" element = {<UserDonationPayment/>}/>
          <Route path="memberprofile" element = {<MemberProfile/>}/>
          <Route path="userprofile" element = {<UserProfile/>}/>
          <Route path="report/add-report" element = {<AddReport/>}/>
          <Route path="/dashboard/report/edit/:id" element={<EditReport />} />

          
         
        </Route>

        {/* Member Dashboard (Protected) */}
        <Route
          path="/member-dashboard"
          element={
            <MemberProtectedRoute>
              <MemberDashboard tokenKey="memberToken" />
            </MemberProtectedRoute>
          }
        >
          <Route index element={<Navigate to="report" replace />} />
          <Route path="report" element={<MemberReportPage />} />
          {/* NoticeBoard page */}
          <Route path="announcements" element={<MemberAnnouncementsPage />} />
           <Route path = "donations" element={<MemberDonation/>}/>
           <Route path = "donations/payment-options" element={<PaymentOptions/>}/>
           <Route path = "donations/create" element = {<AddDonationPost/>}/>
           <Route path = "donations/edit/:id" element = {<EditDonation/>}/>
        </Route>

        {/* MemberAnnouncements page (with '+') */}
        <Route
          path="/member-announcements"
          element={
            <MemberProtectedRoute>
              <MemberAnnouncements />
            </MemberProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

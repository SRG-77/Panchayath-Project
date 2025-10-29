import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Megaphone,
  DollarSign,
  Users,
  Cpu,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useEffect } from "react";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    navigate("/login"); // redirect
  };

  const menuItems = [
    { name: "Report Problems", icon: <Home size={18} />, path: "/dashboard/report" },
    { name: "Announce Events", icon: <Megaphone size={18} />, path: "/dashboard/announcements" },
    { name: "Donations", icon: <DollarSign size={18} />, path: "/dashboard/donationspage" },
    { name: "Member Details", icon: <Users size={18} />, path: "/dashboard/memberprofile" },
    // { name: "AI Analysis", icon: <Cpu size={18} />, path: "/dashboard/ai-analysis" },
    { name: "Profile", icon: <User size={18} />, path: "/dashboard/userprofile" },
    { name: "Settings", icon: <Settings size={18} />, path: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-50 p-4 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-blue-700">Dashboard</h2>
        <nav className="flex flex-col gap-4 text-gray-700">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-2 p-1 rounded hover:text-blue-600 ${
                location.pathname === item.path ? "text-blue-600 font-medium" : ""
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 mt-auto"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* This is where child routes (pages) will render */}
      </main>
    </div>
  );
}

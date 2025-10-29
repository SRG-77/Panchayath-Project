import { useState } from "react";
import { Home, Megaphone, DollarSign, Users, Cpu, User, Settings, LogOut } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Latest");

  const tabs = ["Latest", "High Priority", "Pending", "Solved"];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-50 p-4 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-blue-700">Dashboard</h2>
        <nav className="flex flex-col gap-4 text-gray-700">
          <button className="flex items-center gap-2 hover:text-blue-600"><Home size={18}/> Report Problems</button>
          <button className="flex items-center gap-2 hover:text-blue-600"><Megaphone size={18}/> Announce Events</button>
          <button className="flex items-center gap-2 hover:text-blue-600"><DollarSign size={18}/> Donations</button>
          <button className="flex items-center gap-2 hover:text-blue-600"><Users size={18}/> Member Details</button>
          <button className="flex items-center gap-2 hover:text-blue-600"><Cpu size={18}/> AI Analysis</button>
          <button className="flex items-center gap-2 hover:text-blue-600"><User size={18}/> Profile</button>
          <button className="flex items-center gap-2 hover:text-blue-600"><Settings size={18}/> Settings</button>
          <button className="flex items-center gap-2 text-red-500 hover:text-red-700 mt-auto"><LogOut size={18}/> Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Feed Card */}
        <div className="bg-white shadow rounded-2xl p-4 w-full max-w-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Morgan Gurereo</span>
            <span className="text-xs text-gray-400">Aug 29</span>
          </div>
          <div className="h-32 bg-gray-100 rounded mb-2"></div>
          <div className="text-blue-600 font-medium">#taggggsssss</div>
          <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet...</p>
        </div>
      </main>
    </div>
  );
}

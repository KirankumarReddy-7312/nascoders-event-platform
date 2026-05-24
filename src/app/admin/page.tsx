"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Calendar, LayoutDashboard, Settings, LogOut, 
  Search, Edit3, Trash2, User as UserIcon, MapPin, 
  Clock, CheckCircle2, AlertCircle, X, ChevronRight, Activity, Mail, Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [adminUser, setAdminUser] = useState<any>(null);
  
  // State for Admin Data
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // Modals
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState<any>({});
  
  const [showEditBookingModal, setShowEditBookingModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState<any>({});

  useEffect(() => {
    // Check Admin auth
    const sessionStr = localStorage.getItem("euphoria_session");
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session.role !== "admin") {
        router.push("/profile");
      } else {
        setAdminUser(session);
      }
    } else {
      router.push("/login");
    }

    // Initialize real data from localStorage
    if (typeof window !== "undefined") {
      const allUsers = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("activeBookings_")) {
          const emailOrPhone = key.replace("activeBookings_", "");
          try {
            const bookingsStr = localStorage.getItem(key);
            const bookings = bookingsStr ? JSON.parse(bookingsStr) : [];
            
            // Generate a user object based on the bookings
            // Normally this comes from a database, but we will reconstruct it here
            if (bookings.length > 0) {
              const latestBooking = bookings[bookings.length - 1];
              allUsers.push({
                id: emailOrPhone,
                name: latestBooking.yourName || emailOrPhone,
                email: latestBooking.contactEmail || emailOrPhone,
                phone: latestBooking.contactPhone || "Not Provided",
                vipStatus: "Standard",
                joined: new Date(latestBooking.bookingTimestamp || Date.now()).toLocaleDateString("en-US"),
                bookings: bookings.map((b: any) => ({
                  id: b.id,
                  occasion: b.occasion,
                  status: new Date(`${b.targetDate}T${b.targetTime || "00:00"}`).getTime() > Date.now() ? "Active" : "Completed",
                  targetDate: b.targetDate,
                  venue: b.city + " / " + b.venueAddress,
                  total: b.priceDetails?.total || 0
                }))
              });
            }
          } catch (e) {
            console.error("Error parsing bookings for key", key);
          }
        }
      }
      setUsers(allUsers);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("euphoria_session");
    router.push("/login");
  };

  // --- USER ACTIONS ---
  const handleRemoveUser = (userId: string) => {
    if (confirm("Are you sure you want to completely remove this user?")) {
      setUsers(users.filter(u => u.id !== userId));
      if (selectedUser?.id === userId) setSelectedUser(null);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editUserData.id ? editUserData : u));
    if (selectedUser?.id === editUserData.id) setSelectedUser(editUserData);
    setShowEditUserModal(false);
  };

  // --- BOOKING ACTIONS ---
  const handleRemoveBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel and remove this booking?")) {
      const updatedUsers = users.map(u => ({
        ...u,
        bookings: u.bookings.filter((b: any) => b.id !== bookingId)
      }));
      setUsers(updatedUsers);
      
      // Update selected user view if active
      if (selectedUser) {
        setSelectedUser(updatedUsers.find(u => u.id === selectedUser.id));
      }
    }
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUsers = users.map(u => ({
      ...u,
      bookings: u.bookings.map((b: any) => b.id === editBookingData.id ? editBookingData : b)
    }));
    setUsers(updatedUsers);
    
    if (selectedUser) {
      setSelectedUser(updatedUsers.find(u => u.id === selectedUser.id));
    }
    setShowEditBookingModal(false);
  };


  if (!adminUser) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-stone-900 text-stone-300 flex flex-col shrink-0 fixed inset-y-0 z-10">
        <div className="p-6">
          <h2 className="text-xl font-serif text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-stone-900 flex items-center justify-center font-bold text-sm">EQ</span>
            Admin Portal
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 text-sm font-medium">
          <button 
            onClick={() => { setActiveTab("overview"); setSelectedUser(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "overview" && !selectedUser ? "bg-amber-500/10 text-amber-500" : "hover:bg-stone-800 hover:text-white"}`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" /> Dashboard Overview
          </button>
          <button 
            onClick={() => { setActiveTab("users"); setSelectedUser(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${(activeTab === "users" || selectedUser) ? "bg-amber-500/10 text-amber-500" : "hover:bg-stone-800 hover:text-white"}`}
          >
            <Users className="w-4.5 h-4.5" /> User Management
          </button>
        </nav>
        
        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-800 hover:bg-red-900/50 hover:text-red-400 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Secure Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 ml-64 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif text-stone-800">
              {selectedUser ? "User Profile Management" : activeTab === "users" ? "User Directory" : "Platform Overview"}
            </h1>
            <p className="text-stone-500 mt-1">
              {selectedUser ? `Viewing detailed activity for ${selectedUser.name}` : "Manage and monitor Euphoria operations"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input type="text" placeholder="Global search..." className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 w-64 shadow-sm" />
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-200 border-2 border-white shadow-sm flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-stone-500" />
            </div>
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {!selectedUser && activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2.5xl border border-stone-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><Users className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm text-stone-500 font-medium">Total Registered Users</p>
                  <p className="text-3xl font-serif text-stone-800 mt-1">{users.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2.5xl border border-stone-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Activity className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm text-stone-500 font-medium">Active Celebrations</p>
                  <p className="text-3xl font-serif text-stone-800 mt-1">{users.reduce((acc, u) => acc + u.bookings.filter((b:any)=>b.status==='Active').length, 0)}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2.5xl border border-stone-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm text-stone-500 font-medium">Monthly Revenue Limit</p>
                  <p className="text-3xl font-serif text-stone-800 mt-1">₹4.2M</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS DIRECTORY TAB */}
        {!selectedUser && activeTab === "users" && (
          <div className="bg-white border border-stone-100 rounded-2.5xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50/80 text-stone-500 border-b border-stone-100 font-medium uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">User Info</th>
                  <th className="px-6 py-4">VIP Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Total Bookings</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-stone-50/50 transition-colors cursor-pointer" onClick={() => setSelectedUser(u)}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-800">{u.name}</div>
                      <div className="text-stone-500 text-xs mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                        ${u.vipStatus === 'Gold' ? 'bg-amber-100 text-amber-800' : 
                          u.vipStatus === 'Platinum' ? 'bg-indigo-100 text-indigo-800' : 
                          'bg-stone-100 text-stone-800'}`}>
                        {u.vipStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-600">{u.joined}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-semibold text-stone-700">{u.bookings.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => { setEditUserData(u); setShowEditUserModal(true); }}
                        className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleRemoveUser(u.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* DETAILED USER PROFILE VIEW */}
        {selectedUser && (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedUser(null)}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-800 text-sm font-medium mb-2 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center"><ChevronRight className="w-4 h-4 rotate-180" /></div>
              Back to User Directory
            </button>
            
            <div className="bg-white border border-stone-100 rounded-2.5xl shadow-sm p-8 flex justify-between items-start">
              <div className="flex gap-6 items-center">
                <div className="w-20 h-20 rounded-full bg-stone-100 border-4 border-white shadow flex items-center justify-center text-2xl font-serif text-stone-400">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-3">
                    {selectedUser.name}
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-stone-100 text-stone-600 border border-stone-200">
                      {selectedUser.vipStatus} VIP
                    </span>
                  </h2>
                  <div className="flex gap-4 mt-2 text-sm text-stone-500">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {selectedUser.email}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {selectedUser.phone}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => { setEditUserData(selectedUser); setShowEditUserModal(true); }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            </div>

            <h3 className="text-xl font-serif text-stone-800 mt-8 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" /> Event Activity & Bookings
            </h3>
            
            <div className="grid gap-4">
              {selectedUser.bookings.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-2xl border border-dashed border-stone-200 text-stone-400 text-sm">
                  No event activity recorded for this user.
                </div>
              ) : (
                selectedUser.bookings.map((booking: any) => (
                  <div key={booking.id} className="bg-white border border-stone-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:border-amber-200 transition-colors">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        {booking.status === "Active" ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> ACTIVE
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                            COMPLETED
                          </span>
                        )}
                        <h4 className="text-lg font-bold text-stone-800">{booking.occasion}</h4>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs font-medium text-stone-500">
                        <span className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded"><Calendar className="w-3.5 h-3.5 text-amber-600" /> {booking.targetDate}</span>
                        <span className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded"><MapPin className="w-3.5 h-3.5 text-amber-600" /> {booking.venue}</span>
                        <span className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded font-mono text-stone-700">₹{booking.total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setEditBookingData(booking); setShowEditBookingModal(true); }}
                        className="px-4 py-2 border border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-stone-600 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" /> Edit Event
                      </button>
                      <button 
                        onClick={() => handleRemoveBooking(booking.id)}
                        className="p-2 border border-stone-200 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 text-stone-400 rounded-xl transition-colors"
                        title="Cancel & Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showEditUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative"
            >
              <h3 className="text-xl font-serif text-stone-800 mb-6">Edit User Profile</h3>
              <form onSubmit={handleSaveUser} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Full Name</label>
                  <input type="text" value={editUserData.name} onChange={(e) => setEditUserData({...editUserData, name: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Email Address</label>
                  <input type="email" value={editUserData.email} onChange={(e) => setEditUserData({...editUserData, email: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">VIP Status</label>
                  <select value={editUserData.vipStatus} onChange={(e) => setEditUserData({...editUserData, vipStatus: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500">
                    <option value="Standard">Standard</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowEditUserModal(false)} className="flex-1 py-3 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 font-medium shadow-md">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showEditBookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative"
            >
              <h3 className="text-xl font-serif text-stone-800 mb-6 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" /> Modifying Event
              </h3>
              <form onSubmit={handleSaveBooking} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Occasion Type</label>
                  <input type="text" value={editBookingData.occasion} onChange={(e) => setEditBookingData({...editBookingData, occasion: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Target Date</label>
                  <input type="date" value={editBookingData.targetDate} onChange={(e) => setEditBookingData({...editBookingData, targetDate: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Venue / Address</label>
                  <input type="text" value={editBookingData.venue} onChange={(e) => setEditBookingData({...editBookingData, venue: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Status</label>
                  <select value={editBookingData.status} onChange={(e) => setEditBookingData({...editBookingData, status: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500">
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowEditBookingModal(false)} className="flex-1 py-3 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 font-medium shadow-md">Save Event</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

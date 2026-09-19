'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Users, LogOut, Pencil, Trash2, Check, X, AlertCircle, Calendar, UserCircle, Sun, Moon, Mail } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setMounted(true);
    const userId = localStorage.getItem('userId');
    if (!userId) { router.push('/login'); return; }
    fetchData(userId);
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const [usersRes, userRes] = await Promise.all([
        fetch(`${API}/users`, { credentials: 'include' }),
        fetch(`${API}/users/${userId}`, { credentials: 'include' }),
      ]);
      if (!usersRes.ok || !userRes.ok) { router.push('/login'); return; }
      const usersData = await usersRes.json();
      const userData = await userRes.json();
      setUsers(usersData);
      setCurrentUser(userData);
      setEditForm({ name: userData.name, email: userData.email });
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const userId = localStorage.getItem('userId');
    const res = await fetch(`${API}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
      credentials: 'include',
    });
    if (res.ok) {
      const updated = await res.json();
      setCurrentUser(updated);
      setEditing(false);
    } else {
      setError('Update failed');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account?')) return;
    const userId = localStorage.getItem('userId');
    await fetch(`${API}/users/${userId}`, { method: 'DELETE', credentials: 'include' });
    localStorage.removeItem('userId');
    router.push('/register');
  };

  const handleLogout = async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const getColor = (index: number) => {
    const colors = [
      'bg-violet-500', 'bg-indigo-500', 'bg-blue-500',
      'bg-cyan-500', 'bg-teal-500', 'bg-emerald-500',
      'bg-amber-500', 'bg-orange-500',
    ];
    return colors[index % colors.length];
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#111318] transition-colors duration-300">
      {/* Skeleton Navbar */}
      <nav className="bg-white dark:bg-[#1c1f26] border-b border-gray-200 dark:border-[#2a2d36] px-6 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="w-32 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-28 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="w-24 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-5">
        {/* Skeleton Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-[#1c1f26] rounded-2xl p-5 border border-gray-200 dark:border-[#2a2d36] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="w-20 h-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="w-16 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Skeleton Profile Card */}
          <div className="bg-white dark:bg-[#1c1f26] rounded-2xl border border-gray-200 dark:border-[#2a2d36] shadow-sm overflow-hidden lg:col-span-1">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="px-6 pb-6">
              <div className="-mt-10 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-300 dark:bg-gray-600 animate-pulse border-4 border-white dark:border-[#1c1f26]" />
              </div>
              <div className="space-y-2 mb-6">
                <div className="w-32 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="w-44 h-4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="w-full h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="w-full h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Skeleton All Users */}
          <div className="bg-white dark:bg-[#1c1f26] rounded-2xl border border-gray-200 dark:border-[#2a2d36] shadow-sm p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-5">
              <div className="space-y-2">
                <div className="w-24 h-5 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="w-48 h-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
              <div className="w-20 h-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-28 h-4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="w-40 h-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                  <div className="w-16 h-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#111318] transition-colors duration-300">

      {/* Navbar */}
      <nav className="bg-white dark:bg-[#1c1f26] border-b border-gray-200 dark:border-[#2a2d36] px-6 py-3.5 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/20">
              <Users size={17} />
            </div>
            <span className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">UserManager</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 bg-violet-50 dark:bg-[#252836] px-3 py-1.5 rounded-xl border border-violet-100 dark:border-[#2a2d36]">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                {currentUser ? getInitials(currentUser.name) : 'U'}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{currentUser?.name}</span>
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-[#252836] border border-gray-200 dark:border-[#2a2d36] hover:border-violet-300 dark:hover:border-violet-600 transition-all group"
              >
                {theme === 'dark'
                  ? <Sun size={15} className="text-yellow-400" />
                  : <Moon size={15} className="text-gray-500 group-hover:text-violet-500 transition" />
                }
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-xl font-semibold bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-100 dark:border-red-500/20 transition"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-5">

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1c1f26] rounded-2xl p-5 border border-gray-200 dark:border-[#2a2d36] shadow-sm flex items-center gap-4 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-600/40 transition-all">
            <div className="bg-violet-50 dark:bg-violet-500/10 p-3.5 rounded-2xl">
              <Users size={20} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-0.5">Total Users</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{users.length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1c1f26] rounded-2xl p-5 border border-gray-200 dark:border-[#2a2d36] shadow-sm flex items-center gap-4 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-600/40 transition-all">
            <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3.5 rounded-2xl">
              <UserCircle size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-0.5">Your Account</p>
              <p className="text-base font-extrabold text-gray-900 dark:text-white truncate">{currentUser?.name}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1c1f26] rounded-2xl p-5 border border-gray-200 dark:border-[#2a2d36] shadow-sm flex items-center gap-4 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-600/40 transition-all">
            <div className="bg-blue-50 dark:bg-blue-500/10 p-3.5 rounded-2xl">
              <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-0.5">Member Since</p>
              <p className="text-base font-extrabold text-gray-900 dark:text-white">
                {currentUser ? new Date(currentUser.createdAt).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Profile Card */}
          <div className="bg-white dark:bg-[#1c1f26] rounded-2xl border border-gray-200 dark:border-[#2a2d36] shadow-sm overflow-hidden lg:col-span-1">
            <div className="h-16 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />
            <div className="px-6 pb-6">
              <div className="-mt-10 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-xl shadow-violet-200 dark:shadow-violet-900/30 border-4 border-white dark:border-[#1c1f26]">
                  {currentUser ? getInitials(currentUser.name) : 'U'}
                </div>
              </div>

              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1 block uppercase tracking-wide">Full Name</label>
                    <input
                      className="w-full border border-gray-200 dark:border-[#2a2d36] rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-[#252836] text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1 block uppercase tracking-wide">Email</label>
                    <input
                      className="w-full border border-gray-200 dark:border-[#2a2d36] rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-[#252836] text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="Email"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleUpdate} className="flex-1 bg-violet-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-violet-700 transition flex items-center justify-center gap-1 shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
                      <Check size={14} /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className="flex-1 bg-gray-100 dark:bg-[#252836] text-gray-600 dark:text-gray-400 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-[#2a2d36] transition flex items-center justify-center gap-1 border border-gray-200 dark:border-[#2a2d36]">
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-extrabold text-gray-900 dark:text-white text-xl">{currentUser?.name}</p>
                  <div className="flex items-center gap-1.5 mt-1 mb-6">
                    <Mail size={12} className="text-gray-400 dark:text-gray-500" />
                    <p className="text-sm text-gray-400 dark:text-gray-500">{currentUser?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <button onClick={() => setEditing(true)} className="w-full bg-violet-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-violet-700 transition flex items-center justify-center gap-2 shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
                      <Pencil size={13} /> Edit Profile
                    </button>
                    <button onClick={handleDelete} className="w-full bg-gray-50 dark:bg-[#252836] text-gray-500 dark:text-gray-400 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition flex items-center justify-center gap-2 border border-gray-200 dark:border-[#2a2d36]">
                      <Trash2 size={13} /> Delete Account
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* All Users */}
          <div className="bg-white dark:bg-[#1c1f26] rounded-2xl border border-gray-200 dark:border-[#2a2d36] shadow-sm p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white">All Users</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Everyone registered in the system</p>
              </div>
              <span className="bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold px-3 py-1.5 rounded-full border border-violet-100 dark:border-violet-500/20">
                {users.length} members
              </span>
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {users.map((user, index) => (
                <div key={user._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252836] transition group cursor-default border border-transparent hover:border-gray-100 dark:hover:border-[#2a2d36]">
                  <div className={`w-10 h-10 rounded-xl ${getColor(index)} text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
                  </div>
                  <span className="text-xs text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={15} /> {error}
          </div>
        )}
      </div>
    </div>
  );
}
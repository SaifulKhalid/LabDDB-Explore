import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BangladeshMap } from '../components/Map/BangladeshMap';
import { Stats } from '../components/Dashboard/Stats';
import { DistrictModal } from '../components/Modals/DistrictModal';
import { DISTRICTS } from '../constants/districts';
import { DistrictInfo, DistrictData } from '../types';
import { LogOut, User as UserIcon, Share2, Map as MapIcon, LayoutDashboard } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Dashboard() {
  const { userData, logout } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(null);

  // Check for completion
  const visitedCount = userData 
    ? (Object.values(userData.districts) as DistrictData[]).filter(d => d.status === 'visited' || d.status === 'lived').length 
    : 0;

  useEffect(() => {
    if (userData && visitedCount === 64) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [visitedCount, userData]);

  if (!userData) return null;

  const handleDistrictClick = (id: string) => {
    const district = DISTRICTS.find(d => d.id === id);
    if (district) {
      setSelectedDistrict(district);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/u/${userData.username}`;
    navigator.clipboard.writeText(url);
    alert('Public profile link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 border-r border-gray-100 p-8 flex-col fixed h-full">
        <div className="mb-12">
          <h1 className="text-xl font-black text-gray-900 tracking-tighter">LabDDB<br/><span className="text-emerald-500">Explore BD</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 p-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={handleShare} className="w-full flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors">
            <Share2 size={18} /> Share Profile
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <UserIcon size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{userData.name}</p>
              <p className="text-xs text-gray-400 truncate">{userData.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-6 md:p-12 pb-24 md:pb-12">
        <header className="md:hidden flex justify-between items-center mb-8">
          <h1 className="text-lg font-black text-gray-900 tracking-tighter">LabDDB <span className="text-emerald-500">BD</span></h1>
          <button onClick={logout} className="p-2 text-gray-400"><LogOut size={20} /></button>
        </header>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Map */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Your Journey</h2>
              <p className="text-sm text-gray-400">Tap on a district to mark your progress.</p>
            </div>
            <BangladeshMap 
              districts={userData.districts} 
              onDistrictClick={handleDistrictClick} 
            />
          </section>

          {/* Right Column: Stats */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Stats & Badges</h2>
              <p className="text-sm text-gray-400">Unlock division badges by visiting all districts.</p>
            </div>
            <Stats districts={userData.districts} />
          </section>
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex justify-around items-center z-40">
        <button className="flex flex-col items-center gap-1 text-emerald-500">
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center gap-1 text-gray-400">
          <Share2 size={20} />
          <span className="text-[10px] font-bold uppercase">Share</span>
        </button>
        <button onClick={() => window.location.href = `/u/${userData.username}`} className="flex flex-col items-center gap-1 text-gray-400">
          <UserIcon size={20} />
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </button>
      </nav>

      {/* District Modal */}
      {selectedDistrict && (
        <DistrictModal 
          district={selectedDistrict}
          currentData={userData.districts[selectedDistrict.id]}
          onClose={() => setSelectedDistrict(null)}
        />
      )}
    </div>
  );
}

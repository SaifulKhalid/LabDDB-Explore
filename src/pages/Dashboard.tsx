import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BangladeshMap } from '../components/Map/BangladeshMap';
import { Stats } from '../components/Dashboard/Stats';
import { DistrictModal } from '../components/Modals/DistrictModal';
import { DISTRICTS, DIVISIONS } from '../constants/districts';
import { DistrictInfo, DistrictData } from '../types';
import { LogOut, User as UserIcon, Share2, Map as MapIcon, LayoutDashboard, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';

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
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Header - HDX Style */}
      <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 md:px-12 shrink-0 z-50 bg-white">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center rotate-3">
              <MapIcon className="text-white" size={18} />
            </div>
            <span>LabDDB <span className="text-emerald-500">Explore</span></span>
          </h1>
          
          <nav className="hidden md:flex items-center gap-1">
            <button className="px-4 py-2 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl">Dashboard</button>
            <button onClick={handleShare} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Share Journey</button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-xs font-bold text-slate-900 leading-none mb-1">{userData.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{userData.email}</p>
          </div>
          <button 
            onClick={logout}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Map Area - Large and Immersive */}
        <main className="flex-1 relative bg-[#f8fafc] p-4 md:p-8">
          <BangladeshMap 
            districts={userData.districts} 
            onDistrictClick={handleDistrictClick} 
          />
        </main>

        {/* Right: Sidebar - Data & Stats */}
        <aside className="w-full md:w-[450px] border-l border-slate-100 bg-white overflow-y-auto shrink-0 flex flex-col">
          <div className="p-8 space-y-10 flex-1">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900">Your Progress</h2>
                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Active Journey
                </div>
              </div>
              <Stats districts={userData.districts} />
            </section>

            <div className="h-px bg-slate-50 w-full" />

            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <LayoutDashboard size={14} className="text-slate-300" /> District Directory
              </h3>
              
              <div className="space-y-2">
                {DIVISIONS.map(division => (
                  <div key={division} className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-lg inline-block">
                      {division}
                    </h4>
                    <div className="grid grid-cols-1 gap-1 pl-1">
                      {DISTRICTS.filter(d => d.division === division).map(district => {
                        const status = userData.districts[district.id]?.status || 'notVisited';
                        return (
                          <button
                            key={district.id}
                            onClick={() => handleDistrictClick(district.id)}
                            className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-all group text-left"
                          >
                            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{district.name}</span>
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              status === 'visited' ? "bg-emerald-500" :
                              status === 'lived' ? "bg-blue-500" :
                              status === 'wishlist' ? "bg-amber-400" : "bg-slate-200"
                            )} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex justify-around items-center z-40">
        <button className="flex flex-col items-center gap-1 text-emerald-500">
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold uppercase">Map</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center gap-1 text-slate-400">
          <Share2 size={20} />
          <span className="text-[10px] font-bold uppercase">Share</span>
        </button>
        <button onClick={() => window.location.href = `/u/${userData.username}`} className="flex flex-col items-center gap-1 text-slate-400">
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

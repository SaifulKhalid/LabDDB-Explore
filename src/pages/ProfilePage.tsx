import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserDoc, DistrictData } from '../types';
import { BangladeshMap } from '../components/Map/BangladeshMap';
import { Stats } from '../components/Dashboard/Stats';
import { Loader2, MapPin, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const q = query(collection(db, 'users'), where('username', '==', username), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setProfile(querySnapshot.docs[0].data() as UserDoc);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Fetch profile error:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Oops!</h2>
        <p className="text-gray-500 mb-6">{error || 'Something went wrong'}</p>
        <Link to="/" className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl">Go Home</Link>
      </div>
    );
  }

  const visitedCount = (Object.values(profile.districts) as DistrictData[]).filter(d => d.status === 'visited' || d.status === 'lived').length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 font-bold text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-gray-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">{profile.name}'s Journey</h1>
                <p className="text-gray-400 flex items-center gap-1 font-medium">
                  <MapPin size={16} /> Exploring Bangladesh
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-emerald-50 px-6 py-3 rounded-2xl text-center">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Visited</p>
                  <p className="text-2xl font-black text-emerald-700">
                    {visitedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section className="space-y-6">
              <h2 className="text-xl font-black text-gray-900">Travel Map</h2>
              <BangladeshMap 
                districts={profile.districts} 
                onDistrictClick={() => {}} 
                readOnly={true}
              />
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black text-gray-900">Achievements</h2>
              <Stats districts={profile.districts} />
            </section>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-gray-400 text-xs font-medium">
          Built with LabDDB Explore Bangladesh
        </footer>
      </div>
    </div>
  );
}

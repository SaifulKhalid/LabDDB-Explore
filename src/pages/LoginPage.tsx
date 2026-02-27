import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, MapPin, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square bg-emerald-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square bg-blue-50 rounded-full blur-3xl opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl shadow-xl shadow-emerald-200 flex items-center justify-center mx-auto mb-8 rotate-3">
          <Globe className="text-white" size={40} />
        </div>

        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
          LabDDB<br/><span className="text-emerald-500">Explore BD</span>
        </h1>
        
        <p className="text-gray-500 text-lg font-medium mb-12 leading-relaxed">
          Track your journey across the 64 districts of Bangladesh. Share your memories and unlock badges.
        </p>

        <div className="space-y-4">
          <button 
            onClick={signIn}
            className="w-full py-4 bg-white border-2 border-gray-100 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-50/50 rounded-2xl font-bold text-gray-700 flex items-center justify-center gap-3 transition-all group"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-gray-400">
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={14} /> Secure
          </div>
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
            <MapPin size={14} /> 64 Districts
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award } from 'lucide-react';
import { UserDistricts } from '../../types';
import { DISTRICTS, DIVISIONS } from '../../constants/districts';
import { clsx } from 'clsx';
import { DistrictData } from '../../types';

interface StatsProps {
  districts: UserDistricts;
}

export const Stats: React.FC<StatsProps> = ({ districts }) => {
  const visitedCount = useMemo(() => {
    return (Object.values(districts) as DistrictData[]).filter(d => d.status === 'visited' || d.status === 'lived').length;
  }, [districts]);

  const percentage = Math.round((visitedCount / 64) * 100);

  const divisionStats = useMemo(() => {
    return DIVISIONS.map(div => {
      const divisionDistricts = DISTRICTS.filter(d => d.division === div);
      const visitedInDiv = divisionDistricts.filter(d => {
        const districtData = districts[d.id] as DistrictData | undefined;
        return districtData?.status === 'visited' || districtData?.status === 'lived';
      }).length;
      
      return {
        name: div,
        total: divisionDistricts.length,
        visited: visitedInDiv,
        completed: visitedInDiv === divisionDistricts.length
      };
    });
  }, [districts]);

  return (
    <div className="space-y-8">
      {/* Main Progress */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Overall Progress</p>
            <h3 className="text-4xl font-black text-gray-900">{visitedCount}<span className="text-gray-300 text-2xl font-normal">/64</span></h3>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-emerald-500">{percentage}%</p>
          </div>
        </div>
        
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          />
        </div>
      </div>

      {/* Division Badges */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Award size={14} /> Division Badges
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {divisionStats.map(div => (
            <div 
              key={div.name}
              className={clsx(
                "p-4 rounded-2xl border transition-all flex flex-col items-center text-center gap-2",
                div.completed 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                  : "bg-gray-50 border-gray-100 text-gray-400 grayscale opacity-60"
              )}
            >
              <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center mb-1",
                div.completed ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"
              )}>
                <Trophy size={20} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-tight leading-none">{div.name}</p>
              <p className="text-xs font-medium">{div.visited}/{div.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

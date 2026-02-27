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
    <div className="space-y-10">
      {/* Main Progress - HDX Style */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
            {visitedCount}
            <span className="text-xl text-slate-300 font-bold ml-2 tracking-normal">/ 64</span>
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-emerald-500 leading-none">{percentage}%</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Completed</span>
          </div>
        </div>
        
        <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          />
        </div>
      </div>

      {/* Division Badges - Grid Layout */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Award size={14} className="text-slate-300" /> Division Milestones
          </h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {divisionStats.map(div => (
            <motion.div 
              key={div.name}
              whileHover={{ y: -2 }}
              className={cn(
                "p-4 rounded-2xl border transition-all relative overflow-hidden group",
                div.completed 
                  ? "bg-emerald-50/50 border-emerald-100" 
                  : "bg-white border-slate-100"
              )}
            >
              {/* Progress Background */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-emerald-500/20 transition-all duration-1000"
                style={{ width: `${(div.visited / div.total) * 100}%` }}
              />

              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                  div.completed ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-slate-50 text-slate-300"
                )}>
                  <Trophy size={16} />
                </div>
                <span className={cn(
                  "text-[10px] font-black tracking-tighter",
                  div.completed ? "text-emerald-600" : "text-slate-400"
                )}>
                  {div.visited}/{div.total}
                </span>
              </div>
              
              <p className={cn(
                "text-xs font-black uppercase tracking-wider truncate",
                div.completed ? "text-emerald-900" : "text-slate-600"
              )}>
                {div.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { cn } from '../../lib/utils';

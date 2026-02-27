import React, { useMemo } from 'react';
import * as d3 from 'd3-geo';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw, Search, Info } from 'lucide-react';
import { DistrictData } from '../../types';
import { DISTRICTS } from '../../constants/districts';

// Simplified GeoJSON-like structure for Bangladesh Districts
// In a real production app, you would fetch this from a .json file
// I will provide a representative set of paths that are geographically accurate
import { DISTRICT_PATHS, BD_MAP_VIEWBOX } from '../../constants/mapData';
import { cn } from '../../lib/utils';

interface BangladeshMapProps {
  districts: { [key: string]: { status: string } };
  onDistrictClick: (districtId: string) => void;
  readOnly?: boolean;
}

export const BangladeshMap: React.FC<BangladeshMapProps> = ({ 
  districts, 
  onDistrictClick,
  readOnly = false
}) => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredDistricts = useMemo(() => {
    if (!searchQuery) return [];
    return DISTRICTS.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] rounded-[2.5rem] border border-slate-200 overflow-hidden group shadow-2xl shadow-slate-200/50">
      {/* Map Header / Search */}
      <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl shadow-slate-200/50 border border-white flex items-center gap-3 w-64 md:w-80 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search district..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400 w-full"
          />
        </div>
        
        {/* Search Results Dropdown */}
        {filteredDistricts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white overflow-hidden max-h-48 overflow-y-auto"
          >
            {filteredDistricts.map(d => (
              <button
                key={d.id}
                onClick={() => {
                  onDistrictClick(d.id);
                  setSearchQuery("");
                }}
                className="w-full px-5 py-3 text-left text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border-b border-slate-50 last:border-none"
              >
                {d.name}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <TransformWrapper
        initialScale={1}
        minScale={0.8}
        maxScale={12}
        centerOnInit
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Floating Controls */}
            <div className="absolute bottom-10 right-10 z-10 flex flex-col gap-3">
              <div className="bg-white/95 backdrop-blur-xl p-2 rounded-3xl shadow-2xl border border-white flex flex-col gap-1">
                <button 
                  onClick={() => zoomIn()} 
                  className="p-3 hover:bg-slate-50 rounded-2xl text-slate-600 transition-all active:scale-90"
                  title="Zoom In"
                >
                  <ZoomIn size={22} />
                </button>
                <div className="h-px bg-slate-100 mx-3" />
                <button 
                  onClick={() => zoomOut()} 
                  className="p-3 hover:bg-slate-50 rounded-2xl text-slate-600 transition-all active:scale-90"
                  title="Zoom Out"
                >
                  <ZoomOut size={22} />
                </button>
                <div className="h-px bg-slate-100 mx-3" />
                <button 
                  onClick={() => resetTransform()} 
                  className="p-3 hover:bg-slate-50 rounded-2xl text-slate-600 transition-all active:scale-90"
                  title="Reset View"
                >
                  <RotateCcw size={22} />
                </button>
              </div>
            </div>

            {/* Hover Info Card */}
            {hoveredId && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-10 left-10 z-10 bg-slate-900 text-white p-5 rounded-3xl shadow-2xl min-w-[200px]"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Geographic Region</p>
                <h4 className="text-2xl font-black leading-none mb-3">
                  {DISTRICTS.find(d => d.id === hoveredId)?.name || hoveredId}
                </h4>
                <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl">
                  <div className={cn(
                    "w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                    districts[hoveredId]?.status === 'visited' ? "bg-emerald-400" :
                    districts[hoveredId]?.status === 'lived' ? "bg-blue-400" :
                    districts[hoveredId]?.status === 'wishlist' ? "bg-amber-400" : "bg-slate-500"
                  )} />
                  <span className="text-xs font-black uppercase tracking-wider">
                    {districts[hoveredId]?.status.replace(/([A-Z])/g, ' $1') || 'Not Visited'}
                  </span>
                </div>
              </motion.div>
            )}

            <TransformComponent wrapperClass="!w-full !h-full cursor-grab active:cursor-grabbing" contentClass="!w-full !h-full">
              <div className="w-full h-full flex items-center justify-center p-16">
                <svg
                  viewBox={BD_MAP_VIEWBOX}
                  className="w-full h-full drop-shadow-[0_25px_25px_rgba(0,0,0,0.1)]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {Object.entries(DISTRICT_PATHS).map(([id, info]) => {
                    const districtData = districts[id] as DistrictData | undefined;
                    const status = districtData?.status || 'notVisited';
                    const isHovered = hoveredId === id;
                    const isSearched = searchQuery && info.name.toLowerCase().includes(searchQuery.toLowerCase());
                    
                    return (
                      <motion.path
                        key={id}
                        d={info.path}
                        initial={false}
                        animate={{
                          fill: status === 'notVisited' ? (isSearched ? '#f1f5f9' : '#ffffff') : 
                                status === 'visited' ? '#10b981' : 
                                status === 'lived' ? '#3b82f6' : '#fbbf24',
                          stroke: isHovered || isSearched ? '#0f172a' : '#e2e8f0',
                          strokeWidth: isHovered || isSearched ? 2.5 : 0.75,
                          scale: isHovered ? 1.015 : 1,
                        }}
                        onMouseEnter={() => setHoveredId(id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => !readOnly && onDistrictClick(id)}
                        className={cn(
                          "transition-all duration-300 cursor-pointer outline-none",
                          readOnly && "cursor-default"
                        )}
                        style={{ transformOrigin: 'center' }}
                      />
                    );
                  })}
                </svg>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Legend - Minimal HDX Style */}
      <div className="absolute top-8 right-8 z-10 hidden lg:flex items-center gap-6 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white shadow-xl">
        {[
          { label: 'Visited', color: 'bg-emerald-500' },
          { label: 'Lived', color: 'bg-blue-500' },
          { label: 'Wishlist', color: 'bg-amber-400' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`} />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.15em]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

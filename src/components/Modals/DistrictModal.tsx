import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Calendar, MapPin } from 'lucide-react';
import { DistrictInfo, DistrictStatus } from '../../types';
import { uploadToCloudinary } from '../../utils/imageUpload';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface DistrictModalProps {
  district: DistrictInfo;
  currentData: {
    status: DistrictStatus;
    photoUrl: string | null;
    visitedYear: number | null;
  };
  onClose: () => void;
}

export const DistrictModal: React.FC<DistrictModalProps> = ({ 
  district, 
  currentData, 
  onClose 
}) => {
  const { user, refreshUserData } = useAuth();
  const [status, setStatus] = useState<DistrictStatus>(currentData.status);
  const [year, setYear] = useState<number | string>(currentData.visitedYear || '');
  const [photoUrl, setPhotoUrl] = useState<string | null>(currentData.photoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file, user.uid, district.id);
      setPhotoUrl(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please check your Cloudinary config.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        [`districts.${district.id}`]: {
          status,
          photoUrl: (status === 'visited' || status === 'lived') ? photoUrl : null,
          visitedYear: year ? Number(year) : null
        }
      });

      await refreshUserData();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const showUpload = status === 'visited' || status === 'lived';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{district.name}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin size={14} /> {district.division} Division
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Status Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Status
              </label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as DistrictStatus)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              >
                <option value="notVisited">Not Visited</option>
                <option value="visited">Visited</option>
                <option value="lived">Lived</option>
                <option value="wishlist">Wishlist</option>
              </select>
            </div>

            {/* Year Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Year (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number"
                  placeholder="e.g. 2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-3 pl-10 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Photo Upload */}
            {showUpload && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Photo
                </label>
                <div className="relative aspect-video rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden group">
                  {photoUrl ? (
                    <>
                      <img 
                        src={photoUrl} 
                        alt="District" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
                          Change Photo
                          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                      {uploading ? (
                        <Loader2 className="animate-spin text-emerald-500" size={32} />
                      ) : (
                        <>
                          <Upload className="text-gray-400 mb-2" size={32} />
                          <span className="text-sm text-gray-500 font-medium">Click to upload photo</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
                    </label>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

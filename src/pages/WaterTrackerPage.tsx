import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Droplets,
  Plus,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Info,
  Flame,
  ArrowLeft
} from 'lucide-react';

interface WaterTrackerPageProps {
  setCurrentPage: (page: string) => void;
}

export const WaterTrackerPage: React.FC<WaterTrackerPageProps> = ({ setCurrentPage }) => {
  const { waterIntakeToday, addWater, resetWater, currentUser, updateCurrentUser } = useApp();

  const target = currentUser?.dailyWaterTarget || 2.5;
  const pct = Math.min(100, Math.round((waterIntakeToday / target) * 100));
  const remaining = Math.max(0, +(target - waterIntakeToday).toFixed(2));

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentPage('user-dashboard')}
          className="p-2 rounded-full bg-white border border-[#E7DFD1] text-[#303528] hover:bg-[#E7DFD1] transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#596044]">
            CELLULAR HYDRATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-[#303528]">
            Daily Water & Fluid Tracker
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive Water Bottle Vessel */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-white rounded-3xl p-8 border border-[#E7DFD1] shadow-xs">
          {/* Animated Water Cylinder */}
          <div className="relative w-36 h-72 border-4 border-blue-400 rounded-3xl overflow-hidden bg-blue-50/50 shadow-inner flex flex-col justify-end">
            {/* Water Fill Level */}
            <div
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-700 relative"
              style={{ height: `${pct}%` }}
            >
              {/* Ripple line */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-blue-300 opacity-60"></div>
            </div>

            {/* In-bottle Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
              <span className="text-4xl font-bold font-editorial text-[#303528] drop-shadow-xs">
                {pct}%
              </span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider mt-1">
                {waterIntakeToday} / {target} L
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            {pct >= 100 ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hydration Goal Met!</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500 font-semibold">
                {remaining} L remaining today
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Logging Controls */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-[#E7DFD1] pb-3">
            <h3 className="font-bold font-editorial text-lg text-[#303528]">Quick Fluid Log</h3>
            <button
              onClick={resetWater}
              className="text-xs font-semibold text-gray-400 hover:text-red-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Day
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => addWater(0.25)}
              className="p-4 rounded-2xl bg-[#F5F0E7] hover:bg-blue-50 border border-[#E7DFD1] hover:border-blue-300 transition flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#303528] block">+250 ml</span>
                <span className="text-[10px] text-gray-500">Standard Glass</span>
              </div>
            </button>

            <button
              onClick={() => addWater(0.5)}
              className="p-4 rounded-2xl bg-[#F5F0E7] hover:bg-blue-50 border border-[#E7DFD1] hover:border-blue-300 transition flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#303528] block">+500 ml</span>
                <span className="text-[10px] text-gray-500">Workout Bottle</span>
              </div>
            </button>

            <button
              onClick={() => addWater(0.75)}
              className="p-4 rounded-2xl bg-[#F5F0E7] hover:bg-blue-50 border border-[#E7DFD1] hover:border-blue-300 transition flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#303528] block">+750 ml</span>
                <span className="text-[10px] text-gray-500">Insulated Flask</span>
              </div>
            </button>

            <button
              onClick={() => addWater(1.0)}
              className="p-4 rounded-2xl bg-[#F5F0E7] hover:bg-blue-50 border border-[#E7DFD1] hover:border-blue-300 transition flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#303528] block">+1.0 Liter</span>
                <span className="text-[10px] text-gray-500">Hydration Jug</span>
              </div>
            </button>
          </div>

          {/* Science-backed Hydration Tips */}
          <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] space-y-2 text-xs text-gray-700">
            <h4 className="font-bold text-[#303528] flex items-center gap-1.5 uppercase text-[11px]">
              <Sparkles className="w-4 h-4 text-[#596044]" />
              Hydration Science Tips
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
              <li>Drink 500ml within 30 minutes of waking to kickstart cellular metabolism.</li>
              <li>Add a pinch of unrefined sea salt or electrolytes to improve intracellular uptake.</li>
              <li>A 2% drop in total body hydration can reduce muscular power output by up to 15%.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

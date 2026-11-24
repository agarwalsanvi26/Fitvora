import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Program } from '../types';
import { SafeImage } from '../components/SafeImage';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface ProgramsPageProps {
  setCurrentPage: (page: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ setCurrentPage }) => {
  const { programs } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [enrolledProgramId, setEnrolledProgramId] = useState<string | null>(null);

  const filteredPrograms = programs.filter(p => {
    return selectedLevel === 'All' || p.level === selectedLevel;
  });

  const handleEnroll = (prog: Program) => {
    setEnrolledProgramId(prog.id);
    setTimeout(() => {
      setEnrolledProgramId(null);
      setCurrentPage('workout-planner');
    }, 1200);
  };

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
          Structured Tracks
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#303528] mt-2 mb-4">
          Training Programs
        </h1>
        <p className="text-sm sm:text-base text-[#1E211B]/75 leading-relaxed">
          Multi-week plans written by our coaches with clear session lengths, recovery days, and simple progression.
        </p>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
              selectedLevel === lvl
                ? 'bg-[#596044] text-white'
                : 'bg-white text-[#303528] border border-[#E7DFD1] hover:bg-[#E7DFD1]'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPrograms.map(prog => {
          const isEnrolled = enrolledProgramId === prog.id;

          return (
            <div
              key={prog.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E7DFD1] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-60 relative overflow-hidden bg-[#E7DFD1]">
                  <SafeImage
                    src={prog.imageUrl}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/95 text-[#596044] text-xs font-semibold">
                      {prog.level}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#303528]/85 text-white text-xs font-semibold tabular-nums">
                      {prog.durationWeeks} Weeks
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <span className="text-xs font-semibold text-[#C87555]">
                    {prog.category}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#303528] mt-1 mb-3">
                    {prog.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {prog.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 py-3 border-y border-[#E7DFD1] font-medium tabular-nums">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#596044]" />
                      45–60 min / session
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#596044]" />
                      4 days / week
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => handleEnroll(prog)}
                  className={`w-full py-3 rounded-full text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                    isEnrolled
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#596044] text-white hover:bg-[#303528]'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Added to Planner</span>
                    </>
                  ) : (
                    <>
                      <span>Start Program</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

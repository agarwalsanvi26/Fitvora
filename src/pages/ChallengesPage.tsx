import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
  Star,
  ChevronRight
} from 'lucide-react';

interface ChallengesPageProps {
  setCurrentPage: (page: string) => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = () => {
  const { challenges, toggleChallengeDay, currentUser } = useApp();

  const activeChallenge = challenges[0] || {
    id: 'ch_30day',
    title: '30-Day Total Body Transformation',
    currentDay: 13,
    totalDays: 30,
    dailyTasks: []
  };

  const [activeTab, setActiveTab] = useState<'challenge' | 'leaderboard'>('challenge');

  const handleCompleteDay = (dayNum: number) => {
    toggleChallengeDay(activeChallenge.id, dayNum);

    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#596044', '#C87555', '#E7DFD1', '#303528']
    });
  };

  const leaderboardUsers = [
    { rank: 1, name: 'Marcus Sterling', points: 2850, streak: 28, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
    { rank: 2, name: 'Elena Vance (You)', points: 2420, streak: 12, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
    { rank: 3, name: 'Chloe Chen', points: 2390, streak: 19, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' },
    { rank: 4, name: 'David Miller', points: 2100, streak: 14, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { rank: 5, name: 'Aria Thorne', points: 1980, streak: 10, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80' }
  ];

  const dailyTasks = activeChallenge.dailyTasks || [];
  const totalDays = activeChallenge.totalDays || 30;
  const completedDaysCount = dailyTasks.filter(t => t.completed).length;
  const challengePct = Math.round((completedDaysCount / totalDays) * 100);

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#596044]">
            DAILY DISCIPLINE
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#303528]">
            30-Day Fitness Challenge
          </h1>
          <p className="text-sm text-[#1E211B]/70 mt-1 max-w-xl">
            Stack incremental daily micro-habits. Unlock badges, elevate your streak, and earn community points.
          </p>
        </div>

        {/* Streak Counter Card */}
        <div className="bg-white px-6 py-4 rounded-3xl border border-[#E7DFD1] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C87555]/15 flex items-center justify-center text-[#C87555]">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Current Streak</span>
            <div className="text-2xl font-bold font-editorial text-[#303528]">
              {currentUser?.streakDays || 12} Consecutive Days!
            </div>
            <span className="text-[11px] text-[#C87555] font-semibold">Active consistency multiplier</span>
          </div>
        </div>
      </div>

      {/* Tabs: Challenge Days vs Leaderboard */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('challenge')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition ${
            activeTab === 'challenge'
              ? 'bg-[#596044] text-white shadow-xs'
              : 'bg-white text-[#303528] border border-[#E7DFD1]'
          }`}
        >
          Daily Milestones
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition ${
            activeTab === 'leaderboard'
              ? 'bg-[#596044] text-white shadow-xs'
              : 'bg-white text-[#303528] border border-[#E7DFD1]'
          }`}
        >
          Community Leaderboard
        </button>
      </div>

      {activeTab === 'challenge' ? (
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7DFD1] shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#303528]">
                  {activeChallenge.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {completedDaysCount} of {activeChallenge.totalDays} days completed
                </p>
              </div>
              <span className="text-xl font-bold font-editorial text-[#596044]">{challengePct}%</span>
            </div>
            <div className="w-full bg-[#E7DFD1] h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#596044] h-full rounded-full transition-all duration-500"
                style={{ width: `${challengePct}%` }}
              ></div>
            </div>
          </div>

          {/* 30-Day Task Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyTasks.map(task => {
              const isToday = task.day === (activeChallenge.currentDay || 13);

              return (
                <div
                  key={task.day}
                  className={`p-5 rounded-3xl border transition flex flex-col justify-between ${
                    task.completed
                      ? 'bg-white/80 border-green-200'
                      : isToday
                      ? 'bg-white border-[#596044] ring-2 ring-[#596044]/20 shadow-md'
                      : 'bg-white border-[#E7DFD1]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold uppercase text-[#596044]">
                        Day {task.day}
                      </span>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full bg-[#596044] text-white text-[10px] font-bold uppercase">
                          Today's Goal
                        </span>
                      )}
                      {task.completed && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-[#303528] mb-1">{task.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{task.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E7DFD1] flex justify-between items-center">
                    <span className="text-[11px] font-bold text-[#C87555]">+{task.points} Points</span>
                    <button
                      onClick={() => handleCompleteDay(task.day)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                        task.completed
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-[#596044] text-white hover:bg-[#303528]'
                      }`}
                    >
                      {task.completed ? 'Completed ✓' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Community Leaderboard */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-6">
          <div className="border-b border-[#E7DFD1] pb-4">
            <h3 className="font-editorial text-2xl font-bold text-[#303528]">FITVORA Leaderboard</h3>
            <p className="text-xs text-gray-500">Season standings for active challenge participants.</p>
          </div>

          <div className="space-y-3">
            {leaderboardUsers.map(user => (
              <div
                key={user.rank}
                className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                  user.rank === 2
                    ? 'bg-[#F5F0E7] border-[#596044]'
                    : 'bg-white border-[#E7DFD1] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${
                      user.rank === 1
                        ? 'bg-amber-400 text-amber-950'
                        : user.rank === 2
                        ? 'bg-[#596044] text-white'
                        : user.rank === 3
                        ? 'bg-orange-300 text-orange-950'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    #{user.rank}
                  </div>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E7DFD1]"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#303528]">{user.name}</h4>
                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#C87555]" />
                      {user.streak} Day Streak
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-[#303528] block">{user.points} pts</span>
                  <span className="text-[10px] text-green-700 font-semibold uppercase">Active Member</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

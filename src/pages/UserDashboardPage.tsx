import React from 'react';
import { useApp } from '../context/AppContext';
import { ProgressCharts } from '../components/ProgressCharts';
import {
  Scale,
  Activity,
  Flame,
  Droplets,
  Timer,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Play,
  Calendar,
  Utensils,
  Plus
} from 'lucide-react';

interface UserDashboardProps {
  setCurrentPage: (page: string) => void;
}

export const UserDashboardPage: React.FC<UserDashboardProps> = ({ setCurrentPage }) => {
  const {
    currentUser,
    scheduledPlan,
    progressHistory,
    waterIntakeToday,
    addWater,
    toggleWorkoutComplete
  } = useApp();

  const user = currentUser || {
    name: 'there',
    weight: 65.5,
    height: 172,
    targetWeight: 60,
    streakDays: 12,
    dailyCalorieTarget: 2150,
    dailyWaterTarget: 2.5
  };

  const firstName = user.name.split(' ')[0];
  const heightM = (user.height || 172) / 100;
  const bmiVal = ((user.weight || 65.5) / (heightM * heightM)).toFixed(1);

  const todaysWorkout = scheduledPlan[0] || {
    id: 'plan_mon',
    title: 'Chest + Triceps Focus',
    durationMinutes: 45,
    completed: false
  };

  const waterTarget = user.dailyWaterTarget || 2.5;
  const waterPct = Math.min(100, Math.round((waterIntakeToday / waterTarget) * 100));

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#596044] mb-1">
            Daily Overview
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-[#303528]">
            Good morning, {firstName}
          </h1>
          <p className="text-sm text-[#1E211B]/70 mt-1">
            Here is your training, nutrition, and hydration summary for today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!currentUser && (
            <button
              onClick={() => setCurrentPage('login')}
              className="px-5 py-3 rounded-full bg-white border border-[#E7DFD1] text-[#303528] text-xs font-semibold hover:bg-[#F5F0E7] transition cursor-pointer"
            >
              Sign In to Sync
            </button>
          )}
          <button
            onClick={() => setCurrentPage('ai-coach')}
            className="px-5 py-3 rounded-full bg-[#596044] text-white text-xs font-semibold hover:bg-[#303528] transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C87555]" />
            <span>Ask Coach</span>
          </button>
          <button
            onClick={() => setCurrentPage('workout-planner')}
            className="px-5 py-3 rounded-full bg-[#E7DFD1] text-[#303528] text-xs font-semibold hover:bg-[#d8cebe] transition flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Planner</span>
          </button>
        </div>
      </div>

      {/* Six Primary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E7DFD1] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#596044]">Weight</span>
            <Scale className="w-4 h-4 text-[#596044]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-editorial text-[#303528] tabular-nums">
              {user.weight} <span className="text-sm font-sans font-medium text-gray-500">kg</span>
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-1">-0.4 kg this week</p>
          </div>
        </div>

        <div
          onClick={() => setCurrentPage('bmi')}
          className="bg-white p-5 rounded-3xl border border-[#E7DFD1] shadow-xs flex flex-col justify-between hover:border-[#596044] transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#596044]">BMI</span>
            <Activity className="w-4 h-4 text-[#596044]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-editorial text-[#303528] tabular-nums">{bmiVal}</div>
            <p className="text-xs text-[#596044] font-medium mt-1">Healthy range</p>
          </div>
        </div>

        <div
          onClick={() => setCurrentPage('diet')}
          className="bg-white p-5 rounded-3xl border border-[#E7DFD1] shadow-xs flex flex-col justify-between hover:border-[#596044] transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C87555]">Calories</span>
            <Flame className="w-4 h-4 text-[#C87555]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-editorial text-[#303528] tabular-nums">
              {(user.dailyCalorieTarget || 2150).toLocaleString()}
              <span className="text-xs font-sans font-medium text-gray-500"> kcal</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">Daily target</p>
          </div>
        </div>

        <div
          onClick={() => setCurrentPage('water')}
          className="bg-white p-5 rounded-3xl border border-[#E7DFD1] shadow-xs flex flex-col justify-between hover:border-[#596044] transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Water</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold font-editorial text-[#303528] tabular-nums">
              {waterIntakeToday}{' '}
              <span className="text-xs font-sans font-medium text-gray-500">/ {waterTarget} L</span>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-1 tabular-nums">{waterPct}% of goal</p>
          </div>
        </div>

        <div
          onClick={() => setCurrentPage('workout-planner')}
          className="bg-white p-5 rounded-3xl border border-[#E7DFD1] shadow-xs flex flex-col justify-between hover:border-[#596044] transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#596044]">Workout</span>
            <Timer className="w-4 h-4 text-[#596044]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-editorial text-[#303528] tabular-nums">
              42 <span className="text-xs font-sans font-medium text-gray-500">min</span>
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-1">Target: 45 min</p>
          </div>
        </div>

        <div
          onClick={() => setCurrentPage('challenges')}
          className="bg-white p-5 rounded-3xl border border-[#E7DFD1] shadow-xs flex flex-col justify-between hover:border-[#596044] transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C87555]">Streak</span>
            <Flame className="w-4 h-4 text-[#C87555]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-editorial text-[#303528] tabular-nums">
              {user.streakDays || 12}{' '}
              <span className="text-xs font-sans font-medium text-gray-500">days</span>
            </div>
            <p className="text-xs text-[#C87555] font-medium mt-1">Current best</p>
          </div>
        </div>
      </div>

      {/* Today's Plan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7DFD1]">
          <div>
            <h2 className="text-2xl font-bold font-editorial text-[#303528]">Today's Plan</h2>
            <p className="text-xs text-gray-500">Simple checkboxes to keep your day moving.</p>
          </div>
          <span className="text-xs font-semibold text-[#596044] bg-[#E7DFD1] px-3 py-1 rounded-full">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#596044] mb-2">
                <span>Today's Workout</span>
                <span className="text-gray-500 tabular-nums">{todaysWorkout.durationMinutes} min</span>
              </div>
              <h4 className="font-bold text-[#303528] text-base mb-1">{todaysWorkout.title}</h4>
              <p className="text-xs text-gray-600 mb-4">
                Upper body compound pressing paired with light core work.
              </p>
            </div>
            <button
              onClick={() => toggleWorkoutComplete(todaysWorkout.id || 'plan_mon')}
              className={`w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                todaysWorkout.completed
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#596044] text-white hover:bg-[#303528]'
              }`}
            >
              {todaysWorkout.completed ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#596044] mb-2">
                <span>Today's Meals</span>
                <span className="text-[#C87555] tabular-nums">1,840 / 2,150 kcal</span>
              </div>
              <h4 className="font-bold text-[#303528] text-base mb-1">Balanced Macros</h4>
              <p className="text-xs text-gray-600 mb-4">
                Breakfast (420 kcal) and lunch (550 kcal) logged. Dinner open.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('diet')}
              className="w-full py-2.5 rounded-full bg-white border border-[#E7DFD1] text-[#303528] text-xs font-semibold hover:bg-[#E7DFD1] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Open Meal Log</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-blue-600 mb-2">
                <span>Water Goal</span>
                <span className="tabular-nums">{waterPct}%</span>
              </div>
              <h4 className="font-bold text-[#303528] text-base mb-1 tabular-nums">
                {waterIntakeToday} L / {waterTarget} L
              </h4>
              <div className="w-full bg-[#E7DFD1] h-2 rounded-full overflow-hidden my-3">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${waterPct}%` }}
                ></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addWater(0.25)}
                className="flex-1 py-2 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                250 ml
              </button>
              <button
                onClick={() => addWater(0.5)}
                className="flex-1 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                500 ml
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#596044] mb-2">
                <span>Daily Steps</span>
                <span className="tabular-nums">85%</span>
              </div>
              <h4 className="font-bold text-[#303528] text-base mb-1 tabular-nums">
                8,450 <span className="text-xs font-normal text-gray-500">/ 10,000 steps</span>
              </h4>
              <div className="w-full bg-[#E7DFD1] h-2 rounded-full overflow-hidden my-3">
                <div className="bg-[#596044] h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('progress')}
              className="w-full py-2.5 rounded-full bg-white border border-[#E7DFD1] text-[#303528] text-xs font-semibold hover:bg-[#E7DFD1] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Log Activity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <ProgressCharts records={progressHistory} />

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs">
        <div className="flex items-center justify-between pb-6 border-b border-[#E7DFD1]">
          <div>
            <h3 className="text-xl font-bold font-editorial text-[#303528]">Goal Progress</h3>
            <p className="text-xs text-gray-500">Current milestones toward your personal targets.</p>
          </div>
          <button
            onClick={() => setCurrentPage('profile')}
            className="text-xs font-semibold text-[#596044] hover:underline cursor-pointer"
          >
            Adjust Goals
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1]">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#303528]">Weight Goal</span>
              <span className="text-[#596044] tabular-nums">75%</span>
            </div>
            <div className="text-lg font-bold text-[#303528] tabular-nums">
              {user.weight} / {user.targetWeight || 60} kg
            </div>
            <div className="w-full bg-[#E7DFD1] h-2.5 rounded-full overflow-hidden mt-3">
              <div className="bg-[#596044] h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.abs((user.weight || 65.5) - (user.targetWeight || 60)).toFixed(1)} kg to target
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1]">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#303528]">Workout Goal</span>
              <span className="text-[#596044] tabular-nums">80%</span>
            </div>
            <div className="text-lg font-bold text-[#303528] tabular-nums">4 / 5 sessions</div>
            <div className="w-full bg-[#E7DFD1] h-2.5 rounded-full overflow-hidden mt-3">
              <div className="bg-[#596044] h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">1 session left this week</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1]">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#303528]">Water Goal</span>
              <span className="text-blue-600 tabular-nums">{waterPct}%</span>
            </div>
            <div className="text-lg font-bold text-[#303528] tabular-nums">{waterIntakeToday} / {waterTarget} L</div>
            <div className="w-full bg-[#E7DFD1] h-2.5 rounded-full overflow-hidden mt-3">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${waterPct}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 tabular-nums">
              {Math.max(0, waterTarget - waterIntakeToday).toFixed(2)} L remaining
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1]">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#303528]">Step Goal</span>
              <span className="text-[#C87555] tabular-nums">85%</span>
            </div>
            <div className="text-lg font-bold text-[#303528] tabular-nums">8,450 / 10,000</div>
            <div className="w-full bg-[#E7DFD1] h-2.5 rounded-full overflow-hidden mt-3">
              <div className="bg-[#C87555] h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 tabular-nums">1,550 steps remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
};

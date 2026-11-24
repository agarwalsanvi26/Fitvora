import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  CheckCircle,
  Plus,
  Trash2,
  Clock,
  Dumbbell,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface WorkoutPlannerPageProps {
  setCurrentPage: (page: string) => void;
}

export const WorkoutPlannerPage: React.FC<WorkoutPlannerPageProps> = ({ setCurrentPage }) => {
  const { scheduledPlan, toggleWorkoutComplete, removeExerciseFromDay, exercises } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const activePlanItem = scheduledPlan.find(
    p => p.dayOfWeek.toLowerCase() === selectedDay.toLowerCase()
  ) || scheduledPlan[0];

  const completedCount = scheduledPlan.filter(p => p.completed).length;
  const weeklyPct = Math.round((completedCount / scheduledPlan.length) * 100);

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#596044]">
            PROGRAM EXECUTION
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#303528]">
            Weekly Workout Planner
          </h1>
          <p className="text-sm text-[#1E211B]/70 mt-1 max-w-xl">
            Structure your training volume across the week. Balance progressive overload with restorative down-regulation.
          </p>
        </div>

        {/* Weekly Completion Progress */}
        <div className="bg-white px-6 py-4 rounded-3xl border border-[#E7DFD1] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#596044]/15 flex items-center justify-center text-[#596044]">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">Week Completion</div>
            <div className="text-lg font-bold text-[#303528]">
              {completedCount} / 7 Days ({weeklyPct}%)
            </div>
            <div className="w-32 bg-[#E7DFD1] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#596044] h-full rounded-full transition-all duration-300"
                style={{ width: `${weeklyPct}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Days of Week Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map(day => {
          const item = scheduledPlan.find(p => p.dayOfWeek.toLowerCase() === day.toLowerCase());
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[110px] p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#596044] text-white border-[#596044] shadow-md'
                  : 'bg-white text-[#303528] border-[#E7DFD1] hover:bg-[#E7DFD1]/50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">{day.slice(0, 3)}</span>
                {item?.completed && (
                  <CheckCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-green-300' : 'text-green-600'}`} />
                )}
              </div>
              <div className="text-xs font-bold truncate">
                {item?.title || 'Rest'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Workout Details */}
      {activePlanItem && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7DFD1]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-[#E7DFD1] text-[#596044] text-xs font-bold uppercase">
                  {activePlanItem.dayOfWeek}
                </span>
                <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activePlanItem.durationMinutes} Minutes
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#303528]">
                {activePlanItem.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('exercises')}
                className="px-4 py-2.5 rounded-full border border-[#596044] text-[#596044] text-xs font-bold uppercase tracking-wider hover:bg-[#596044] hover:text-white transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Exercises</span>
              </button>

              <button
                onClick={() => toggleWorkoutComplete(activePlanItem.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${
                  activePlanItem.completed
                    ? 'bg-green-700 text-white'
                    : 'bg-[#C87555] text-white hover:bg-[#b06346]'
                }`}
              >
                {activePlanItem.completed ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed!</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Mark Completed</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Exercises List in this Workout */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Scheduled Movements ({activePlanItem.exercises.length})
            </h3>

            {activePlanItem.exercises.length === 0 ? (
              <div className="text-center py-12 bg-[#F5F0E7] rounded-2xl border border-dashed border-[#E7DFD1]">
                <p className="text-xs text-gray-500 font-medium mb-3">
                  This day is scheduled for rest or active recovery.
                </p>
                <button
                  onClick={() => setCurrentPage('exercises')}
                  className="px-4 py-2 rounded-full bg-[#596044] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Browse Library to Add Exercises
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activePlanItem.exercises.map((item, idx) => (
                  <div
                    key={`${item.exerciseId}_${idx}`}
                    className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white text-[#596044] font-bold text-xs flex items-center justify-center border border-[#E7DFD1]">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#303528]">{item.exerciseName}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-0.5">
                          <span><strong>{item.sets}</strong> Sets</span>
                          <span>•</span>
                          <span><strong>{item.reps}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeExerciseFromDay(activePlanItem.dayOfWeek, idx)}
                        className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-white transition"
                        title="Remove from day"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

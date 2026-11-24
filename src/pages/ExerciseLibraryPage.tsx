import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Exercise, MuscleGroup } from '../types';
import { SafeImage } from '../components/SafeImage';
import {
  Search,
  Dumbbell,
  Clock,
  Layers,
  ShieldAlert,
  Plus,
  Check,
  X,
  Info,
  Calendar
} from 'lucide-react';

interface ExerciseLibraryPageProps {
  setCurrentPage: (page: string) => void;
}

export const ExerciseLibraryPage: React.FC<ExerciseLibraryPageProps> = () => {
  const { exercises, addExerciseToDay, scheduledPlan } = useApp();

  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);

  // Add to Day modal state
  const [dayModalExercise, setDayModalExercise] = useState<Exercise | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const muscleCategories: (MuscleGroup | 'All')[] = [
    'All',
    'Chest',
    'Back',
    'Legs',
    'Shoulders',
    'Arms',
    'Abs',
    'Cardio',
    'Full Body',
    'Mobility'
  ];

  const filteredExercises = exercises.filter(ex => {
    const matchesMuscle = selectedMuscle === 'All' || ex.targetMuscle === selectedMuscle;
    const matchesDifficulty = selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.instructions.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMuscle && matchesDifficulty && matchesSearch;
  });

  const handleConfirmAddToDay = () => {
    if (dayModalExercise) {
      addExerciseToDay(selectedDay, dayModalExercise);
      setAddedToast(`Added ${dayModalExercise.name} to ${selectedDay}!`);
      setDayModalExercise(null);
      setTimeout(() => setAddedToast(null), 3000);
    }
  };

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#303528] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in border border-[#596044]">
          <Check className="w-4 h-4 text-green-400" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#596044]">
            MOVEMENT CURATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#303528]">
            Exercise Library
          </h1>
          <p className="text-sm text-[#1E211B]/70 mt-1 max-w-xl">
            Biomedically structured exercises with target muscle activations, precise cadence, rest protocols, and injury prevention cues.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name or muscle..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E7DFD1] text-xs font-medium text-[#303528] placeholder-gray-400 focus:outline-hidden focus:border-[#596044]"
          />
        </div>
      </div>

      {/* Muscle Group Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {muscleCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedMuscle(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedMuscle === cat
                  ? 'bg-[#596044] text-white shadow-xs'
                  : 'bg-white text-[#303528] border border-[#E7DFD1] hover:bg-[#E7DFD1]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty secondary pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 font-bold uppercase text-[10px]">Difficulty:</span>
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition ${
                selectedDifficulty === diff
                  ? 'bg-[#303528] text-white'
                  : 'bg-white/80 text-gray-600 hover:bg-[#E7DFD1]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(ex => (
          <div
            key={ex.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E7DFD1] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Image Banner */}
              <div className="h-52 relative overflow-hidden bg-[#E7DFD1]">
                <SafeImage
                  src={ex.imageUrl}
                  alt={ex.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#596044] text-[10px] font-bold uppercase">
                    {ex.targetMuscle}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      ex.difficulty === 'Beginner'
                        ? 'bg-green-100 text-green-800'
                        : ex.difficulty === 'Intermediate'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {ex.difficulty}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6">
                <h3 className="font-editorial text-xl font-bold text-[#1E211B] mb-2">{ex.name}</h3>

                {/* Micro Stats: Sets, Reps, Rest */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E7DFD1] text-center my-3 bg-[#F5F0E7]/60 rounded-xl">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Sets</span>
                    <div className="text-sm font-bold text-[#303528]">{ex.sets}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Reps</span>
                    <div className="text-sm font-bold text-[#303528]">{ex.reps}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Rest</span>
                    <div className="text-sm font-bold text-[#303528]">{ex.restTime}s</div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {ex.instructions}
                </p>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-6 pt-0 flex gap-2">
              <button
                onClick={() => setActiveExerciseModal(ex)}
                className="flex-1 py-2.5 rounded-full border border-[#E7DFD1] text-[#303528] text-xs font-bold hover:bg-[#F5F0E7] transition flex items-center justify-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>

              <button
                onClick={() => setDayModalExercise(ex)}
                className="flex-1 py-2.5 rounded-full bg-[#596044] text-white text-xs font-bold hover:bg-[#303528] transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD TO WORKOUT</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E7DFD1]">
          <Dumbbell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="font-editorial text-lg font-bold text-[#303528]">No exercises found</h3>
          <p className="text-xs text-gray-500 mt-1">Try resetting your filters or search terms.</p>
        </div>
      )}

      {/* Modal 1: Exercise Detail Modal */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E7DFD1] p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase text-[#596044]">
                  {activeExerciseModal.targetMuscle} • {activeExerciseModal.difficulty}
                </span>
                <h3 className="text-2xl font-bold font-editorial text-[#303528] mt-1">
                  {activeExerciseModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveExerciseModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-[#303528] hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SafeImage
              src={activeExerciseModal.imageUrl}
              alt={activeExerciseModal.name}
              className="w-full h-56 object-cover rounded-2xl"
            />

            <div className="grid grid-cols-3 gap-3 p-3 bg-[#F5F0E7] rounded-2xl text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Sets</span>
                <div className="text-base font-bold text-[#303528]">{activeExerciseModal.sets}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Reps</span>
                <div className="text-base font-bold text-[#303528]">{activeExerciseModal.reps}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Rest</span>
                <div className="text-base font-bold text-[#303528]">{activeExerciseModal.restTime}s</div>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <div>
                <h4 className="font-bold text-sm text-[#303528] mb-1">Execution Instructions</h4>
                <p className="text-gray-600">{activeExerciseModal.instructions}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Safety Tips & Biomechanics</strong>
                  <p>{activeExerciseModal.safetyTips}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setDayModalExercise(activeExerciseModal);
                setActiveExerciseModal(null);
              }}
              className="w-full py-3 rounded-full bg-[#596044] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#303528] transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>SCHEDULE THIS EXERCISE</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: Add to Workout Day Modal */}
      {dayModalExercise && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-[#E7DFD1] p-6 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-[#E7DFD1]">
              <h3 className="font-bold font-editorial text-lg text-[#303528]">Add to Schedule</h3>
              <button
                onClick={() => setDayModalExercise(null)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Schedule <strong>{dayModalExercise.name}</strong> ({dayModalExercise.sets} sets × {dayModalExercise.reps}) into your weekly workout calendar:
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Select Day</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday'
                ].map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      selectedDay === day
                        ? 'bg-[#596044] text-white border-[#596044]'
                        : 'bg-[#F5F0E7] text-[#303528] border-[#E7DFD1]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmAddToDay}
              className="w-full py-3 rounded-full bg-[#C87555] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#b06346] transition flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirm & Add</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

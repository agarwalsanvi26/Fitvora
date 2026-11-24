import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProgressCharts } from '../components/ProgressCharts';
import {
  TrendingUp,
  Plus,
  Scale,
  Calendar,
  Flame,
  Clock,
  Footprints,
  CheckCircle2,
  X
} from 'lucide-react';

interface ProgressTrackingPageProps {
  setCurrentPage: (page: string) => void;
}

export const ProgressTrackingPage: React.FC<ProgressTrackingPageProps> = () => {
  const { progressHistory, addProgressRecord, currentUser } = useApp();

  const [logModalOpen, setLogModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<number>(currentUser?.weight || 65.5);
  const [bodyFat, setBodyFat] = useState<number>(21.5);
  const [chest, setChest] = useState<number>(94);
  const [waist, setWaist] = useState<number>(72);
  const [hips, setHips] = useState<number>(96);
  const [biceps, setBiceps] = useState<number>(31);
  const [workoutMinutes, setWorkoutMinutes] = useState<number>(45);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(420);
  const [steps, setSteps] = useState<number>(8500);
  const [notes, setNotes] = useState('');

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    addProgressRecord({
      weight: Number(weight),
      bodyFat: Number(bodyFat),
      bodyFatPercentage: Number(bodyFat),
      chest: Number(chest),
      waist: Number(waist),
      waistCm: Number(waist),
      hip: Number(hips),
      hipsCm: Number(hips),
      workoutMinutes: Number(workoutMinutes),
      caloriesBurned: Number(caloriesBurned),
      steps: Number(steps),
      notes: notes.trim()
    });

    setLogModalOpen(false);
    setNotes('');
  };

  // Aggregates
  const earliestWeight = progressHistory[0]?.weight || 65.5;
  const latestWeight = progressHistory[progressHistory.length - 1]?.weight || 65.5;
  const totalWeightDiff = +(latestWeight - earliestWeight).toFixed(1);
  const totalCaloriesBurned = progressHistory.reduce((s, r) => s + (r.caloriesBurned || 0), 0);
  const totalWorkoutMinutes = progressHistory.reduce((s, r) => s + (r.workoutMinutes || 0), 0);

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#596044]">
            LONGITUDINAL TELEMETRY
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#303528]">
            Progress & Metric Tracking
          </h1>
          <p className="text-sm text-[#1E211B]/70 mt-1 max-w-xl">
            Objective body composition metrics, circumference tracking, daily energy expenditure, and step progression.
          </p>
        </div>

        <button
          onClick={() => setLogModalOpen(true)}
          className="px-6 py-3 rounded-full bg-[#596044] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#303528] transition flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>LOG TODAY'S METRICS</span>
        </button>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E7DFD1] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#596044]/15 flex items-center justify-center text-[#596044]">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-500">Weight Progression</span>
            <div className="text-2xl font-bold font-editorial text-[#303528]">
              {totalWeightDiff > 0 ? `+${totalWeightDiff}` : totalWeightDiff} kg
            </div>
            <span className="text-[11px] text-[#596044] font-medium">Over 30 tracked days</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E7DFD1] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C87555]/15 flex items-center justify-center text-[#C87555]">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-500">Total Energy Burned</span>
            <div className="text-2xl font-bold font-editorial text-[#303528]">
              {totalCaloriesBurned.toLocaleString()} kcal
            </div>
            <span className="text-[11px] text-[#C87555] font-medium">Logged workouts</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E7DFD1] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#303528]/10 flex items-center justify-center text-[#303528]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-500">Total Training Time</span>
            <div className="text-2xl font-bold font-editorial text-[#303528]">
              {totalWorkoutMinutes} min
            </div>
            <span className="text-[11px] text-[#303528] font-medium">Active movement</span>
          </div>
        </div>
      </div>

      {/* Chart.js Embedded Section */}
      <ProgressCharts records={progressHistory} />

      {/* Progress History Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-[#E7DFD1]">
          <div>
            <h3 className="text-xl font-bold font-editorial text-[#303528]">Recent Entries</h3>
            <p className="text-xs text-gray-500">Historical records of your biometric measurements.</p>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            {progressHistory.length} Total Logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7DFD1] text-gray-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Weight</th>
                <th className="py-3 px-3">Body Fat</th>
                <th className="py-3 px-3">Waist / Hips</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Calories</th>
                <th className="py-3 px-3">Steps</th>
                <th className="py-3 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DFD1]">
              {progressHistory.slice().reverse().map(rec => (
                <tr key={rec.id} className="hover:bg-[#F5F0E7]/50 transition">
                  <td className="py-3.5 px-3 font-bold text-[#303528]">{rec.date}</td>
                  <td className="py-3.5 px-3 font-semibold text-[#596044]">{rec.weight} kg</td>
                  <td className="py-3.5 px-3">{rec.bodyFatPercentage ? `${rec.bodyFatPercentage}%` : '-'}</td>
                  <td className="py-3.5 px-3 text-gray-600">
                    {rec.waistCm ? `${rec.waistCm}cm / ${rec.hipsCm}cm` : '-'}
                  </td>
                  <td className="py-3.5 px-3">{rec.workoutMinutes} min</td>
                  <td className="py-3.5 px-3 text-[#C87555] font-semibold">{rec.caloriesBurned || '-'} kcal</td>
                  <td className="py-3.5 px-3">{rec.steps.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-gray-500 max-w-xs truncate">{rec.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {logModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E7DFD1] p-6 sm:p-8 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-[#E7DFD1]">
              <h3 className="font-bold font-editorial text-xl text-[#303528]">Log Daily Metrics</h3>
              <button onClick={() => setLogModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weight}
                    onChange={e => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Body Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFat}
                    onChange={e => setBodyFat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    value={chest}
                    onChange={e => setChest(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    value={waist}
                    onChange={e => setWaist(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Hips (cm)</label>
                  <input
                    type="number"
                    value={hips}
                    onChange={e => setHips(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Biceps (cm)</label>
                  <input
                    type="number"
                    value={biceps}
                    onChange={e => setBiceps(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">Workout (min)</label>
                  <input
                    type="number"
                    value={workoutMinutes}
                    onChange={e => setWorkoutMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">Calories Burned</label>
                  <input
                    type="number"
                    value={caloriesBurned}
                    onChange={e => setCaloriesBurned(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">Daily Steps</label>
                  <input
                    type="number"
                    value={steps}
                    onChange={e => setSteps(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Notes & Energy Levels</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Felt strong on squats, high recovery score..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#596044] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#303528] transition flex items-center justify-center gap-2 mt-4"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Telemetry Record</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

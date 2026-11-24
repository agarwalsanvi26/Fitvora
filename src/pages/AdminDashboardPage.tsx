import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MuscleGroup, Difficulty } from '../types';
import { STUDIO_MEDIA } from '../assets/media';
import {
  Plus,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface AdminDashboardPageProps {
  setCurrentPage: (page: string) => void;
}

interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  role: string;
  goal?: string;
  active?: boolean;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ setCurrentPage }) => {
  const { currentUser, authToken, exercises, addExercise, programs } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'exercises' | 'users' | 'programs'>('overview');
  const [directoryUsers, setDirectoryUsers] = useState<DirectoryUser[]>([]);
  const [directoryError, setDirectoryError] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // New Exercise Form
  const [newExName, setNewExName] = useState('');
  const [newExMuscle, setNewExMuscle] = useState<MuscleGroup>('Chest');
  const [newExDiff, setNewExDiff] = useState<Difficulty>('Intermediate');
  const [newExSets, setNewExSets] = useState(4);
  const [newExReps, setNewExReps] = useState('10-12 reps');
  const [newExRest, setNewExRest] = useState(90);
  const [newExInstructions, setNewExInstructions] = useState('');
  const [newExSafety, setNewExSafety] = useState('');
  const [exerciseAdded, setExerciseAdded] = useState(false);

  useEffect(() => {
    if (!authToken || currentUser?.role !== 'ADMIN') return;
    setLoadingUsers(true);
    setDirectoryError(null);

    fetch('/api/java/users?page=1&pageSize=25', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(async res => {
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Could not load member directory');
        }
        setDirectoryUsers(json.data?.users || []);
      })
      .catch(err => {
        setDirectoryError(err.message || 'Unable to load directory');
      })
      .finally(() => setLoadingUsers(false));
  }, [authToken, currentUser]);

  if (!currentUser || currentUser.role !== 'ADMIN' || !authToken) {
    return (
      <div className="bg-[#F5F0E7] min-h-[calc(100vh-80px)] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E7DFD1] text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#303528] text-white flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5 text-[#C87555]" />
          </div>
          <h1 className="text-2xl font-bold font-editorial text-[#303528]">Administrator Sign-In Required</h1>
          <p className="text-sm text-gray-600">
            Studio administration and member directory records are restricted to authenticated administrators.
          </p>
          <button
            onClick={() => setCurrentPage('login')}
            className="px-6 py-3 rounded-full bg-[#596044] text-white text-xs font-semibold hover:bg-[#303528] transition cursor-pointer"
          >
            Sign In as Administrator
          </button>
        </div>
      </div>
    );
  }

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    addExercise({
      name: newExName.trim(),
      targetMuscle: newExMuscle,
      difficulty: newExDiff,
      sets: Number(newExSets),
      reps: newExReps,
      restTime: Number(newExRest),
      instructions: newExInstructions.trim() || 'Execute movement with controlled tempo and full range of motion.',
      safetyTips: newExSafety.trim() || 'Maintain neutral spine alignment throughout.',
      imageUrl: STUDIO_MEDIA.programStrength
    });

    setNewExName('');
    setNewExInstructions('');
    setNewExSafety('');
    setExerciseAdded(true);
    setTimeout(() => setExerciseAdded(false), 3000);
  };

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
            Studio Administration
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-[#303528] mt-1">
            Studio Operations &amp; Catalog
          </h1>
        </div>

        <div className="flex p-1 bg-white rounded-2xl border border-[#E7DFD1] shadow-2xs">
          {(['overview', 'exercises', 'users', 'programs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#596044] text-white'
                  : 'text-[#303528] hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E7DFD1] shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Registered Accounts</span>
              <div className="text-3xl font-bold font-editorial text-[#303528] mt-1 tabular-nums">
                {directoryUsers.length}
              </div>
              <span className="text-xs text-emerald-700 font-medium">Loaded from SQLite</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E7DFD1] shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Exercise Catalog</span>
              <div className="text-3xl font-bold font-editorial text-[#303528] mt-1 tabular-nums">
                {exercises.length}
              </div>
              <span className="text-xs text-[#596044] font-medium">Published movements</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E7DFD1] shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Active Programs</span>
              <div className="text-3xl font-bold font-editorial text-[#303528] mt-1 tabular-nums">
                {programs.length}
              </div>
              <span className="text-xs text-[#C87555] font-medium">Training tracks</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E7DFD1] shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Signed-In Admin</span>
              <div className="text-xl font-bold font-editorial text-[#303528] mt-1 truncate">
                {currentUser.name}
              </div>
              <span className="text-xs text-gray-500 font-medium truncate block">{currentUser.email}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#303528]">Manage Exercise Library</h3>
              <p className="text-xs text-gray-500 mt-1">Add new movements with form cues and safety notes.</p>
            </div>
            <button
              onClick={() => setActiveTab('exercises')}
              className="px-6 py-3 rounded-full bg-[#596044] text-white text-xs font-semibold hover:bg-[#303528] transition inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exercise</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'exercises' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-5">
            <h3 className="font-editorial text-xl font-bold text-[#303528] pb-3 border-b border-[#E7DFD1]">
              Publish New Exercise
            </h3>

            {exerciseAdded && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Exercise added to library.</span>
              </div>
            )}

            <form onSubmit={handleCreateExercise} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={newExName}
                  onChange={e => setNewExName(e.target.value)}
                  placeholder="e.g. Bulgarian Split Squat"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target Muscle</label>
                  <select
                    value={newExMuscle}
                    onChange={e => setNewExMuscle(e.target.value as MuscleGroup)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm"
                  >
                    {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio', 'Full Body', 'Mobility'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={newExDiff}
                    onChange={e => setNewExDiff(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sets</label>
                  <input
                    type="number"
                    value={newExSets}
                    onChange={e => setNewExSets(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Reps</label>
                  <input
                    type="text"
                    value={newExReps}
                    onChange={e => setNewExReps(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Rest (sec)</label>
                  <input
                    type="number"
                    value={newExRest}
                    onChange={e => setNewExRest(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Instructions</label>
                <textarea
                  rows={2}
                  value={newExInstructions}
                  onChange={e => setNewExInstructions(e.target.value)}
                  placeholder="Set rear foot on bench, lower until front thigh is parallel..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Safety Notes</label>
                <textarea
                  rows={2}
                  value={newExSafety}
                  onChange={e => setNewExSafety(e.target.value)}
                  placeholder="Keep front knee tracking cleanly over toes..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#596044] text-white text-xs font-semibold hover:bg-[#303528] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Library</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[#303528] pb-3 border-b border-[#E7DFD1] tabular-nums">
              Current Library ({exercises.length})
            </h3>
            <div className="max-h-[550px] overflow-y-auto space-y-3 pr-1">
              {exercises.map(ex => (
                <div key={ex.id} className="p-3.5 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-xs text-[#303528]">{ex.name}</h4>
                    <span className="text-xs text-gray-500">
                      {ex.targetMuscle} · {ex.difficulty} · {ex.sets} sets × {ex.reps}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#596044]">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-4">
          <h3 className="font-editorial text-xl font-bold text-[#303528] pb-3 border-b border-[#E7DFD1]">
            Member Directory
          </h3>
          {loadingUsers ? (
            <p className="text-xs text-gray-500">Loading member records...</p>
          ) : directoryError ? (
            <p className="text-xs text-rose-700">{directoryError}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E7DFD1] text-gray-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DFD1]">
                  {directoryUsers.map(u => (
                    <tr key={u.id} className="hover:bg-[#F5F0E7]/60">
                      <td className="py-3 px-3 font-semibold text-[#303528]">{u.name}</td>
                      <td className="py-3 px-3 text-gray-600">{u.email}</td>
                      <td className="py-3 px-3 font-semibold text-[#596044]">{u.role}</td>
                      <td className="py-3 px-3 text-emerald-700 font-medium">
                        {u.active === false ? 'Inactive' : 'Active'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'programs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-4">
          <h3 className="font-editorial text-xl font-bold text-[#303528] pb-3 border-b border-[#E7DFD1] tabular-nums">
            Published Programs ({programs.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] space-y-2">
                <span className="text-xs font-semibold text-[#596044]">{p.category}</span>
                <h4 className="font-bold text-sm text-[#303528]">{p.title}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>
                <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-[#E7DFD1] tabular-nums">
                  <span>{p.durationWeeks} weeks</span>
                  <span>{p.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

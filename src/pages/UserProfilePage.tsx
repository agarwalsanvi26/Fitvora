import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FitnessGoal, FitnessLevel, ActivityLevel } from '../types';
import { CheckCircle2, Save } from 'lucide-react';

interface UserProfilePageProps {
  setCurrentPage: (page: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ setCurrentPage }) => {
  const { currentUser, updateCurrentUser } = useApp();

  const [name, setName] = useState(currentUser?.name || 'Guest Member');
  const [weight, setWeight] = useState(currentUser?.weight || 65.5);
  const [height, setHeight] = useState(currentUser?.height || 172);
  const [goal, setGoal] = useState<FitnessGoal>(currentUser?.goal || 'Weight Loss');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(currentUser?.fitnessLevel || 'Intermediate');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(currentUser?.activityLevel || 'Moderately Active');
  const [calorieTarget, setCalorieTarget] = useState(currentUser?.dailyCalorieTarget || 2150);
  const [waterTarget, setWaterTarget] = useState(currentUser?.dailyWaterTarget || 2.5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setWeight(currentUser.weight);
      setHeight(currentUser.height);
      setGoal(currentUser.goal);
      setFitnessLevel(currentUser.fitnessLevel || 'Intermediate');
      setActivityLevel(currentUser.activityLevel);
      setCalorieTarget(currentUser.dailyCalorieTarget || 2150);
      setWaterTarget(currentUser.dailyWaterTarget || 2.5);
    }
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      weight: Number(weight),
      height: Number(height),
      goal,
      fitnessLevel,
      activityLevel,
      dailyCalorieTarget: Number(calorieTarget),
      dailyWaterTarget: Number(waterTarget)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
          Account &amp; Targets
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-[#303528] mt-1">
          Profile &amp; Preferences
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Update your body measurements and daily nutrition targets.
        </p>
      </div>

      {!currentUser ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E7DFD1] text-center space-y-4">
          <p className="text-sm text-gray-600">
            Sign in or create an account to save your personal profile and training goals.
          </p>
          <button
            onClick={() => setCurrentPage('login')}
            className="px-6 py-3 rounded-full bg-[#596044] text-white text-xs font-semibold hover:bg-[#303528] transition cursor-pointer"
          >
            Sign In
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E7DFD1] shadow-xs space-y-8">
          <div className="flex items-center gap-4 pb-6 border-b border-[#E7DFD1]">
            <div className="w-14 h-14 rounded-full bg-[#596044] text-[#F5F0E7] flex items-center justify-center font-bold text-xl">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold font-editorial text-[#303528]">{name}</h2>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
              <p className="text-xs text-[#596044] font-medium mt-1">
                Account Type: {currentUser.role} · Joined {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '2026'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Experience Level</label>
                <select
                  value={fitnessLevel}
                  onChange={e => setFitnessLevel(e.target.value as FitnessLevel)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528] tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528] tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Primary Goal</label>
                <select
                  value={goal}
                  onChange={e => setGoal(e.target.value as FitnessGoal)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Strength">Strength</option>
                  <option value="Endurance">Endurance</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={e => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
                >
                  <option value="Sedentary">Sedentary</option>
                  <option value="Lightly Active">Lightly Active</option>
                  <option value="Moderately Active">Moderately Active</option>
                  <option value="Very Active">Very Active</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Daily Calorie Target (kcal)
                </label>
                <input
                  type="number"
                  value={calorieTarget}
                  onChange={e => setCalorieTarget(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528] tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Daily Water Target (Liters)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={waterTarget}
                  onChange={e => setWaterTarget(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528] tabular-nums"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7DFD1] flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-[#596044] text-white text-xs font-semibold hover:bg-[#303528] transition flex items-center gap-2 cursor-pointer"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-300" />
                    <span>Preferences Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

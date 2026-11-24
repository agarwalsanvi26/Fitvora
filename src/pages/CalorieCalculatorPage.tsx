import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FitnessGoal, ActivityLevel } from '../types';
import { Flame, Info, ArrowLeft, CheckCircle2, PieChart } from 'lucide-react';

interface CalorieCalculatorPageProps {
  setCurrentPage: (page: string) => void;
}

export const CalorieCalculatorPage: React.FC<CalorieCalculatorPageProps> = ({ setCurrentPage }) => {
  const { currentUser, updateCurrentUser } = useApp();

  const [age, setAge] = useState<number>(currentUser?.age || 28);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(currentUser?.gender || 'Female');
  const [height, setHeight] = useState<number>(currentUser?.height || 172);
  const [weight, setWeight] = useState<number>(currentUser?.weight || 65.5);
  const [activity, setActivity] = useState<ActivityLevel>(currentUser?.activityLevel || 'Moderately Active');
  const [goal, setGoal] = useState<FitnessGoal>(currentUser?.goal || 'Weight Loss');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Mifflin-St Jeor Formula
  // Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
  // Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
  const genderAdjustment = gender === 'Male' ? 5 : -161;
  const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + genderAdjustment);

  // Activity multipliers
  const activityMultipliers: Record<ActivityLevel, number> = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725
  };

  const tdee = Math.round(bmr * activityMultipliers[activity]);

  // Adjust for Fitness Goal
  let targetCalories = tdee;
  if (goal === 'Weight Loss') targetCalories = Math.round(tdee - 450);
  else if (goal === 'Muscle Gain') targetCalories = Math.round(tdee + 350);
  else if (goal === 'Strength') targetCalories = Math.round(tdee + 200);

  // Suggested Macro grams
  // Protein: 2.0g per kg of bodyweight
  const proteinGrams = Math.round(weight * 2.0);
  const proteinCalories = proteinGrams * 4;
  // Fat: 25% of target calories
  const fatCalories = Math.round(targetCalories * 0.25);
  const fatGrams = Math.round(fatCalories / 9);
  // Carbs: remainder
  const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbGrams = Math.round(carbCalories / 4);

  const handleApplyTarget = () => {
    updateCurrentUser({
      dailyCalorieTarget: targetCalories,
      activityLevel: activity,
      goal
    });
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3000);
  };

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentPage('user-dashboard')}
          className="p-2 rounded-full bg-white border border-[#E7DFD1] text-[#303528] hover:bg-[#E7DFD1] transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#596044]">
            METABOLIC MODELING
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-[#303528]">
            Calorie & Macro Calculator
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-5">
          <h3 className="text-lg font-bold font-editorial text-[#303528] border-b border-[#E7DFD1] pb-3">
            Personal Parameters
          </h3>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Biological Sex</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Female', 'Male'] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    gender === g
                      ? 'bg-[#596044] text-white border-[#596044]'
                      : 'bg-[#F5F0E7] text-[#303528] border-[#E7DFD1]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Age, Height, Weight in 3 cols */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(parseInt(e.target.value) || 25)}
                className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold text-[#303528]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(parseFloat(e.target.value) || 170)}
                className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold text-[#303528]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                value={weight}
                onChange={e => setWeight(parseFloat(e.target.value) || 65)}
                className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold text-[#303528]"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Activity Level</label>
            <select
              value={activity}
              onChange={e => setActivity(e.target.value as ActivityLevel)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-semibold text-[#303528]"
            >
              <option value="Sedentary">Sedentary (Little or no exercise, desk job)</option>
              <option value="Lightly Active">Lightly Active (Exercise 1–3 days/week)</option>
              <option value="Moderately Active">Moderately Active (Exercise 3–5 days/week)</option>
              <option value="Very Active">Very Active (Heavy training 6–7 days/week)</option>
            </select>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Fitness Goal</label>
            <select
              value={goal}
              onChange={e => setGoal(e.target.value as FitnessGoal)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-semibold text-[#303528]"
            >
              <option value="Weight Loss">Weight Loss (Caloric Deficit -450 kcal)</option>
              <option value="Muscle Gain">Muscle Gain (Clean Surplus +350 kcal)</option>
              <option value="Strength">Strength Progression (+200 kcal)</option>
              <option value="Endurance">Endurance Maintenance</option>
              <option value="General Fitness">General Fitness Maintenance</option>
            </select>
          </div>
        </div>

        {/* Results & Macro Breakdown */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold font-editorial text-[#303528] border-b border-[#E7DFD1] pb-3">
              Daily Nutritional Energy Requirement
            </h3>

            {/* Big Numbers */}
            <div className="grid grid-cols-2 gap-4 my-6 text-center">
              <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1]">
                <span className="text-[11px] font-bold uppercase text-gray-500">Basal Metabolic Rate</span>
                <div className="text-2xl font-bold font-editorial text-[#303528] mt-1">{bmr.toLocaleString()}</div>
                <span className="text-[10px] text-gray-400">kcal burned at rest</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#596044]/15 border border-[#596044]/30">
                <span className="text-[11px] font-bold uppercase text-[#596044]">Daily Target Intake</span>
                <div className="text-3xl font-bold font-editorial text-[#303528] mt-1">
                  {targetCalories.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#596044] font-semibold">{goal} Target</span>
              </div>
            </div>

            {/* Macro Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-[#596044]" />
                Recommended Macronutrient Distribution
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-orange-800">Protein</span>
                  <div className="text-lg font-bold text-orange-950">{proteinGrams}g</div>
                  <span className="text-[10px] text-orange-700">{proteinCalories} kcal</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-amber-800">Carbs</span>
                  <div className="text-lg font-bold text-amber-950">{carbGrams}g</div>
                  <span className="text-[10px] text-amber-700">{carbCalories} kcal</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Healthy Fats</span>
                  <div className="text-lg font-bold text-emerald-950">{fatGrams}g</div>
                  <span className="text-[10px] text-emerald-700">{fatCalories} kcal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleApplyTarget}
              className="w-full py-3.5 rounded-full bg-[#C87555] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#b06346] transition flex items-center justify-center gap-2"
            >
              {appliedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>APPLIED TO DASHBOARD & MEALS!</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>SET AS MY DAILY CALORIE GOAL</span>
                </>
              )}
            </button>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-[#F5F0E7] text-[11px] text-gray-600 flex items-start gap-2 border border-[#E7DFD1]">
              <Info className="w-4 h-4 text-[#596044] shrink-0 mt-0.5" />
              <span>
                <strong>Disclaimer:</strong> Caloric and macronutrient estimates are modeled using standard clinical metabolic equations and serve solely as approximate guidelines. Individual energy expenditure may vary based on genetics, thermic effect of food, and hormonal health.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MealItem, MealType } from '../types';
import {
  Utensils,
  Plus,
  Trash2,
  PieChart,
  Flame,
  Salad,
  X,
  Check
} from 'lucide-react';

interface DietNutritionPageProps {
  setCurrentPage: (page: string) => void;
}

export const DietNutritionPage: React.FC<DietNutritionPageProps> = () => {
  const { meals, addMeal, deleteMeal, currentUser } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>('Breakfast');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState(350);
  const [protein, setProtein] = useState(25);
  const [carbs, setCarbs] = useState(30);
  const [fat, setFat] = useState(10);
  const [servingSize, setServingSize] = useState('1 portion');

  // Daily Totals
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);

  // Targets
  const calorieTarget = currentUser?.dailyCalorieTarget || 2150;
  const proteinTarget = Math.round((currentUser?.weight || 65) * 2.0); // ~130g
  const carbsTarget = Math.round((calorieTarget * 0.45) / 4); // ~240g
  const fatTarget = Math.round((calorieTarget * 0.25) / 9); // ~60g

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMeal({
      name: name.trim(),
      mealType,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      servingSize: servingSize.trim()
    });

    setName('');
    setCalories(350);
    setProtein(25);
    setCarbs(30);
    setFat(10);
    setAddModalOpen(false);
  };

  const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#596044]">
            WHOLE-FOOD NOURISHMENT
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#303528]">
            Diet & Nutrition Dashboard
          </h1>
          <p className="text-sm text-[#1E211B]/70 mt-1 max-w-xl">
            Track daily macronutrients and energy balance without rigid restriction. Fuel physical adaptation and cellular recovery.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-6 py-3 rounded-full bg-[#596044] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#303528] transition flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>LOG CUSTOM FOOD</span>
        </button>
      </div>

      {/* Daily Totals & Progress Bars */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E7DFD1]">
          <h3 className="text-xl font-bold font-editorial text-[#303528]">Daily Macro Overview</h3>
          <span className="text-xs font-bold text-[#596044] bg-[#E7DFD1] px-3 py-1 rounded-full">
            Target: {calorieTarget} kcal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Calories */}
          <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1]">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-[#303528]">Calories</span>
              <span className="text-[#C87555]">
                {Math.round((totalCalories / calorieTarget) * 100)}%
              </span>
            </div>
            <div className="text-2xl font-bold font-editorial text-[#303528]">
              {totalCalories} <span className="text-xs font-normal text-gray-500">/ {calorieTarget} kcal</span>
            </div>
            <div className="w-full bg-[#E7DFD1] h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-[#C87555] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totalCalories / calorieTarget) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Protein */}
          <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1]">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-[#303528]">Protein</span>
              <span className="text-orange-700">
                {Math.round((totalProtein / proteinTarget) * 100)}%
              </span>
            </div>
            <div className="text-2xl font-bold font-editorial text-[#303528]">
              {totalProtein} <span className="text-xs font-normal text-gray-500">/ {proteinTarget} g</span>
            </div>
            <div className="w-full bg-[#E7DFD1] h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-orange-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totalProtein / proteinTarget) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Carbs */}
          <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1]">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-[#303528]">Carbohydrates</span>
              <span className="text-amber-700">
                {Math.round((totalCarbs / carbsTarget) * 100)}%
              </span>
            </div>
            <div className="text-2xl font-bold font-editorial text-[#303528]">
              {totalCarbs} <span className="text-xs font-normal text-gray-500">/ {carbsTarget} g</span>
            </div>
            <div className="w-full bg-[#E7DFD1] h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totalCarbs / carbsTarget) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Fat */}
          <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1]">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-[#303528]">Healthy Fats</span>
              <span className="text-emerald-700">
                {Math.round((totalFat / fatTarget) * 100)}%
              </span>
            </div>
            <div className="text-2xl font-bold font-editorial text-[#303528]">
              {totalFat} <span className="text-xs font-normal text-gray-500">/ {fatTarget} g</span>
            </div>
            <div className="w-full bg-[#E7DFD1] h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totalFat / fatTarget) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Meal Sections: Breakfast, Lunch, Snack, Dinner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mealTypes.map(type => {
          const sectionMeals = meals.filter(m => m.mealType === type);
          const sectionCals = sectionMeals.reduce((s, m) => s + m.calories, 0);

          return (
            <div
              key={type}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E7DFD1] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E7DFD1] mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#596044]/15 text-[#596044] flex items-center justify-center font-bold">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-xl font-bold text-[#303528]">{type}</h3>
                      <span className="text-[11px] text-gray-500 font-semibold">{sectionCals} kcal</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMealType(type);
                      setAddModalOpen(true);
                    }}
                    className="p-1.5 rounded-full text-[#596044] hover:bg-[#F5F0E7] transition"
                    title={`Add food to ${type}`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {sectionMeals.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-4 text-center">
                      No foods logged for {type} yet.
                    </p>
                  ) : (
                    sectionMeals.map(food => (
                      <div
                        key={food.id}
                        className="p-3.5 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] flex items-center justify-between gap-3"
                      >
                        <div>
                          <h4 className="font-bold text-xs text-[#303528]">{food.name}</h4>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {food.servingSize || 'Standard portion'}
                          </span>
                          <div className="flex gap-2 text-[10px] text-gray-600 mt-1 font-semibold">
                            <span className="text-[#C87555]">{food.calories} kcal</span>
                            <span>• P: {food.protein}g</span>
                            <span>• C: {food.carbs}g</span>
                            <span>• F: {food.fat}g</span>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteMeal(food.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-white transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7DFD1] mt-4 flex justify-between items-center text-xs text-gray-500">
                <span>{sectionMeals.length} item{sectionMeals.length !== 1 ? 's' : ''} logged</span>
                <button
                  onClick={() => {
                    setMealType(type);
                    setAddModalOpen(true);
                  }}
                  className="text-xs font-bold text-[#596044] hover:underline"
                >
                  + Add Item
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Food Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#E7DFD1] p-6 sm:p-8 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-[#E7DFD1]">
              <h3 className="font-bold font-editorial text-xl text-[#303528]">Log Food Item</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Meal Section</label>
                <select
                  value={mealType}
                  onChange={e => setMealType(e.target.value as MealType)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snack">Snack</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Food Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Salmon with Brown Rice"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-medium text-[#303528]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Serving Size</label>
                <input
                  type="text"
                  placeholder="e.g. 1 plate (180g)"
                  value={servingSize}
                  onChange={e => setServingSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-medium text-[#303528]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    value={calories}
                    onChange={e => setCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold text-[#303528]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    required
                    value={protein}
                    onChange={e => setProtein(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold text-[#303528]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Carbohydrates (g)</label>
                  <input
                    type="number"
                    required
                    value={carbs}
                    onChange={e => setCarbs(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold text-[#303528]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Healthy Fat (g)</label>
                  <input
                    type="number"
                    required
                    value={fat}
                    onChange={e => setFat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold text-[#303528]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#596044] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#303528] transition flex items-center justify-center gap-2 mt-4"
              >
                <Check className="w-4 h-4" />
                <span>Save to Meal Plan</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

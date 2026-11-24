import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scale, Info, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface BmiCalculatorPageProps {
  setCurrentPage: (page: string) => void;
}

export const BmiCalculatorPage: React.FC<BmiCalculatorPageProps> = ({ setCurrentPage }) => {
  const { currentUser, updateCurrentUser } = useApp();

  const [height, setHeight] = useState<number>(currentUser?.height || 172);
  const [weight, setWeight] = useState<number>(currentUser?.weight || 65.5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // BMI formula: weight (kg) / (height (m))^2
  const heightM = height / 100;
  const bmi = heightM > 0 ? +(weight / (heightM * heightM)).toFixed(1) : 0;

  let category = 'Normal';
  let categoryColor = 'text-[#596044]';
  let badgeBg = 'bg-[#596044]/15 border-[#596044]/30';
  let scalePos = 50;

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = 'text-blue-600';
    badgeBg = 'bg-blue-100 border-blue-200';
    scalePos = Math.max(5, (bmi / 18.5) * 25);
  } else if (bmi <= 24.9) {
    category = 'Normal Weight';
    categoryColor = 'text-green-700';
    badgeBg = 'bg-green-100 border-green-200';
    scalePos = 25 + ((bmi - 18.5) / 6.4) * 25;
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    categoryColor = 'text-[#C87555]';
    badgeBg = 'bg-[#C87555]/15 border-[#C87555]/30';
    scalePos = 50 + ((bmi - 25) / 4.9) * 25;
  } else {
    category = 'Obesity Range';
    categoryColor = 'text-red-700';
    badgeBg = 'bg-red-100 border-red-200';
    scalePos = Math.min(95, 75 + ((bmi - 30) / 10) * 20);
  }

  const handleSaveToProfile = () => {
    updateCurrentUser({ height, weight });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentPage('user-dashboard')}
          className="p-2 rounded-full bg-white border border-[#E7DFD1] text-[#303528] hover:bg-[#E7DFD1] transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#596044]">
            BIOMETRIC SCREENING
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-[#303528]">
            Interactive BMI Calculator
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-6">
          <h3 className="text-lg font-bold font-editorial text-[#303528] border-b border-[#E7DFD1] pb-3">
            Enter Biometrics
          </h3>

          {/* Height Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase text-gray-700">Height (cm)</label>
              <span className="text-base font-bold text-[#303528]">{height} cm</span>
            </div>
            <input
              type="range"
              min="120"
              max="220"
              step="1"
              value={height}
              onChange={e => setHeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#E7DFD1] rounded-lg appearance-none cursor-pointer accent-[#596044]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>120 cm</span>
              <span>170 cm</span>
              <span>220 cm</span>
            </div>
          </div>

          {/* Weight Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase text-gray-700">Weight (kg)</label>
              <span className="text-base font-bold text-[#303528]">{weight} kg</span>
            </div>
            <input
              type="range"
              min="35"
              max="160"
              step="0.5"
              value={weight}
              onChange={e => setWeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#E7DFD1] rounded-lg appearance-none cursor-pointer accent-[#596044]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>35 kg</span>
              <span>90 kg</span>
              <span>160 kg</span>
            </div>
          </div>

          <button
            onClick={handleSaveToProfile}
            className="w-full py-3.5 rounded-full bg-[#596044] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#303528] transition flex items-center justify-center gap-2"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span>SAVED TO PROFILE!</span>
              </>
            ) : (
              <>
                <Scale className="w-4 h-4" />
                <span>SAVE MEASUREMENT TO PROFILE</span>
              </>
            )}
          </button>
        </div>

        {/* Right Results & Visual Gauge */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold font-editorial text-[#303528] border-b border-[#E7DFD1] pb-3">
              Your BMI Screening Result
            </h3>

            <div className="text-center py-6">
              <div className="text-5xl sm:text-6xl font-bold font-editorial text-[#303528] tracking-tight">
                {bmi}
              </div>
              <div
                className={`inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeBg} ${categoryColor}`}
              >
                {category}
              </div>
            </div>

            {/* Visual Gauge Scale */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
              <div className="relative h-4 rounded-full overflow-hidden flex bg-gray-100">
                <div className="w-1/4 bg-blue-300"></div>
                <div className="w-1/4 bg-green-500"></div>
                <div className="w-1/4 bg-[#C87555]"></div>
                <div className="w-1/4 bg-red-400"></div>
                {/* Needle Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-2 bg-[#303528] rounded-full shadow-md transform -translate-x-1/2 border border-white transition-all duration-300"
                  style={{ left: `${scalePos}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>&lt; 18.5</span>
                <span>18.5 - 24.9</span>
                <span>25.0 - 29.9</span>
                <span>30.0+</span>
              </div>
            </div>
          </div>

          {/* Informational Disclaimer as mandated */}
          <div className="p-4 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs text-[#1E211B]/80 leading-relaxed flex items-start gap-3">
            <Info className="w-5 h-5 text-[#596044] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#303528] block mb-1">Informational Health Note:</strong>
              Body Mass Index (BMI) is a general population screening indicator and not a diagnostic tool. It does not differentiate between lean skeletal muscle mass, bone density, or body fat distribution. For personalized medical assessments, please consult a qualified healthcare provider.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

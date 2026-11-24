import React from 'react';
import { ShieldCheck, Sparkles, HeartPulse, Award } from 'lucide-react';
import { STUDIO_MEDIA } from '../assets/media';
import { SafeImage } from '../components/SafeImage';

interface AboutPageProps {
  setCurrentPage: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <div className="bg-[#F5F0E7] min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
          Our Philosophy
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold font-editorial text-[#303528] text-balance">
          Stronger habits, steadier progress.
        </h1>
        <p className="text-base sm:text-lg text-[#1E211B]/75 leading-relaxed">
          FITVORA started with a simple idea: staying strong should feel sustainable and clear—built around real schedules, honest recovery, and meals you enjoy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white rounded-3xl p-8 sm:p-12 border border-[#E7DFD1] shadow-xs">
        <div className="lg:col-span-6 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C87555]">
            How We Coach
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#303528]">
            Training built to last through busy weeks
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Most fitness apps reward burnout and streak anxiety. We focus on repeatable strength progressions, realistic protein and hydration targets, and mobility work that helps you feel better between sessions.
          </p>
          <div className="space-y-3 pt-2">
            {[
              'Progressive strength plans you can repeat weekly',
              'Flexible nutrition without banned food lists',
              'Short recovery flows for tight joints and stiff backs',
              'Practical coaching check-ins when life gets busy'
            ].map((pt, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#596044]/15 flex items-center justify-center text-[#596044] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#303528]">{pt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-[4/3] bg-[#E7DFD1]">
            <SafeImage
              src={STUDIO_MEDIA.programMobility}
              alt="Quiet wooden studio for stretching and movement"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-[#E7DFD1] shadow-xs space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[#596044]/15 text-[#596044] flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#303528]">Everyday Energy</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Steady aerobic conditioning and sleep-friendly training loads so workouts leave you energized rather than drained.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E7DFD1] shadow-xs space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[#C87555]/15 text-[#C87555] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#303528]">Joint Resilience</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Controlled tempo, clean form cues, and balanced push-pull programming that keep knees, hips, and shoulders feeling solid.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E7DFD1] shadow-xs space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[#303528]/10 text-[#303528] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#303528]">Thoughtful Adjustments</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Swap movements, scale volume when you are tired, and get clear meal ideas tailored to your day.
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ArrowRight,
  Star,
  Dumbbell,
  Flower2,
  Salad,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { SUCCESS_STORIES } from '../data/initialData';
import { STUDIO_MEDIA } from '../assets/media';
import { SafeImage } from '../components/SafeImage';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  return (
    <div className="bg-[#F5F0E7] text-[#1E211B] overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#596044]">
              Training · Nutrition · Recovery
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-[#1E211B] leading-[1.08] tracking-tight text-balance">
              Build lasting strength,{' '}
              <span className="text-[#596044] italic font-normal">one steady week</span>{' '}
              at a time.
            </h1>

            <p className="text-base sm:text-lg text-[#1E211B]/80 max-w-xl leading-relaxed">
              FITVORA brings your weekly training plan, everyday meals, hydration, and coaching notes into one quiet, practical space built for real life.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => setCurrentPage('register')}
                className="px-7 py-3.5 rounded-full bg-[#596044] text-white text-sm font-semibold hover:bg-[#303528] transition duration-200 shadow-sm flex items-center justify-center gap-2 group whitespace-nowrap cursor-pointer"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentPage('programs')}
                className="px-7 py-3.5 rounded-full bg-white border border-[#E7DFD1] text-[#303528] text-sm font-semibold hover:bg-[#E7DFD1]/60 transition duration-200 text-center whitespace-nowrap cursor-pointer"
              >
                Browse Programs
              </button>
            </div>

            <div className="pt-5 flex flex-wrap items-center gap-6 text-xs text-[#303528]/80 font-medium border-t border-[#E7DFD1]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#596044]" />
                Structured by certified coaches
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C87555]" />
                Personalized workout &amp; meal guidance
              </span>
            </div>
          </div>

          {/* Right Column: Clean Studio Photograph (no overlapping floating badges) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/5] bg-[#E7DFD1]">
              <SafeImage
                src={STUDIO_MEDIA.heroStudio}
                alt="Woman resting peacefully after a morning workout in warm studio light"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#303528]/65 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-medium text-[#E7DFD1]">
                  Morning Rhythm
                </span>
                <p className="font-editorial text-2xl font-semibold mt-0.5">
                  Strength, mobility, and unhurried recovery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMMUNITY STRIP */}
      <section className="bg-white/70 border-y border-[#E7DFD1] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
              Member Feedback
            </p>
            <h2 className="text-lg sm:text-xl font-bold font-editorial text-[#303528] mt-0.5">
              Built around habits people actually stick with
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-[#F5F0E7] px-5 py-3 rounded-2xl border border-[#E7DFD1]">
            <div className="flex items-center text-[#C87555] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <div className="border-l border-[#E7DFD1] pl-4">
              <span className="text-xs font-semibold text-[#303528] tabular-nums">
                4.9 / 5 rating across 12-week coaching cohorts
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROGRAMS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
            Core Tracks
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#1E211B] mt-2 mb-3 text-balance">
            Programs tailored to your pace
          </h2>
          <p className="text-sm sm:text-base text-[#1E211B]/75">
            Pick a clear weekly structure instead of guessing what to do when you walk into the gym.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-3xl overflow-hidden border border-[#E7DFD1] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="h-56 overflow-hidden relative bg-[#E7DFD1]">
              <SafeImage
                src={STUDIO_MEDIA.programStrength}
                alt="Kettlebells and wood training studio for strength sessions"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#596044] shadow-xs">
                <Dumbbell className="w-5 h-5" />
              </div>
            </div>
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#596044]">Strength &amp; Foundations</p>
                <h3 className="font-editorial text-2xl font-bold text-[#1E211B] mt-1 mb-2.5">
                  Personal Strength
                </h3>
                <p className="text-sm text-[#1E211B]/75 leading-relaxed mb-6">
                  Compound lifts, clear rep targets, and steady weekly progression you can follow at home or in the gym.
                </p>
              </div>
              <button
                onClick={() => setCurrentPage('programs')}
                className="w-full py-3 px-4 rounded-full border border-[#596044] text-[#596044] text-xs font-semibold hover:bg-[#596044] hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Program</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="group bg-white rounded-3xl overflow-hidden border border-[#E7DFD1] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="h-56 overflow-hidden relative bg-[#E7DFD1]">
              <SafeImage
                src={STUDIO_MEDIA.programMobility}
                alt="Sunlit wooden studio for morning stretching and mobility"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#596044] shadow-xs">
                <Flower2 className="w-5 h-5" />
              </div>
            </div>
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#596044]">Mobility &amp; Recovery</p>
                <h3 className="font-editorial text-2xl font-bold text-[#1E211B] mt-1 mb-2.5">
                  Mind &amp; Mobility
                </h3>
                <p className="text-sm text-[#1E211B]/75 leading-relaxed mb-6">
                  Gentle 20-to-30 minute sessions for tight hips, stiff shoulders, and winding down after long desk days.
                </p>
              </div>
              <button
                onClick={() => setCurrentPage('programs')}
                className="w-full py-3 px-4 rounded-full border border-[#596044] text-[#596044] text-xs font-semibold hover:bg-[#596044] hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Program</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="group bg-white rounded-3xl overflow-hidden border border-[#E7DFD1] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="h-56 overflow-hidden relative bg-[#E7DFD1]">
              <SafeImage
                src={STUDIO_MEDIA.programNutrition}
                alt="Fresh salmon, greens, and roasted sweet potato grain bowl"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#596044] shadow-xs">
                <Salad className="w-5 h-5" />
              </div>
            </div>
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#596044]">Food &amp; Hydration</p>
                <h3 className="font-editorial text-2xl font-bold text-[#1E211B] mt-1 mb-2.5">
                  Everyday Nutrition
                </h3>
                <p className="text-sm text-[#1E211B]/75 leading-relaxed mb-6">
                  Flexible meal logs, realistic protein targets, and daily water reminders without rigid food rules.
                </p>
              </div>
              <button
                onClick={() => setCurrentPage('programs')}
                className="w-full py-3 px-4 rounded-full border border-[#596044] text-[#596044] text-xs font-semibold hover:bg-[#596044] hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Program</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURE SPLIT SECTION */}
      <section className="py-20 bg-white border-y border-[#E7DFD1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E7DFD1] aspect-[4/3] bg-[#E7DFD1]">
                <SafeImage
                  src={STUDIO_MEDIA.programMobility}
                  alt="Calm training studio floor with yoga mat and natural light"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
                Everything in One Place
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#1E211B] leading-tight text-balance">
                Clear tools that stay out of your way
              </h2>
              <p className="text-base text-[#1E211B]/75 leading-relaxed">
                Plan your week on Sunday, check off sets as you train, log simple meals, and ask our coach when you want to swap an exercise or adjust recovery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  'Weekly workout schedule',
                  'Exercise form & safety notes',
                  'Meal & macro log',
                  'Weight & body trend charts',
                  'Daily water tracker',
                  '1-on-1 coach booking'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F0E7]">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#596044] shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-[#303528]">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage('about')}
                  className="px-7 py-3.5 rounded-full bg-[#303528] text-white text-xs font-semibold hover:bg-[#596044] transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Read Our Philosophy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. METRICS STRIP */}
      <section className="py-16 bg-[#303528] text-[#F5F0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="px-4">
              <div className="font-editorial text-4xl sm:text-5xl font-bold text-[#F5F0E7] tabular-nums">
                10,000+
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C87555] mt-2">
                Sessions Logged
              </p>
            </div>

            <div className="px-4">
              <div className="font-editorial text-4xl sm:text-5xl font-bold text-[#F5F0E7] tabular-nums">
                5,000+
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C87555] mt-2">
                Active Members
              </p>
            </div>

            <div className="px-4">
              <div className="font-editorial text-4xl sm:text-5xl font-bold text-[#F5F0E7] tabular-nums">
                45 min
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C87555] mt-2">
                Average Workout
              </p>
            </div>

            <div className="px-4">
              <div className="font-editorial text-4xl sm:text-5xl font-bold text-[#F5F0E7] tabular-nums">
                95%
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C87555] mt-2">
                12-Week Consistency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MEMBER STORIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
              Member Notes
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#1E211B] mt-1">
              Steady progress in everyday routines
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('stories')}
            className="mt-4 md:mt-0 text-xs font-semibold text-[#596044] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Read all stories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUCCESS_STORIES.map(story => (
            <div
              key={story.id}
              className="bg-white rounded-3xl p-7 border border-[#E7DFD1] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <SafeImage
                    src={story.avatar}
                    alt={story.name}
                    fallbackLabel={story.name}
                    variant="avatar"
                    className="w-12 h-12 rounded-full object-cover border border-[#E7DFD1]"
                  />
                  <div>
                    <h4 className="font-semibold text-[#1E211B] text-base">{story.name}</h4>
                    <span className="text-xs text-[#596044] font-medium">{story.goal}</span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#C87555] mb-3">{story.result}</p>

                <p className="text-sm text-[#1E211B]/80 leading-relaxed">
                  "{story.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E7DFD1] flex items-center justify-between text-xs text-gray-500">
                <span>12-Week Program</span>
                <div className="flex text-[#C87555]">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden bg-[#303528]">
        <SafeImage
          src={STUDIO_MEDIA.programStrength}
          alt="Training equipment in warm light"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative max-w-2xl mx-auto space-y-5 z-10">
          <h2 className="text-3xl sm:text-5xl font-bold font-editorial leading-tight text-balance">
            Start with a week you can actually keep.
          </h2>
          <p className="text-base text-[#E7DFD1]/90 leading-relaxed">
            Set up your training schedule, calorie baseline, and coaching goals in a couple of minutes.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3.5">
            <button
              onClick={() => setCurrentPage('register')}
              className="px-8 py-3.5 rounded-full bg-[#C87555] text-white text-sm font-semibold hover:bg-[#b06346] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage('trainers')}
              className="px-8 py-3.5 rounded-full bg-white/10 border border-white/30 text-white text-sm font-semibold hover:bg-white/20 transition cursor-pointer"
            >
              Meet the Coaches
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

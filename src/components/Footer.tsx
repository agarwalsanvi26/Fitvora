import React, { useState } from 'react';
import { Dumbbell, ArrowRight, Instagram, Facebook, Youtube, Linkedin, Check } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const navTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#303528] text-[#F5F0E7] pt-16 pb-12 border-t border-[#596044]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#596044]/40">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#596044] text-[#F5F0E7] flex items-center justify-center">
                <Dumbbell className="w-4.5 h-4.5" />
              </div>
              <span className="font-logo text-2xl font-bold tracking-widest text-[#F5F0E7]">
                FITVORA
              </span>
            </div>
            <p className="text-sm text-[#C87555] font-medium">
              Stronger habits, quieter tools, steadier progress.
            </p>
            <p className="text-sm text-[#E7DFD1]/80 max-w-sm leading-relaxed">
              Practical training plans, straightforward nutrition tracking, and real coaches designed to fit normal life.
            </p>

            {/* Weekly Note */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-[#E7DFD1] mb-2">
                Weekly training notes
              </span>
              <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/10 text-white placeholder-[#E7DFD1]/50 text-xs border border-white/20 focus:outline-hidden focus:border-[#C87555] transition"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#C87555] text-white text-xs font-semibold hover:bg-[#b06346] transition flex items-center gap-1.5 whitespace-nowrap"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <span>Join</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-[#E7DFD1] mt-2">
                  Thanks for joining. You will hear from us once a week.
                </p>
              )}
            </div>
          </div>

          {/* Studio */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C87555] mb-4">
              Studio
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E7DFD1]/80">
              <li>
                <button onClick={() => navTo('about')} className="hover:text-white transition">
                  About FITVORA
                </button>
              </li>
              <li>
                <button onClick={() => navTo('programs')} className="hover:text-white transition">
                  Programs
                </button>
              </li>
              <li>
                <button onClick={() => navTo('trainers')} className="hover:text-white transition">
                  Coaches
                </button>
              </li>
              <li>
                <button onClick={() => navTo('contact')} className="hover:text-white transition">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C87555] mb-4">
              Training Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E7DFD1]/80">
              <li>
                <button onClick={() => navTo('workout-planner')} className="hover:text-white transition">
                  Workout Planner
                </button>
              </li>
              <li>
                <button onClick={() => navTo('exercises')} className="hover:text-white transition">
                  Exercise Library
                </button>
              </li>
              <li>
                <button onClick={() => navTo('diet')} className="hover:text-white transition">
                  Nutrition Log
                </button>
              </li>
              <li>
                <button onClick={() => navTo('progress')} className="hover:text-white transition">
                  Progress Charts
                </button>
              </li>
              <li>
                <button onClick={() => navTo('challenges')} className="hover:text-white transition">
                  Challenges
                </button>
              </li>
              <li>
                <button onClick={() => navTo('bmi')} className="hover:text-white transition">
                  BMI Calculator
                </button>
              </li>
              <li>
                <button onClick={() => navTo('calorie-calc')} className="hover:text-white transition">
                  Calorie Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C87555] mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E7DFD1]/80">
              <li>
                <button onClick={() => navTo('blog')} className="hover:text-white transition">
                  Journal
                </button>
              </li>
              <li>
                <button onClick={() => navTo('stories')} className="hover:text-white transition">
                  Member Stories
                </button>
              </li>
              <li>
                <button onClick={() => navTo('ai-coach')} className="hover:text-white transition">
                  Training Coach
                </button>
              </li>
              <li>
                <button onClick={() => navTo('java-rubric')} className="hover:text-white transition">
                  Backend &amp; DB Lab
                </button>
              </li>
            </ul>

            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C87555] mt-6 mb-3">
              Follow
            </h4>
            <div className="flex items-center space-x-3 text-[#E7DFD1]/80">
              <a
                href="#instagram"
                className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E7DFD1]/60">
          <p>© 2026 FITVORA. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span className="cursor-pointer hover:text-white transition" onClick={() => navTo('about')}>
              Privacy
            </span>
            <span className="cursor-pointer hover:text-white transition" onClick={() => navTo('about')}>
              Terms
            </span>
            <span className="cursor-pointer hover:text-white transition" onClick={() => navTo('contact')}>
              Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

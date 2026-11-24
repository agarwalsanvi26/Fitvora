import React from 'react';
import { SUCCESS_STORIES } from '../data/initialData';
import { Star, ArrowRight, Quote, Award } from 'lucide-react';

interface SuccessStoriesPageProps {
  setCurrentPage: (page: string) => void;
}

export const SuccessStoriesPage: React.FC<SuccessStoriesPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#596044]">
          LIVED EXPERIENCES
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#303528] mt-2 mb-4">
          Real People. Real Transformations.
        </h1>
        <p className="text-sm sm:text-base text-[#1E211B]/75 leading-relaxed">
          From competitive triathletes recovering from injury to working parents rediscovering energy. Explore honest reviews and documented results from verified FITVORA members.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SUCCESS_STORIES.map(story => (
          <div
            key={story.id}
            className="bg-white rounded-3xl p-8 border border-[#E7DFD1] shadow-xs flex flex-col justify-between hover:shadow-xl transition"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#596044]"
                />
                <div>
                  <h4 className="font-bold text-[#1E211B] text-lg">{story.name}</h4>
                  <span className="text-xs text-[#596044] font-semibold">{story.goal}</span>
                  <div className="flex text-[#C87555] mt-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#596044]/15 text-[#596044] text-xs font-bold mb-4">
                {story.result}
              </div>

              <p className="text-sm text-gray-700 italic leading-relaxed">
                "{story.quote}"
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E7DFD1] flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Program: 12-Week Protocol</span>
              <span className="text-green-700 font-bold">Verified Member</span>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Card */}
      <div className="bg-[#303528] text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold font-editorial">
          Ready to write your own chapter?
        </h2>
        <p className="text-sm sm:text-base text-[#E7DFD1]/80 max-w-xl mx-auto">
          Start your personalized fitness plan today with our interactive planner and intelligent coach.
        </p>
        <button
          onClick={() => setCurrentPage('register')}
          className="px-8 py-3.5 rounded-full bg-[#C87555] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b06346] transition inline-flex items-center gap-2"
        >
          <span>BEGIN NOW</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

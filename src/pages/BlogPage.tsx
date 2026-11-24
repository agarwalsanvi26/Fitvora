import React, { useState } from 'react';
import { BLOG_ARTICLES } from '../data/initialData';
import { BlogArticle } from '../types';
import { SafeImage } from '../components/SafeImage';
import { Clock, Calendar, ArrowRight, X } from 'lucide-react';

interface BlogPageProps {
  setCurrentPage: (page: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = () => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
          Notes &amp; Guides
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#303528] mt-2 mb-4">
          The FITVORA Journal
        </h1>
        <p className="text-sm sm:text-base text-[#1E211B]/75 leading-relaxed">
          Practical reading on strength progression, everyday nutrition, and recovery habits.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_ARTICLES.map(art => (
          <div
            key={art.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E7DFD1] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="h-56 relative overflow-hidden bg-[#E7DFD1]">
                <SafeImage
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-semibold text-[#596044]">
                  {art.category}
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 font-medium tabular-nums">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#596044]" />
                    {art.publishedDate}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#596044]" />
                    {art.readTimeMinutes} min read
                  </span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#303528] mb-3 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">{art.summary}</p>
              </div>
            </div>

            <div className="p-6 pt-3 flex justify-between items-center border-t border-[#E7DFD1]">
              <span className="text-xs font-semibold text-[#596044]">{art.author}</span>
              <button
                onClick={() => setSelectedArticle(art)}
                className="text-xs font-semibold text-[#C87555] hover:text-[#b06346] flex items-center gap-1 cursor-pointer"
              >
                <span>Read</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E7DFD1] p-6 sm:p-10 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-[#596044]">
                  {selectedArticle.category} · {selectedArticle.readTimeMinutes} min read
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#303528] mt-1">
                  {selectedArticle.title}
                </h2>
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  By {selectedArticle.author} on {selectedArticle.publishedDate}
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-full text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SafeImage
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full h-72 object-cover rounded-2xl"
            />

            <div className="prose prose-sm text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
              <p className="font-semibold text-base text-[#303528] italic">
                "{selectedArticle.summary}"
              </p>
              <p>
                Scientific inquiry demonstrates that the human neuromuscular system responds primarily to deliberate stimulus variability combined with adequate systemic recovery. When we program resistance training, the mechanical tension experienced by individual myofibrils triggers molecular signaling cascades that initiate protein synthesis.
              </p>
              <p>
                Equally critical is sleep architecture. Growth hormone secretion peaks during Slow-Wave Sleep (Stage 3 & 4), facilitating cellular repair and glycemic stabilization. Without 7 to 9 hours of unfragmented sleep, muscular adaptations diminish regardless of training intensity.
              </p>
              <p>
                In conclusion, long-term longevity is best cultivated not through extreme bouts of exhaustion, but through consistent, progressive micro-habits sustained across decades.
              </p>
            </div>

            <div className="pt-6 border-t border-[#E7DFD1] flex justify-between items-center">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-[#596044] text-white text-xs font-bold uppercase tracking-wider"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

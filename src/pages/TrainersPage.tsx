import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trainer } from '../types';
import { SafeImage } from '../components/SafeImage';
import {
  Star,
  Calendar,
  CheckCircle2,
  X
} from 'lucide-react';

interface TrainersPageProps {
  setCurrentPage: (page: string) => void;
}

export const TrainersPage: React.FC<TrainersPageProps> = () => {
  const { trainers, bookAppointment } = useApp();

  const [bookingTrainer, setBookingTrainer] = useState<Trainer | null>(null);
  const [sessionType, setSessionType] = useState<'1-on-1 Fitness' | 'Nutrition Consultation' | 'Form Assessment' | 'Mobility & Recovery'>('1-on-1 Fitness');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTrainer) return;
    bookAppointment({
      trainerId: bookingTrainer.id,
      trainerName: bookingTrainer.name,
      date: bookingDate,
      time: bookingTime,
      sessionType,
      message: bookingMessage.trim() || 'Private coaching consultation'
    });
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setBookingMessage('');
      setBookingTrainer(null);
    }, 2000);
  };

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
          Coaching Team
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#303528] mt-2 mb-4">
          Coaches &amp; Specialists
        </h1>
        <p className="text-sm sm:text-base text-[#1E211B]/75 leading-relaxed">
          Book a 1-on-1 form check, nutrition review, or custom training check-in with certified FITVORA practitioners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.map(t => (
          <div
            key={t.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E7DFD1] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="h-64 relative overflow-hidden bg-[#E7DFD1]">
                <SafeImage
                  src={t.imageUrl}
                  alt={t.name}
                  fallbackLabel={t.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold text-[#C87555] tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{t.rating} ({t.reviewsCount})</span>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <div className="text-xs font-semibold text-[#596044]">
                  {t.credentials}
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#303528] mt-1 mb-2">
                  {t.name}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(t.specialties || [t.specialization]).map(spec => (
                    <span
                      key={spec}
                      className="px-2.5 py-0.5 rounded-full bg-[#F5F0E7] text-[#303528] text-xs font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">{t.bio}</p>

                <div className="pt-4 border-t border-[#E7DFD1] flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Session rate</span>
                  <span className="font-editorial text-lg font-bold text-[#303528] tabular-nums">
                    ${t.hourlyRate} <span className="text-xs font-sans font-normal text-gray-500">/ hr</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => setBookingTrainer(t)}
                className="w-full py-3 rounded-full bg-[#596044] text-white text-xs font-semibold hover:bg-[#303528] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Session</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {bookingTrainer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#E7DFD1] p-6 sm:p-8 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-[#E7DFD1]">
              <div>
                <p className="text-xs font-semibold text-[#596044]">Private Consultation</p>
                <h3 className="font-bold font-editorial text-xl text-[#303528]">
                  Book {bookingTrainer.name}
                </h3>
              </div>
              <button onClick={() => setBookingTrainer(null)} className="text-gray-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-editorial text-xl font-bold text-[#303528]">
                  Session Requested
                </h4>
                <p className="text-xs text-gray-600 max-w-xs mx-auto">
                  Your request with {bookingTrainer.name} has been added to your updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Session Focus
                  </label>
                  <select
                    value={sessionType}
                    onChange={e => setSessionType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-semibold"
                  >
                    <option value="1-on-1 Fitness">1-on-1 Strength &amp; Conditioning</option>
                    <option value="Form Assessment">Form Assessment</option>
                    <option value="Nutrition Consultation">Nutrition Consultation</option>
                    <option value="Mobility & Recovery">Mobility &amp; Recovery</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={e => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Time</label>
                    <select
                      value={bookingTime}
                      onChange={e => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-semibold"
                    >
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Notes (optional)</label>
                  <input
                    type="text"
                    value={bookingMessage}
                    onChange={e => setBookingMessage(e.target.value)}
                    placeholder="What would you like to work on?"
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs"
                  />
                </div>

                <div className="pt-2 border-t border-[#E7DFD1] flex justify-between items-center text-xs">
                  <span className="text-gray-500">Rate</span>
                  <span className="font-bold text-[#303528] tabular-nums">${bookingTrainer.hourlyRate} USD</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#C87555] text-white text-xs font-semibold hover:bg-[#b06346] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

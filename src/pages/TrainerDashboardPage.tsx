import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Video,
  Star,
  X
} from 'lucide-react';

interface TrainerDashboardPageProps {
  setCurrentPage: (page: string) => void;
}

export const TrainerDashboardPage: React.FC<TrainerDashboardPageProps> = () => {
  const [sessions, setSessions] = useState([
    {
      id: 'sess_1',
      clientName: 'Elena Vance',
      type: '1-on-1 Form & Technique Review',
      date: 'Today',
      time: '10:00 AM',
      status: 'Upcoming',
      notes: 'Check ankle mobility and bar path on back squats.'
    },
    {
      id: 'sess_2',
      clientName: 'David Miller',
      type: 'Strength Program Check-in',
      date: 'Today',
      time: '02:30 PM',
      status: 'Upcoming',
      notes: 'Review shoulder press volume from last week.'
    },
    {
      id: 'sess_3',
      clientName: 'Chloe Chen',
      type: 'Mobility & Hip Reset',
      date: 'Tomorrow',
      time: '09:00 AM',
      status: 'Scheduled',
      notes: 'Easy recovery work ahead of weekend long run.'
    }
  ]);

  const [activeVideoSession, setActiveVideoSession] = useState<{ id: string; clientName: string; type: string } | null>(null);

  const handleCompleteSession = (id: string) => {
    setSessions(prev => prev.map(s => (s.id === id ? { ...s, status: 'Completed' } : s)));
  };

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#596044]">
            Coaching Desk
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-[#303528] mt-1">
            Sessions &amp; Clients
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Upcoming consultations, session notes, and form check-ins.
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl border border-[#E7DFD1] text-xs font-semibold text-[#303528] flex items-center gap-2 tabular-nums">
          <Star className="w-4 h-4 text-[#C87555] fill-current" />
          <span>4.9 average rating (42 client reviews)</span>
        </div>
      </div>

      {activeVideoSession && (
        <div className="bg-[#303528] text-white rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#596044]">
          <div>
            <p className="text-xs font-semibold text-[#C87555]">Live Consultation Room</p>
            <h3 className="text-lg font-editorial font-bold mt-0.5">
              Connected with {activeVideoSession.clientName} — {activeVideoSession.type}
            </h3>
          </div>
          <button
            onClick={() => setActiveVideoSession(null)}
            className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Leave Room</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E7DFD1] shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Upcoming Sessions</span>
          <div className="text-3xl font-bold font-editorial text-[#303528] mt-1 tabular-nums">
            {sessions.filter(s => s.status !== 'Completed').length}
          </div>
          <span className="text-xs text-[#596044] font-medium">2 scheduled for today</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E7DFD1] shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Active Clients</span>
          <div className="text-3xl font-bold font-editorial text-[#303528] mt-1 tabular-nums">18</div>
          <span className="text-xs text-emerald-700 font-medium">1-on-1 coaching</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E7DFD1] shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Monthly Hours</span>
          <div className="text-3xl font-bold font-editorial text-[#303528] mt-1 tabular-nums">36 hrs</div>
          <span className="text-xs text-[#C87555] font-medium">Target: 40 hrs</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-[#E7DFD1]">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#303528]">Scheduled Consultations</h3>
            <p className="text-xs text-gray-500">Client check-ins and technique sessions.</p>
          </div>
          <span className="text-xs font-semibold text-[#596044] bg-[#E7DFD1] px-3 py-1 rounded-full">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="space-y-4">
          {sessions.map(sess => (
            <div
              key={sess.id}
              className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                sess.status === 'Completed'
                  ? 'bg-gray-50 border-gray-200 opacity-65'
                  : 'bg-[#F5F0E7] border-[#E7DFD1]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#E7DFD1] flex items-center justify-center text-[#596044] shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-bold text-base text-[#303528]">{sess.clientName}</h4>
                    <span className="text-xs font-medium text-[#596044]">{sess.status}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">{sess.type}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#596044]" />
                      {sess.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-[#596044]" />
                      {sess.time}
                    </span>
                  </div>
                  {sess.notes && (
                    <p className="text-xs text-gray-600 bg-white/80 p-2.5 rounded-xl mt-2.5 border border-[#E7DFD1]">
                      <strong className="text-[#303528]">Note:</strong> {sess.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {sess.status !== 'Completed' && (
                  <>
                    <button
                      onClick={() =>
                        setActiveVideoSession({
                          id: sess.id,
                          clientName: sess.clientName,
                          type: sess.type
                        })
                      }
                      className="px-4 py-2.5 rounded-full bg-[#596044] text-white text-xs font-semibold hover:bg-[#303528] transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </button>
                    <button
                      onClick={() => handleCompleteSession(sess.id)}
                      className="px-4 py-2.5 rounded-full bg-white border border-[#E7DFD1] text-[#303528] text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

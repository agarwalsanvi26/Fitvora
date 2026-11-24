import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  setCurrentPage: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Membership Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#596044]">
          MEMBER CONCIERGE
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#303528] mt-2 mb-4">
          Connect With FITVORA
        </h1>
        <p className="text-sm sm:text-base text-[#1E211B]/75 leading-relaxed">
          Questions regarding your training program, custom nutrition guidelines, or private trainer bookings? Our dedicated team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#E7DFD1] shadow-xs">
          <h3 className="font-editorial text-2xl font-bold text-[#303528] mb-6">Send an Inquiry</h3>

          {submitted ? (
            <div className="p-8 text-center bg-[#F5F0E7] rounded-2xl border border-[#E7DFD1] space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#596044] mx-auto" />
              <h4 className="font-editorial text-xl font-bold text-[#303528]">Message Received</h4>
              <p className="text-xs text-gray-600">
                Thank you for contacting FITVORA. An advisor will respond within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Elena Vance"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-medium text-[#303528]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="elena@fitvora.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-medium text-[#303528]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs font-bold text-[#303528]"
                >
                  <option value="General Membership Inquiry">General Membership Inquiry</option>
                  <option value="Personal Trainer Consultation">Personal Trainer Consultation</option>
                  <option value="Nutrition Protocol Support">Nutrition Protocol Support</option>
                  <option value="Technical & Platform Feedback">Technical & Platform Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can we assist your athletic and wellness journey?"
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs text-[#303528]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#596044] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#303528] transition flex items-center justify-center gap-2 mt-4"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Info & Concierge Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-[#E7DFD1] shadow-xs space-y-6">
            <h3 className="font-editorial text-xl font-bold text-[#303528]">Concierge Details</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#596044] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#303528] block">Electronic Dispatch</span>
                  <span className="text-gray-600">concierge@fitvora.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#596044] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#303528] block">Advisory Hotline</span>
                  <span className="text-gray-600">+1 (800) 555-VORA (Mon–Fri, 8am–6pm EST)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#596044] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#303528] block">Global Headquarters</span>
                  <span className="text-gray-600">742 Evergreen Wellness Terrace, Suite 400, Boulder, CO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Mini-Box */}
          <div className="bg-[#303528] text-white rounded-3xl p-8 space-y-4">
            <h4 className="font-editorial text-lg font-bold text-[#F5F0E7]">
              Frequently Asked
            </h4>
            <div className="space-y-2 text-xs text-[#E7DFD1]/80">
              <p><strong>Q: Can I change my fitness goals anytime?</strong></p>
              <p className="text-gray-300">Yes! Navigate to Profile or the Calorie Calculator to recalibrate anytime.</p>
              <p className="pt-2"><strong>Q: Are workouts suitable for home gyms?</strong></p>
              <p className="text-gray-300">All programs offer dumbbell, bodyweight, and full-rack options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

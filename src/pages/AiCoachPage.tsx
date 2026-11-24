import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  User,
  Info,
  RotateCcw,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface AiCoachPageProps {
  setCurrentPage: (page: string) => void;
}

type AnswerStyle = 'concise' | 'balanced' | 'detailed';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
  retryQuery?: string;
}

const STYLE_STORAGE_KEY = 'fitvora_coach_answer_style';

const ANSWER_STYLE_OPTIONS: Array<{ value: AnswerStyle; label: string }> = [
  { value: 'concise', label: 'Concise' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'detailed', label: 'Detailed' }
];

function buildWelcomeText(name?: string, goal?: string): string {
  const firstName = name?.trim().split(' ')[0] || 'there';
  const goalNote = goal ? ` focused on ${goal.toLowerCase()}` : '';
  return `Hi ${firstName} — tell me what you're working on today${goalNote}. We can adjust your workout split, brainstorm high-protein meals, or go over lifting form.`;
}

export const AiCoachPage: React.FC<AiCoachPageProps> = () => {
  const { currentUser } = useApp();

  const [answerStyle, setAnswerStyle] = useState<AnswerStyle>(() => {
    try {
      const saved = localStorage.getItem(STYLE_STORAGE_KEY);
      if (saved === 'concise' || saved === 'balanced' || saved === 'detailed') {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'balanced';
  });

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: buildWelcomeText(currentUser?.name, currentUser?.goal),
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Suggest a steady 3-day strength split',
    'How much protein should I aim for daily?',
    'Cues to keep my lower back steady on squats',
    'Quick post-workout dinner ideas'
  ];

  useEffect(() => {
    try {
      localStorage.setItem(STYLE_STORAGE_KEY, answerStyle);
    } catch {
      // ignore storage errors
    }
  }, [answerStyle]);

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id.startsWith('welcome_')) {
        return [
          {
            ...prev[0],
            text: buildWelcomeText(currentUser?.name, currentUser?.goal)
          }
        ];
      }
      return prev;
    });
  }, [currentUser?.name, currentUser?.goal]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (query: string, appendUserBubble: boolean) => {
    if (!query || isLoading) return;

    const historySnapshot = messages
      .filter(m => !m.id.startsWith('welcome_') && !m.isError)
      .slice(-12)
      .map(m => ({ sender: m.sender, text: m.text }));

    if (appendUserBubble) {
      const userMsg: Message = {
        id: `usr_${Date.now()}`,
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);
      setInputText('');
    } else {
      // Remove previous error bubble before retrying
      setMessages(prev => prev.filter(m => !m.isError));
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          answerStyle,
          history: historySnapshot,
          userContext: {
            name: currentUser?.name,
            weight: currentUser?.weight,
            height: currentUser?.height,
            goal: currentUser?.goal,
            fitnessLevel: currentUser?.fitnessLevel,
            activityLevel: currentUser?.activityLevel
          }
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.error === 'string' && data.error.trim()
            ? data.error
            : `AI Coach request failed (HTTP ${res.status}).`
        );
      }

      const reply = typeof data?.reply === 'string' ? data.reply.trim() : '';
      if (!reply) {
        throw new Error('The AI Coach returned an empty response. Please try again.');
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Unable to reach the AI Coach right now. Please try again.';

      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: errorMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          retryQuery: query
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;
    void sendMessage(query, true);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome_init',
        sender: 'assistant',
        text: `Fresh start — what would you like to focus on next, ${currentUser?.name?.split(' ')[0] || 'there'}?`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-80px)]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E7DFD1]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#596044] text-[#F5F0E7] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#C87555]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-editorial text-[#303528]">
              FITVORA Training Coach
            </h1>
            <p className="text-xs text-gray-500">
              Practical advice on workouts, nutrition, and recovery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center bg-white border border-[#E7DFD1] rounded-xl p-1"
            role="group"
            aria-label="Default answer style"
          >
            {ANSWER_STYLE_OPTIONS.map(option => {
              const active = answerStyle === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAnswerStyle(option.value)}
                  disabled={isLoading}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-[#596044] text-white'
                      : 'text-gray-600 hover:text-[#303528]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={clearChat}
            disabled={isLoading}
            className="p-2 rounded-xl text-gray-500 hover:text-[#303528] hover:bg-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#E7DFD1] text-xs font-medium text-[#303528] hover:bg-[#596044] hover:text-white transition whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] shadow-xs overflow-y-auto space-y-4">
        {messages.map(msg => {
          const isBot = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                isBot ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.isError
                    ? 'bg-[#C87555] text-white'
                    : isBot
                      ? 'bg-[#596044] text-white'
                      : 'bg-[#C87555] text-white'
                }`}
              >
                {msg.isError ? (
                  <AlertCircle className="w-4 h-4" />
                ) : isBot ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                  msg.isError
                    ? 'bg-[#FDF4F0] text-[#7A3520] border border-[#EBC7B8]'
                    : isBot
                      ? 'bg-[#F5F0E7] text-[#1E211B] border border-[#E7DFD1]'
                      : 'bg-[#303528] text-white'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className="flex items-center justify-between gap-3">
                  {msg.isError && msg.retryQuery ? (
                    <button
                      type="button"
                      onClick={() => void sendMessage(msg.retryQuery!, false)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9C4428] hover:text-[#303528] cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry
                    </button>
                  ) : (
                    <span />
                  )}
                  <span
                    className={`text-[10px] ${
                      msg.isError ? 'text-[#9C4428]/70' : isBot ? 'text-gray-400' : 'text-gray-300'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-[80%] self-start mr-auto items-center">
            <div className="w-8 h-8 rounded-2xl bg-[#596044] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#C87555]" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs text-gray-600">
              Writing a reply...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="space-y-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white p-2 rounded-full border border-[#E7DFD1] shadow-xs"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ask about workouts, meals, or recovery..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-xs sm:text-sm bg-transparent border-none focus:outline-hidden text-[#1E211B] placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-3 rounded-full bg-[#596044] text-white hover:bg-[#303528] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#596044] shrink-0" />
          General training and nutrition guidance. Check with a doctor if you have pain or medical concerns.
        </p>
      </div>
    </div>
  );
};

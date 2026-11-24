import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FitnessGoal, FitnessLevel } from '../types';
import { Dumbbell, ArrowRight, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthPagesProps {
  initialMode: 'login' | 'register';
  setCurrentPage: (page: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode, setCurrentPage }) => {
  const { loginWithCredentials, registerAccount, claimAdminAccount } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'claim-admin'>(initialMode);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(65.5);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('Intermediate');
  const [goal, setGoal] = useState<FitnessGoal>('Weight Loss');

  // First-run admin claim state (only offered when no admin is configured yet)
  const [adminClaimAvailable, setAdminClaimAvailable] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
  }, [initialMode]);

  useEffect(() => {
    fetch('/api/auth/admin-status')
      .then(r => r.json())
      .then(json => {
        if (json?.success && json?.data && json.data.claimed === false) {
          setAdminClaimAvailable(true);
        } else {
          setAdminClaimAvailable(false);
        }
      })
      .catch(() => setAdminClaimAvailable(false));
  }, []);

  const routeAfterAuth = (role: string) => {
    if (role === 'ADMIN') setCurrentPage('admin-dashboard');
    else if (role === 'TRAINER') setCurrentPage('trainer-dashboard');
    else setCurrentPage('user-dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    const result = await loginWithCredentials(loginEmail, loginPassword);
    setSubmitting(false);

    if (!result.ok || !result.user) {
      setErrorMsg(result.error || 'Could not sign in. Please check your email and password.');
      return;
    }
    routeAfterAuth(result.user.role);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 8) {
      setErrorMsg('Please choose a password with at least 8 characters.');
      return;
    }
    setSubmitting(true);
    const result = await registerAccount({
      name,
      email,
      password,
      weightKg: weight,
      heightCm: height,
      goal,
      fitnessLevel
    });
    setSubmitting(false);

    if (!result.ok || !result.user) {
      setErrorMsg(result.error || 'Could not complete registration.');
      return;
    }
    routeAfterAuth(result.user.role);
  };

  const handleClaimAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (adminPassword.length < 8) {
      setErrorMsg('Please choose an administrator password with at least 8 characters.');
      return;
    }
    setSubmitting(true);
    const result = await claimAdminAccount({
      name: adminName || 'Studio Administrator',
      email: adminEmail,
      password: adminPassword
    });
    setSubmitting(false);

    if (!result.ok || !result.user) {
      setErrorMsg(result.error || 'Could not initialize administrator account.');
      return;
    }
    setAdminClaimAvailable(false);
    routeAfterAuth(result.user.role);
  };

  return (
    <div className="bg-[#F5F0E7] min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E7DFD1] shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#596044] text-white flex items-center justify-center mx-auto">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-[#303528] text-balance">
            {mode === 'login'
              ? 'Sign in to FITVORA'
              : mode === 'claim-admin'
              ? 'Initial Studio Setup'
              : 'Create Your Account'}
          </h1>
          <p className="text-sm text-[#1E211B]/70">
            {mode === 'login'
              ? 'Pick up your training plan, meals, and session notes.'
              : mode === 'claim-admin'
              ? 'Set up the first administrator account for this workspace.'
              : 'Track workouts, meals, and progress in one calm place.'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex p-1 bg-[#F5F0E7] rounded-full border border-[#E7DFD1]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${
              mode === 'login' ? 'bg-[#596044] text-white' : 'text-[#303528]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${
              mode === 'register' ? 'bg-[#596044] text-white' : 'text-[#303528]'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#596044] text-white text-sm font-semibold hover:bg-[#303528] disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {adminClaimAvailable && (
              <div className="pt-3 border-t border-[#E7DFD1] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('claim-admin');
                    setErrorMsg(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#596044] hover:text-[#303528] transition"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C87555]" />
                  <span>First-time setup: claim administrator account</span>
                </button>
              </div>
            )}
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jordan Avery"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jordan@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password (min 8 characters)</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Experience</label>
                <select
                  value={fitnessLevel}
                  onChange={e => setFitnessLevel(e.target.value as FitnessLevel)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Focus</label>
                <select
                  value={goal}
                  onChange={e => setGoal(e.target.value as FitnessGoal)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Strength">Strength</option>
                  <option value="Endurance">Endurance</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#C87555] text-white text-sm font-semibold hover:bg-[#b06346] disabled:opacity-60 transition flex items-center justify-center gap-2 mt-2"
            >
              <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {mode === 'claim-admin' && (
          <form onSubmit={handleClaimAdmin} className="space-y-4">
            <div className="p-3 rounded-2xl bg-[#F5F0E7] border border-[#E7DFD1] text-xs text-[#303528]">
              This one-time setup creates the primary administrator account in SQLite. Once claimed, this form closes automatically.
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Administrator Name</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
                placeholder="Studio Administrator"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Administrator Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="admin@studio.example"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password (min 8 characters)</label>
              <input
                type="password"
                required
                minLength={8}
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] text-sm text-[#303528]"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#303528] text-white text-sm font-semibold hover:bg-[#596044] disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#C87555]" />
              <span>{submitting ? 'Setting up...' : 'Initialize Administrator'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

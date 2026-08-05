import React, { useState } from 'react';
import { api } from '../api';
import { User } from '../types';
import { UserCheck, Lock, Mail, Calendar, MapPin, Building, User as UserIcon, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import { PhoneInput } from './PhoneInput';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  darkMode?: boolean;
  setDarkMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, darkMode = false, setDarkMode }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regData, setRegData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Male',
    dob: '',
    city: '',
    institution: ''
  });
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both Email Address and Password.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await api.login(loginEmail, loginPassword);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch {
      setErrorMsg('Failed to connect to backend server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.username || !regData.email || !regData.password) {
      setErrorMsg('Username, Email and Password are required.');
      return;
    }
    if (regData.phone && !isPhoneValid) {
      setErrorMsg('Please enter a valid phone number according to the selected country format.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await api.register({
        ...regData,
        role: 'member'
      });
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch {
      setErrorMsg('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick login
  const handleQuickDemoLogin = async (email: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.login(email, 'password123');
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setErrorMsg('Demo account login error.');
      }
    } catch {
      setErrorMsg('Failed to sign in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full py-12 px-4 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#12072B] via-[#1F0A3D] to-[#2D0A54] rounded-3xl my-2 shadow-2xl border border-purple-900/40">
      
      {/* Ambient Particle Glow Orbs */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-orb-1" />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none animate-orb-3" />

      {/* Floating Glassmorphic Login Card */}
      <div className="w-full max-w-xl relative z-10 glass-panel rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 backdrop-blur-2xl transition-all duration-300">
        
        {/* Futuristic Frosted Header Badge */}
        <div className="p-8 text-center relative border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent">
          
          {/* Top Corner Dark Mode Toggle */}
          {setDarkMode && (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white border border-white/20 transition-all backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-purple-300" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          )}
          
          {/* Frosted Glass Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge text-purple-200 border border-purple-300/30 mb-4 shadow-lg animate-pulse">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-xs font-semibold tracking-wide text-purple-100">
              IET Connect Portal - Empowering Engineers & Tech Innovators
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Poppins'] drop-shadow-md">
            {isLoginView ? 'Welcome Back' : 'Join the Network'}
          </h1>
          <p className="text-xs text-purple-200/80 mt-1">
            Access global chapters, research grants, and peer engineering networks
          </p>

          {/* Toggle Pills */}
          <div className="mt-6 inline-flex bg-black/40 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md shadow-inner">
            <button
              onClick={() => { setIsLoginView(true); setErrorMsg(null); }}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isLoginView
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] scale-[1.02]'
                  : 'text-purple-200/80 hover:text-white hover:bg-white/5'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLoginView(false); setErrorMsg(null); }}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                !isLoginView
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] scale-[1.02]'
                  : 'text-purple-200/80 hover:text-white hover:bg-white/5'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-medium flex items-start gap-3 backdrop-blur-md animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoginView ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-purple-100 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-300/70 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="engineer@iet.org"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-purple-200/40 focus:bg-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 focus:shadow-[0_0_18px_rgba(168,85,247,0.4)] outline-none transition-all duration-200 backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-100 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-300/70 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-purple-200/40 focus:bg-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 focus:shadow-[0_0_18px_rgba(168,85,247,0.4)] outline-none transition-all duration-200 backdrop-blur-md"
                  />
                </div>
              </div>

              {/* High-contrast Primary Action Button with Soft Glow */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(155,81,224,0.6)] border border-purple-300/40 transition-all duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Access Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Badges (Quick Login Pills) */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-[11px] text-purple-200/70 font-medium mb-3 uppercase tracking-wider">
                  Quick Demo Login (Pre-configured Credentials)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('venkatns2008@gmail.com')}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/15 text-purple-100 text-xs font-semibold rounded-full border border-purple-300/30 hover:border-purple-300/60 shadow-md backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-300 group-hover:scale-110 transition-transform" />
                    <span>Login as Chapter Lead</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('sarah.chen@iet.org')}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/15 text-purple-100 text-xs font-semibold rounded-full border border-white/20 hover:border-purple-300/50 shadow-md backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-indigo-300 group-hover:scale-110 transition-transform" />
                    <span>Login as Student Member</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-100 mb-1">Username *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-purple-300/70 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={regData.username}
                      onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                      placeholder="Alex Mercer"
                      className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-purple-200/40 focus:bg-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-100 mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-purple-300/70 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="alex@iet.org"
                      className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-purple-200/40 focus:bg-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-100 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-purple-300/70 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-purple-200/40 focus:bg-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number Field with Country Code Selection & Validation */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-purple-100 mb-1">Phone Number</label>
                  <PhoneInput
                    value={regData.phone}
                    onChange={(fullPhone, isValid) => {
                      setRegData({ ...regData, phone: fullPhone });
                      setIsPhoneValid(isValid);
                    }}
                    darkGlass={true}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-100 mb-1">Gender</label>
                  <select
                    value={regData.gender}
                    onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-900/90 border border-white/20 rounded-xl text-xs text-white focus:border-purple-400 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-100 mb-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-purple-300/70 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="date"
                      value={regData.dob}
                      onChange={(e) => setRegData({ ...regData, dob: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-100 mb-1">City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-purple-300/70 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={regData.city}
                      onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                      placeholder="London / Chennai / NY"
                      className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-purple-200/40 focus:border-purple-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-100 mb-1">Institution / Chapter</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-purple-300/70 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={regData.institution}
                      onChange={(e) => setRegData({ ...regData, institution: e.target.value })}
                      placeholder="Imperial / MIT / SRM"
                      className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-purple-200/40 focus:border-purple-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(155,81,224,0.6)] border border-purple-300/40 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {loading ? 'Creating Member Record...' : 'Register Account'}
                {!loading && <UserCheck className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [userType, setUserType] = useState<'startup' | 'investor'>('startup');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay for effect
    setTimeout(() => {
      if (userType === 'investor') {
        navigate('/app?view=investor_dashboard');
      } else {
        navigate('/inquiry');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-500/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 mb-6 shadow-xl shadow-indigo-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-lg">Sign in to access your {userType} dashboard</p>
        </div>

        {/* User Type Toggle */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm mb-6 flex">
          <button
            onClick={() => setUserType('startup')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${userType === 'startup'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Startup Founder
          </button>
          <button
            onClick={() => setUserType('investor')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${userType === 'investor'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Investor
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans"
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full group relative flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate(userType === 'investor' ? '/investor-inquiry' : '/inquiry')}
            className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors hover:underline focus:outline-none"
          >
            {userType === 'investor' ? 'Join as Investor' : 'Create Startup Profile'}
          </button>
        </p>
      </div>
    </div>
  );
}

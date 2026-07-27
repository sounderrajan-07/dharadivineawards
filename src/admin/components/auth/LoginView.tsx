import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginView() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid credentials. Use admin / admin123 or a valid @dhara.org email.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6EE] via-[#FDFBF8] to-[#F3EEE3] dark:from-[#121310] dark:via-[#161713] dark:to-[#0F100D] flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 selection:bg-[#401C0C] selection:text-[#FFD27F]">
      <div className="w-full max-w-[480px] bg-white/70 dark:bg-[#1B1C19]/70 backdrop-blur-xl border border-[#EAE8E3]/60 dark:border-[#2E302A]/60 rounded-[2rem] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
        {/* Glow Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD27F]/10 dark:bg-[#FFD27F]/5 rounded-full filter blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#401C0C]/10 dark:bg-[#401C0C]/5 rounded-full filter blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center space-y-2 relative">
          <div className="flex justify-center">
            <div className="bg-[#401C0C] dark:bg-[#5C2913] px-5 py-2.5 rounded-2xl shadow-lg inline-flex items-center justify-center mb-2 border border-white/10">
              <span className="text-white font-serif font-bold text-lg tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-[#FFD27F]" />
                DHARA
              </span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1B1C19] dark:text-[#F3F4F6] tracking-tight leading-tight">
            Divine Awards Admin Portal
          </h2>
          <p className="text-xs sm:text-sm text-[#867463] dark:text-[#9CA3AF] font-medium max-w-sm mx-auto">
            Authorized access only. Sign in to manage submissions, coordinate volunteers, and review telemetry.
          </p>
        </div>

        {/* Alert Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-800 dark:text-red-300 font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#867463] dark:text-[#9CA3AF] block font-mono">
              Username or Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#867463] dark:text-[#6B7280]">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or name@dhara.org"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#D9CBB0]/60 dark:border-[#2E302A] bg-white/50 dark:bg-black/30 text-[#1B1C19] dark:text-[#E5E7EB] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C9A646]/50 focus:border-[#C9A646] transition-all text-sm shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#867463] dark:text-[#9CA3AF] block font-mono">
              Security Key
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#867463] dark:text-[#6B7280]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#D9CBB0]/60 dark:border-[#2E302A] bg-white/50 dark:bg-black/30 text-[#1B1C19] dark:text-[#E5E7EB] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C9A646]/50 focus:border-[#C9A646] transition-all text-sm shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#401C0C] hover:bg-[#522511] text-white py-3.5 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#401C0C] active:scale-[0.98] disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {isSubmitting ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            ) : (
              <>
                <ShieldCheck className="w-4.5 h-4.5 text-[#FFD27F]" />
                <span>Verify Credentials</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

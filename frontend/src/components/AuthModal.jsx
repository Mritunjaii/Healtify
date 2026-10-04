import React, { useState } from 'react';
import { QuillSketch } from './SketchIcons';
import { api } from '../services/api';
import { KeyRound, Mail, User as UserIcon, ArrowRight } from 'lucide-react';

export const AuthModal = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      let res;
      if (isRegister) {
        res = await api.register(name, email, password);
      } else {
        res = await api.login(email, password);
      }

      if (res.success && res.token) {
        localStorage.setItem('healtify_token', res.token);
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Authentication failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2623]/60 backdrop-blur-xs">
      <div className="paper-card w-full max-w-md p-8 relative shadow-2xl">
        <div className="washi-tape washi-tape-accent"></div>

        {/* Branding */}
        <div className="text-center pb-5 border-b border-[#E3DAC8]">
          <div className="w-12 h-12 rounded-2xl bg-[#2A6F54]/10 border border-[#2A6F54]/30 flex items-center justify-center mx-auto mb-3">
            <QuillSketch className="w-7 h-7" color="#2A6F54" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1E2723]">HEALTIFY</h2>
          <p className="text-xs text-[#7A7163] font-journal italic mt-0.5">
            Personal Lifestyle Tracking & Wellness Companion
          </p>
        </div>

        {errorMsg && (
          <div className="mt-4 p-2.5 rounded-lg bg-[#FBEBE8] border border-[#EEC1B9] text-xs text-[#8F3323]">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-[#544C3F] mb-1">
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#D5C9B4] text-xs text-[#1F2824] focus:outline-none focus:ring-1 focus:ring-[#2A6F54]"
                />
                <UserIcon className="w-4 h-4 text-[#8C8273] absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#544C3F] mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#D5C9B4] text-xs text-[#1F2824] focus:outline-none focus:ring-1 focus:ring-[#2A6F54]"
              />
              <Mail className="w-4 h-4 text-[#8C8273] absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#544C3F] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#D5C9B4] text-xs text-[#1F2824] focus:outline-none focus:ring-1 focus:ring-[#2A6F54]"
              />
              <KeyRound className="w-4 h-4 text-[#8C8273] absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full ink-btn py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-3"
          >
            <span>{isLoading ? 'Opening Journal...' : (isRegister ? 'Create Journal Account' : 'Sign In to Journal')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-5 text-center pt-4 border-t border-[#E3DAC8]">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-[#2A6F54] font-medium hover:underline cursor-pointer"
          >
            {isRegister
              ? 'Already keep a journal here? Sign in instead'
              : "New to Healtify? Create your journal account"}
          </button>
        </div>
      </div>
    </div>
  );
};

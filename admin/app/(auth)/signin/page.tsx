'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); window.location.href = '/'; }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #E9EBEC' }}>
      <div className="text-center mb-6">
        <h4 className="text-[22px] font-bold mb-1" style={{ color: '#405189' }}>Welcome Back!</h4>
        <p className="text-[14px]" style={{ color: '#878A99' }}>Sign in to continue to VisionGo Admin.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#495057' }}>Email</label>
          <input type="email" defaultValue="admin@asianvision.ph" placeholder="Enter email" className="w-full h-11 px-4 rounded-lg text-[14px] outline-none transition-colors"
            style={{ border: '1px solid #E9EBEC', color: '#212529' }}
            onFocus={(e) => (e.target.style.borderColor = '#405189')}
            onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[13px] font-semibold" style={{ color: '#495057' }}>Password</label>
            <Link href="/forgot-password" className="text-[13px] font-medium hover:underline" style={{ color: '#405189' }}>Forgot password?</Link>
          </div>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} defaultValue="admin123" placeholder="Enter password" className="w-full h-11 px-4 pr-11 rounded-lg text-[14px] outline-none transition-colors"
              style={{ border: '1px solid #E9EBEC', color: '#212529' }}
              onFocus={(e) => (e.target.style.borderColor = '#405189')}
              onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
            <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }}>
              {showPass
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" defaultChecked className="w-4 h-4 rounded" style={{ accentColor: '#405189' }} />
          <label htmlFor="remember" className="text-[13px]" style={{ color: '#495057' }}>Remember me</label>
        </div>

        <button type="submit" disabled={loading} className="w-full h-11 rounded-lg text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
          {loading && <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: '1px solid #E9EBEC' }} /></div>
        <div className="relative flex justify-center"><span className="px-3 text-[12px] bg-white" style={{ color: '#ADB5BD' }}>Sign in with</span></div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { color: '#3b5998', icon: 'f', label: 'Facebook' },
          { color: '#DB4437', icon: 'G', label: 'Google' },
          { color: '#333',    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>, label: 'GitHub' },
          { color: '#1DA1F2', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>, label: 'Twitter' },
        ].map((s) => (
          <button key={s.label} className="h-10 rounded-lg flex items-center justify-center text-white text-[13px] font-bold transition-opacity hover:opacity-90" style={{ background: s.color }}>
            {typeof s.icon === 'string' ? s.icon : s.icon}
          </button>
        ))}
      </div>

      <p className="text-center mt-5 text-[13px]" style={{ color: '#878A99' }}>
        Don't have an account?{' '}
        <Link href="/signup" className="font-semibold hover:underline" style={{ color: '#405189' }}>Sign Up</Link>
      </p>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function LockScreenPage() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); window.location.href = '/'; }, 1500); };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #E9EBEC' }}>
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
          <span className="text-white text-[22px] font-bold">LC</span>
        </div>
        <h5 className="text-[18px] font-bold mb-0.5" style={{ color: '#212529' }}>Lester Caraan</h5>
        <p className="text-[13px]" style={{ color: '#878A99' }}>admin@asianvision.ph</p>
        <p className="text-[13px] mt-3" style={{ color: '#878A99' }}>Enter your password to unlock your screen.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#495057' }}>Password</label>
          <input type="password" placeholder="Enter password" className="w-full h-11 px-4 rounded-lg text-[14px] outline-none"
            style={{ border: '1px solid #E9EBEC', color: '#212529' }}
            onFocus={(e) => (e.target.style.borderColor = '#405189')}
            onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
        </div>
        <button type="submit" disabled={loading} className="w-full h-11 rounded-lg text-[14px] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
          {loading && <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
          Unlock Screen
        </button>
      </form>
      <p className="text-center mt-5 text-[13px]" style={{ color: '#878A99' }}>
        Not you?{' '}
        <a href="/signin" className="font-semibold hover:underline" style={{ color: '#405189' }}>Sign in as a different user</a>
      </p>
    </div>
  );
}

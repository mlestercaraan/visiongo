'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewPasswordPage() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setDone(true); }, 1500); };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #E9EBEC' }}>
      {!done ? (
        <>
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#E3F2FB' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h4 className="text-[22px] font-bold mb-1" style={{ color: '#405189' }}>Create New Password</h4>
            <p className="text-[14px]" style={{ color: '#878A99' }}>Your new password must be at least 8 characters.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['New Password', 'Confirm Password'].map((label) => (
              <div key={label}>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#495057' }}>{label}</label>
                <input type="password" placeholder={`Enter ${label.toLowerCase()}`} className="w-full h-11 px-4 rounded-lg text-[14px] outline-none"
                  style={{ border: '1px solid #E9EBEC', color: '#212529' }}
                  onFocus={(e) => (e.target.style.borderColor = '#405189')}
                  onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full h-11 rounded-lg text-[14px] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
              {loading && <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
              Reset Password
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#E7F8F5' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0AB39C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h4 className="text-[20px] font-bold mb-2" style={{ color: '#212529' }}>Password Changed!</h4>
          <p className="text-[14px] mb-6" style={{ color: '#878A99' }}>Your password has been updated successfully.</p>
          <Link href="/signin" className="inline-flex h-11 px-6 rounded-lg items-center text-[14px] font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
            Back to Sign In
          </Link>
        </div>
      )}
    </div>
  );
}

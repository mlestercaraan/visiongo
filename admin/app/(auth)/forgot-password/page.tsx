'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setSent(true); }, 1500); };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #E9EBEC' }}>
      {!sent ? (
        <>
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#E7F8F5' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0AB39C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h4 className="text-[22px] font-bold mb-1" style={{ color: '#405189' }}>Forgot Password?</h4>
            <p className="text-[14px]" style={{ color: '#878A99' }}>Enter your email and we'll send a reset link.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#495057' }}>Email Address</label>
              <input type="email" placeholder="Enter your email" className="w-full h-11 px-4 rounded-lg text-[14px] outline-none"
                style={{ border: '1px solid #E9EBEC', color: '#212529' }}
                onFocus={(e) => (e.target.style.borderColor = '#405189')}
                onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
            </div>
            <button type="submit" disabled={loading} className="w-full h-11 rounded-lg text-[14px] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
              {loading && <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
              Send Reset Link
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#E7F8F5' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0AB39C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h4 className="text-[20px] font-bold mb-2" style={{ color: '#212529' }}>Email Sent!</h4>
          <p className="text-[14px] mb-6" style={{ color: '#878A99' }}>Check your inbox for instructions to reset your password.</p>
          <Link href="/signin" className="inline-flex h-11 px-6 rounded-lg items-center justify-center text-[14px] font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
            Back to Sign In
          </Link>
        </div>
      )}
      {!sent && (
        <p className="text-center mt-5 text-[13px]" style={{ color: '#878A99' }}>
          Remembered it?{' '}
          <Link href="/signin" className="font-semibold hover:underline" style={{ color: '#405189' }}>Sign In</Link>
        </p>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => setLoading(false), 1500); };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #E9EBEC' }}>
      <div className="text-center mb-6">
        <h4 className="text-[22px] font-bold mb-1" style={{ color: '#405189' }}>Create Account</h4>
        <p className="text-[14px]" style={{ color: '#878A99' }}>Register to access the VisionGo Admin portal.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
          { label: 'Email Address', type: 'email', placeholder: 'Enter your email' },
          { label: 'Password', type: 'password', placeholder: 'Create a password (min 8 characters)' },
          { label: 'Confirm Password', type: 'password', placeholder: 'Re-enter your password' },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#495057' }}>{f.label}</label>
            <input type={f.type} placeholder={f.placeholder} className="w-full h-11 px-4 rounded-lg text-[14px] outline-none"
              style={{ border: '1px solid #E9EBEC', color: '#212529' }}
              onFocus={(e) => (e.target.style.borderColor = '#405189')}
              onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
          </div>
        ))}
        <div className="flex items-start gap-2">
          <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5 rounded flex-shrink-0" style={{ accentColor: '#405189' }} />
          <label htmlFor="terms" className="text-[13px]" style={{ color: '#495057' }}>
            I agree to the <span className="font-semibold" style={{ color: '#405189' }}>Terms of Service</span> and <span className="font-semibold" style={{ color: '#405189' }}>Privacy Policy</span>
          </label>
        </div>
        <button type="submit" disabled={loading} className="w-full h-11 rounded-lg text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
          {loading && <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mt-5 text-[13px]" style={{ color: '#878A99' }}>
        Already have an account?{' '}
        <Link href="/signin" className="font-semibold hover:underline" style={{ color: '#405189' }}>Sign In</Link>
      </p>
    </div>
  );
}

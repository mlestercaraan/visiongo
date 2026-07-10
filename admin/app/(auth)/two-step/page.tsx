'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function TwoStepPage() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigit = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
    if (next.every((d) => d) && next.join('').length === 6) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setDone(true); }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #E9EBEC' }}>
      {!done ? (
        <>
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#EDE9FE' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h4 className="text-[22px] font-bold mb-1" style={{ color: '#405189' }}>Two-Step Verification</h4>
            <p className="text-[14px]" style={{ color: '#878A99' }}>
              Enter the 6-digit code sent to your mobile number ending in <strong style={{ color: '#212529' }}>**567</strong>.
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1}
                value={d}
                onChange={(e) => handleDigit(e.target.value, i)}
                onKeyDown={(e) => { if (e.key === 'Backspace' && !d && i > 0) inputs.current[i - 1]?.focus(); }}
                className="w-12 h-14 text-center text-[20px] font-bold rounded-xl outline-none transition-colors"
                style={{ border: d ? '2px solid #405189' : '1px solid #E9EBEC', color: '#212529', background: d ? '#F3F6F9' : '#fff' }}
              />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center mb-4">
              <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#405189" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
          )}

          <p className="text-center text-[13px] mb-4" style={{ color: '#878A99' }}>
            Didn't receive the code?{' '}
            <button className="font-semibold hover:underline" style={{ color: '#405189' }} onClick={() => setDigits(['', '', '', '', '', ''])}>
              Resend
            </button>
          </p>
          <Link href="/signin" className="block text-center text-[13px] font-semibold hover:underline" style={{ color: '#878A99' }}>
            Back to Sign In
          </Link>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#E7F8F5' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0AB39C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h4 className="text-[20px] font-bold mb-2" style={{ color: '#212529' }}>Verified!</h4>
          <p className="text-[14px] mb-6" style={{ color: '#878A99' }}>Identity confirmed. Redirecting you to the dashboard.</p>
          <Link href="/" className="inline-flex h-11 px-6 rounded-lg items-center text-[14px] font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

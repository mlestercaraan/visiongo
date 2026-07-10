import Link from 'next/link';

export default function LogoutPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-10 text-center" style={{ border: '1px solid #E9EBEC' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#FEF6E4' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F7B84B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </div>
      <h4 className="text-[22px] font-bold mb-2" style={{ color: '#212529' }}>You are Logged Out</h4>
      <p className="text-[14px] mb-1" style={{ color: '#878A99' }}>Thank you for using VisionGo Admin.</p>
      <p className="text-[14px] mb-8" style={{ color: '#878A99' }}>Your session has been ended securely.</p>
      <Link href="/signin" className="inline-flex h-11 px-8 rounded-lg items-center text-[14px] font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
        Sign In Again
      </Link>
    </div>
  );
}

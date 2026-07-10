export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F3F6F9' }}>
      {/* Blue wave top */}
      <div className="relative" style={{ background: 'linear-gradient(135deg, #0D1117 0%, #1a2744 50%, #405189 100%)', minHeight: '240px' }}>
        {/* Decorative dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[[10,20],[80,15],[20,70],[70,60],[45,40],[90,80],[5,85],[55,10]].map(([x, y], i) => (
            <div key={i} className="absolute rounded-full" style={{ left: `${x}%`, top: `${y}%`, width: `${6 + (i % 3) * 4}px`, height: `${6 + (i % 3) * 4}px`, background: 'rgba(0,207,255,0.12)' }} />
          ))}
        </div>
        {/* Logo */}
        <div className="flex flex-col items-center justify-center pt-12 pb-16 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#00CFFF' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <span className="text-[22px] font-bold text-white tracking-tight">
              Vision<span style={{ color: '#00CFFF' }}>Go</span>
            </span>
          </div>
          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,.45)' }}>Admin Console</p>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '48px' }}>
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 48V24C240 0 480 48 720 24C960 0 1200 48 1440 24V48H0Z" fill="#F3F6F9"/>
          </svg>
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-start justify-center px-4 -mt-2 pb-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 pb-6">
        <p className="text-[12px]" style={{ color: '#ADB5BD' }}>
          {new Date().getFullYear()} VisionGo. Asian Vision Cable and Internet Corporation.
        </p>
      </div>
    </div>
  );
}

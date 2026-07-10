'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const NOTIFICATIONS = [
  { id: 'n1', type: 'payment', title: 'Maria Santos paid PHP 1,799', time: '2 min ago', read: false, color: '#0AB39C', bg: '#E7F8F5', icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/> },
  { id: 'n2', type: 'ticket',  title: 'New ticket: Wi-Fi signal weak', time: '15 min ago', read: false, color: '#F7B84B', bg: '#FEF6E4', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> },
  { id: 'n3', type: 'referral', title: 'Jose Reyes activated a referral', time: '1 hr ago', read: false, color: '#405189', bg: '#EEF0F8', icon: <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></> },
  { id: 'n4', type: 'hubspot', title: 'HubSpot sync failed for sub-003', time: '2 hrs ago', read: true, color: '#F06548', bg: '#FEE9E5', icon: <><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></> },
  { id: 'n5', type: 'upgrade', title: 'Ana Cruz requested plan upgrade', time: '3 hrs ago', read: true, color: '#299CDB', bg: '#E3F2FB', icon: <><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></> },
];

function Ico({ d, color, size = 15 }: { d: React.ReactNode; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}

function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, cb]);
}

export function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useOutsideClick(notifRef, () => setNotifOpen(false));
  useOutsideClick(profileRef, () => setProfileOpen(false));

  const unread = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-white flex-shrink-0 relative z-30" style={{ borderBottom: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 h-9 rounded-lg text-[13px] outline-none transition-colors"
          style={{ background: '#F3F6F9', border: '1px solid transparent', color: '#495057', width: '240px' }}
          onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.border = '1px solid #405189'; }}
          onBlur={(e) => { e.target.style.background = '#F3F6F9'; e.target.style.border = '1px solid transparent'; }}
        />
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-1.5">

        {/* Fullscreen toggle */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100" style={{ color: '#878A99' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
            className="w-9 h-9 rounded-lg flex items-center justify-center relative transition-colors hover:bg-slate-100"
            style={{ color: '#878A99' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: '#F06548' }}>
                {unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-[380px] bg-white rounded-xl overflow-hidden z-50" style={{ boxShadow: '0 8px 32px rgba(0,0,0,.12)', border: '1px solid #E9EBEC' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold" style={{ color: '#212529' }}>Notifications</span>
                  {unread > 0 && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#F06548' }}>{unread} New</span>}
                </div>
                <button onClick={markAllRead} className="text-[12px] font-medium hover:underline" style={{ color: '#405189' }}>
                  Mark all read
                </button>
              </div>

              {/* Notification list */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3.5 px-5 py-3.5 transition-colors hover:bg-slate-50 cursor-pointer" style={{ background: n.read ? '#fff' : '#FAFBFF', borderBottom: '1px solid #F8FAFC' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: n.bg }}>
                      <Ico d={n.icon} color={n.color} size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold leading-snug" style={{ color: n.read ? '#495057' : '#212529' }}>{n.title}</p>
                      <p className="text-[11px] mt-1" style={{ color: '#ADB5BD' }}>{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: '#405189' }} />}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3.5 text-center" style={{ borderTop: '1px solid #F3F6F9' }}>
                <Link href="/notifications" onClick={() => setNotifOpen(false)} className="text-[13px] font-semibold hover:underline" style={{ color: '#405189' }}>
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 mx-1" style={{ background: '#E9EBEC' }} />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2.5 h-9 px-2 rounded-lg transition-colors hover:bg-slate-100"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
              LC
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[13px] font-semibold leading-none" style={{ color: '#212529' }}>Lester</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#878A99' }}>Admin</p>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-[240px] bg-white rounded-xl overflow-hidden z-50" style={{ boxShadow: '0 8px 32px rgba(0,0,0,.12)', border: '1px solid #E9EBEC' }}>
              {/* User info */}
              <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0">
                    LC
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-white leading-tight">Lester Caraan</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,.65)' }}>lester@asianvision.ph</p>
                    <p className="text-[10px] mt-1 font-semibold px-2 py-0.5 rounded-full inline-block" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>Administrator</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                {[
                  { label: 'Profile',   href: '/profile',   icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,        color: '#405189' },
                  { label: 'Settings',  href: '/settings',  icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>, color: '#878A99' },
                  { label: 'Help',      href: '/help',      icon: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,        color: '#878A99' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F3F6F9' }}>
                      <Ico d={item.icon} color={item.color} size={13} />
                    </div>
                    <span className="text-[13px] font-medium" style={{ color: '#495057' }}>{item.label}</span>
                  </Link>
                ))}

                <div className="my-1.5" style={{ borderTop: '1px solid #F3F6F9' }} />

                <Link
                  href="/logout"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-red-50"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FEE9E5' }}>
                    <Ico
                      d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>}
                      color="#F06548"
                      size={13}
                    />
                  </div>
                  <span className="text-[13px] font-semibold" style={{ color: '#F06548' }}>Logout</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PATHS = {
  grid:     <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  chat:     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
  sync:     <><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>,
  invoice:  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
  refer:    <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>,
  wave:     <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
  megaphone:<path d="M22 2H2l8 9.46V19l4 2v-8.54L22 2z"/>,
  pin:      <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  up:       <><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></>,
};

type P = keyof typeof PATHS;

const NAV: { group: string; items: { href: string; label: string; icon: P; badge?: string }[] }[] = [
  { group: 'Dashboards', items: [
    { href: '/',            label: 'Overview',     icon: 'grid' },
  ]},
  { group: 'Management', items: [
    { href: '/subscribers', label: 'Subscribers',  icon: 'users' },
    { href: '/tickets',     label: 'Tickets',      icon: 'chat' },
    { href: '/hubspot',     label: 'HubSpot',      icon: 'sync',    badge: '1' },
    { href: '/invoices',    label: 'Invoices',     icon: 'invoice' },
  ]},
  { group: 'Growth', items: [
    { href: '/referrals',     label: 'Referrals',     icon: 'refer' },
    { href: '/plans',         label: 'Plans',         icon: 'wave' },
    { href: '/promos',        label: 'Promos',        icon: 'megaphone' },
    { href: '/service-areas', label: 'Service Areas', icon: 'pin' },
    { href: '/upgrades',      label: 'Upgrades',      icon: 'up' },
  ]},
];

function Icon({ path, size = 15 }: { path: P; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      {PATHS[path]}
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[230px] flex-shrink-0 flex flex-col min-h-screen" style={{ background: '#0B1120' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00CFFF,#0284C7)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <span className="text-[15px] font-bold text-white leading-none">
          Vision<span style={{ color: '#00CFFF' }}>Go</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 overflow-y-auto">
        {NAV.map(({ group, items }) => (
          <div key={group} className="mb-2">
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[1.8px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {group}
            </p>
            {items.map(({ href, label, icon, badge }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    paddingLeft: active ? '14px' : '10px',
                    ...(active ? { background: 'rgba(0,207,255,0.12)' } : {}),
                  }}
                  className={`nlink flex items-center gap-3 pr-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium relative ${
                    active ? 'text-white' : 'hover:bg-white/[0.05]'
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: '#00CFFF' }} />
                  )}
                  <span style={{ color: active ? '#00CFFF' : 'rgba(255,255,255,0.6)' }}>
                    <Icon path={icon} />
                  </span>
                  <span style={{ color: active ? '#fff' : 'rgba(255,255,255,0.75)' }} className="flex-1">
                    {label}
                  </span>
                  {badge && (
                    <span className="w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center flex-shrink-0" style={{ background: '#F06548' }}>
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,rgba(0,207,255,.4),#0284C7)' }}>
            <span className="text-white text-[10px] font-bold">AV</span>
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold truncate leading-tight" style={{ color: 'rgba(255,255,255,0.6)' }}>Asian Vision</p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>BTG / QUE / ZAM</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

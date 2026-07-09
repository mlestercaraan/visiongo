'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SVG_ICONS: Record<string, React.ReactNode> = {
  '/': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  '/subscribers': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  '/tickets': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  '/hubspot': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  '/referrals': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  '/plans': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  '/promos': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2H2l8 9.46V19l4 2v-8.54L22 2z"/>
    </svg>
  ),
  '/service-areas': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  '/upgrades': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/>
    </svg>
  ),
};

const NAV_MANAGEMENT = [
  { href: '/', label: 'Overview' },
  { href: '/subscribers', label: 'Subscribers' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/hubspot', label: 'HubSpot Sync', dot: true },
];

const NAV_GROWTH = [
  { href: '/referrals', label: 'Referrals' },
  { href: '/plans', label: 'Plans' },
  { href: '/promos', label: 'Promos' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/upgrades', label: 'Upgrades' },
];

function NavItem({ href, label, dot, pathname }: { href: string; label: string; dot?: boolean; pathname: string }) {
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg mb-0.5 text-sm font-medium transition-all group border ${
        isActive
          ? 'bg-[#00CFFF]/[0.08] text-[#00CFFF] border-[#00CFFF]/[0.15]'
          : 'text-[#6A8BA8] hover:bg-white/[0.04] hover:text-[#AACCEE] border-transparent'
      }`}
    >
      <span className={`flex-shrink-0 ${isActive ? 'text-[#00CFFF]' : 'text-[#3A5A78] group-hover:text-[#6A8BA8]'}`}>
        {SVG_ICONS[href]}
      </span>
      <span className="flex-1">{label}</span>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A59] flex-shrink-0" />}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-[#011428] min-h-screen flex flex-col border-r border-white/[0.06] flex-shrink-0">
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00CFFF]/20 to-[#065A82]/40 border border-[#00CFFF]/20 flex items-center justify-center">
            <span className="text-[#00CFFF] text-sm font-black">V</span>
          </div>
          <div>
            <span className="text-white font-black text-[15px] tracking-tight leading-none">
              Vision<span className="text-[#00CFFF]">Go</span>
            </span>
            <p className="text-[#3A5A78] text-[10px] mt-0.5 leading-none font-medium tracking-wide uppercase">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2.5 py-4 overflow-y-auto">
        <p className="text-[#2A4060] text-[9px] font-bold uppercase tracking-[2px] px-2.5 mb-1.5">Management</p>
        {NAV_MANAGEMENT.map((item) => (
          <NavItem key={item.href} {...item} pathname={pathname} />
        ))}

        <p className="text-[#2A4060] text-[9px] font-bold uppercase tracking-[2px] px-2.5 mb-1.5 mt-5">Growth</p>
        {NAV_GROWTH.map((item) => (
          <NavItem key={item.href} {...item} pathname={pathname} />
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-1.5 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00CFFF]/30 to-[#065A82]/60 flex items-center justify-center flex-shrink-0">
            <span className="text-[#00CFFF] text-xs font-bold">AV</span>
          </div>
          <div className="min-w-0">
            <p className="text-[#AACCEE] text-xs font-semibold truncate">Asian Vision</p>
            <p className="text-[#3A5A78] text-[10px] truncate">BTG / QUE / ZAM</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

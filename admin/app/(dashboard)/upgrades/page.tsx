import { Header } from '@/components/layout/Header';
import { ADMIN_DEMO_UPGRADES } from '@/lib/mockData';

const CHIPS: Record<string, [string, string]> = {
  active:       ['#0AB39C', '#E7F8F5'],
  suspended:    ['#F7B84B', '#FEF6E4'],
  disconnected: ['#F06548', '#FEE9E5'],
  open:         ['#299CDB', '#E3F2FB'],
  in_progress:  ['#F7B84B', '#FEF6E4'],
  resolved:     ['#0AB39C', '#E7F8F5'],
  completed:    ['#0AB39C', '#E7F8F5'],
  pending:      ['#878A99', '#F3F6F9'],
  failed:       ['#F06548', '#FEE9E5'],
  cancelled:    ['#878A99', '#F3F6F9'],
  invited:      ['#299CDB', '#E3F2FB'],
  registered:   ['#F7B84B', '#FEF6E4'],
  activated:    ['#0AB39C', '#E7F8F5'],
  contacted:    ['#F7B84B', '#FEF6E4'],
  scheduled:    ['#7C3AED', '#EDE9FE'],
  success:      ['#0AB39C', '#E7F8F5'],
  skipped:      ['#878A99', '#F3F6F9'],
};

function Chip({ status }: { status: string }) {
  const [fg, bg] = CHIPS[status] ?? ['#878A99', '#F3F6F9'];
  return (
    <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize" style={{ color: fg, background: bg }}>
      {status.replace('_', ' ')}
    </span>
  );
}

function formatDate(d: string | null) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

const CARD_STYLE = { background: '#fff', border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' };

export default function UpgradesPage() {
  const byStatus = (s: string) => ADMIN_DEMO_UPGRADES.filter((u) => u.status === s).length;
  const totalRevenue = ADMIN_DEMO_UPGRADES.filter((u) => u.status === 'completed').reduce((s, u) => s + u.new_fee - u.current_fee, 0);
  const maxCount = Math.max(...['pending', 'contacted', 'scheduled', 'completed'].map(byStatus), 1);

  return (
    <>
      <Header
        title="Upgrades"
        tag="Sales"
        subtitle="Plan upgrade pipeline"
        actions={
          <select className="h-9 rounded-lg px-2.5 text-[13px] focus:outline-none" style={{ border: '1px solid #E9EBEC', background: '#fff', color: '#495057' }}>
            <option>Assign to agent</option>
            <option>Jomar Santos</option>
            <option>Ana Reyes</option>
          </select>
        }
      />
      <main className="flex-1 p-7 space-y-5 animate-fade-up" style={{ background: '#F3F6F9' }}>

        <div className="grid grid-cols-5 gap-3">
          {([
            { s: 'pending',   accent: '#299CDB', i: 1 },
            { s: 'contacted', accent: '#F7B84B', i: 2 },
            { s: 'scheduled', accent: '#7C3AED', i: 3 },
            { s: 'completed', accent: '#0AB39C', i: 4 },
            { s: 'cancelled', accent: '#878A99', i: 5 },
          ] as const).map(({ s, accent, i }) => (
            <div key={s} className={`vcard au s${i} rounded-xl p-5`} style={CARD_STYLE}>
              <p className="text-[28px] font-bold leading-none" style={{ color: accent }}>{byStatus(s)}</p>
              <p className="text-[13px] font-semibold mt-2 capitalize" style={{ color: '#495057' }}>{s}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-5">
          {/* Pipeline + revenue */}
          <div className="space-y-3">
            <div className="rounded-xl p-5 vcard au s1" style={CARD_STYLE}>
              <p className="text-[12px] font-semibold uppercase tracking-[1.2px] mb-1" style={{ color: '#ADB5BD' }}>Revenue Uplift</p>
              <p className="text-[32px] font-bold leading-none" style={{ color: '#0AB39C' }}>PHP {totalRevenue.toLocaleString()}</p>
              <p className="text-[12px] mt-1" style={{ color: '#ADB5BD' }}>additional MRR</p>
            </div>
            <div className="rounded-xl p-5 vcard au s2" style={CARD_STYLE}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#E3F2FB' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Pipeline</p>
              </div>
              {(['pending', 'contacted', 'scheduled', 'completed'] as const).map((s) => {
                const count = byStatus(s);
                const colors: Record<string, string> = { pending: '#299CDB', contacted: '#F7B84B', scheduled: '#7C3AED', completed: '#0AB39C' };
                return (
                  <div key={s} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[12px] capitalize" style={{ color: '#878A99' }}>{s}</span>
                      <span className="text-[12px] font-semibold" style={{ color: '#495057' }}>{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F6F9' }}>
                      <div className="h-1.5 bar rounded-full" style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: colors[s] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="col-span-3 rounded-xl vcard au s3" style={CARD_STYLE}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid #E9EBEC' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EDE9FE' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </div>
                <span className="text-[15px] font-semibold" style={{ color: '#212529' }}>All Requests ({ADMIN_DEMO_UPGRADES.length})</span>
              </div>
              <select className="h-9 rounded-lg px-2 text-[12px] focus:outline-none" style={{ border: '1px solid #E9EBEC', background: '#fff', color: '#495057' }}>
                <option>All Status</option>
                {['pending', 'contacted', 'scheduled', 'completed', 'cancelled'].map((s) => (
                  <option key={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E9EBEC' }}>
                  {['Subscriber', 'Plan Change', 'Value', 'Status', 'Assigned', 'Scheduled', 'HubSpot'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADMIN_DEMO_UPGRADES.map((upg) => (
                  <tr key={upg.id} className="vrow hover:bg-slate-50/50 transition-colors" style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td className="px-5 py-3.5">
                      <p className="text-[14px] font-medium" style={{ color: '#212529' }}>{upg.subscriber_name}</p>
                      <p className="text-[12px] font-mono" style={{ color: '#ADB5BD' }}>{upg.account_number}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-[12px]">
                        <span className="font-mono px-1.5 py-0.5 rounded" style={{ color: '#ADB5BD', background: '#F3F6F9' }}>{upg.current_plan.replace('Fiber ', 'F')}</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        <span className="font-mono font-semibold px-1.5 py-0.5 rounded" style={{ color: '#299CDB', background: '#E3F2FB' }}>{upg.requested_plan.replace('Fiber ', 'F')}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[14px] font-semibold" style={{ color: '#0AB39C' }}>+PHP {(upg.new_fee - upg.current_fee).toLocaleString()}</p>
                      <p className="text-[12px]" style={{ color: '#ADB5BD' }}>/month</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Chip status={upg.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {upg.assigned_agent
                        ? <p className="text-[14px]" style={{ color: '#495057' }}>{upg.assigned_agent}</p>
                        : <button className="text-[12px] font-medium" style={{ color: '#299CDB' }}>Assign</button>}
                    </td>
                    <td className="px-5 py-3.5 text-[12px]" style={{ color: '#ADB5BD' }}>{formatDate(upg.scheduled_date)}</td>
                    <td className="px-5 py-3.5">
                      {upg.hubspot_deal_id
                        ? <span className="text-[12px] font-medium" style={{ color: '#FF7A59' }}>Deal open</span>
                        : <span className="text-[12px]" style={{ color: '#ADB5BD' }}>Not synced</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

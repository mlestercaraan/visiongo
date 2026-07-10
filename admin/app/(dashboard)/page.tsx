import { ADMIN_METRICS, ADMIN_DEMO_TICKETS, ADMIN_DEMO_SUBSCRIBERS, ADMIN_DEMO_HUBSPOT_LOGS, ADMIN_DEMO_UPGRADES, ADMIN_DEMO_REFERRALS } from '@/lib/mockData';

function Ico({ d, color = 'currentColor', size = 16 }: { d: React.ReactNode; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
}

function Chip({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    active:      ['#0AB39C', '#E7F8F5'],
    suspended:   ['#F7B84B', '#FEF6E4'],
    open:        ['#299CDB', '#E3F2FB'],
    in_progress: ['#F7B84B', '#FEF6E4'],
    resolved:    ['#0AB39C', '#E7F8F5'],
    pending:     ['#878A99', '#F3F6F9'],
    failed:      ['#F06548', '#FEE9E5'],
    success:     ['#0AB39C', '#E7F8F5'],
    contacted:   ['#F7B84B', '#FEF6E4'],
    scheduled:   ['#7C3AED', '#EDE9FE'],
    completed:   ['#0AB39C', '#E7F8F5'],
    cancelled:   ['#878A99', '#F3F6F9'],
    activated:   ['#0AB39C', '#E7F8F5'],
    registered:  ['#F7B84B', '#FEF6E4'],
    invited:     ['#299CDB', '#E3F2FB'],
  };
  const [fg, bg] = map[status] ?? ['#878A99', '#F3F6F9'];
  return <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize" style={{ color: fg, background: bg }}>{status.replace('_', ' ')}</span>;
}

const CHART_BARS = [
  { month: 'Jan', subs: 42, rev: 75 }, { month: 'Feb', subs: 55, rev: 82 },
  { month: 'Mar', subs: 48, rev: 70 }, { month: 'Apr', subs: 70, rev: 88 },
  { month: 'May', subs: 65, rev: 85 }, { month: 'Jun', subs: 88, rev: 95 },
  { month: 'Jul', subs: 82, rev: 92 }, { month: 'Aug', subs: 95, rev: 100 },
];

const PROVINCE_DATA = [
  { name: 'Batangas',  count: 1124, pct: 61, color: '#405189' },
  { name: 'Quezon',    count: 482,  pct: 26, color: '#299CDB' },
  { name: 'Zambales',  count: 241,  pct: 13, color: '#0AB39C' },
];

const ACTIVITIES = [
  { time: '10:30', title: 'Subscriber payment received', sub: 'Maria Santos - PHP 1,799', color: '#0AB39C', icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></> },
  { time: '11:00', title: 'New support ticket filed', sub: 'AV-TKT-20250010 - Slow speed', color: '#F7B84B', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> },
  { time: '13:00', title: 'Plan upgrade requested', sub: 'Roberto Dela Torre - Fiber 500', color: '#405189', icon: <><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></> },
  { time: '14:30', title: 'Referral activated', sub: 'Jose Reyes referred a new subscriber', color: '#EC4899', icon: <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></> },
  { time: '16:00', title: 'HubSpot sync completed', sub: '4 contacts synced, 1 failed', color: '#FF7A59', icon: <><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></> },
];

function formatDate(d: string) { return new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }); }

export default function DashboardPage() {
  const synced  = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'success').length;
  const failed  = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'failed').length;

  const KPI = [
    { label: 'Active Subscribers', val: '1,847', trend: '+12.4%', up: true,  icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></>, color: '#405189', bg: '#EEF0F8' },
    { label: 'Monthly Revenue',    val: 'PHP 3.76M', trend: '+8.3%',  up: true,  icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>, color: '#0AB39C', bg: '#E7F8F5' },
    { label: 'Lead Conversion',    val: '32.89%',    trend: '+5.1%',  up: true,  icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>, color: '#F7B84B', bg: '#FEF6E4' },
    { label: 'Avg Daily Revenue',  val: 'PHP 3,596', trend: '-2.1%',  up: false, icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>, color: '#299CDB', bg: '#E3F2FB' },
    { label: 'Annual Sales',       val: '2,659',     trend: '+7.5%',  up: true,  icon: <><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></>, color: '#F06548', bg: '#FEE9E5' },
  ];

  return (
    <main className="flex-1 overflow-auto p-6" style={{ background: '#F3F6F9' }}>
      <div className="space-y-5">

        {/* KPI row */}
        <div className="grid grid-cols-5 gap-4">
          {KPI.map((k, i) => (
            <div key={k.label} className={`vcard au s${i+1} bg-white rounded-xl p-4`} style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: k.bg }}>
                  <Ico d={k.icon} color={k.color} size={17} />
                </div>
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${k.up ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {k.up ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                  </svg>
                  {k.trend}
                </span>
              </div>
              <p className="text-[22px] font-bold leading-none mb-1" style={{ color: '#212529' }}>{k.val}</p>
              <p className="text-[12px]" style={{ color: '#878A99' }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Subscriber & Revenue trend */}
          <div className="col-span-2 bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
              <div>
                <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Subscriber Growth</p>
                <p className="text-[12px] mt-0.5" style={{ color: '#878A99' }}>New subscribers vs revenue (Jan - Aug 2025)</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#405189' }}/> Subscribers</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#0AB39C' }}/> Revenue</span>
              </div>
            </div>
            <div className="px-5 pt-5 pb-5">
              <div className="flex items-end gap-3" style={{ height: '130px' }}>
                {CHART_BARS.map((b, i) => (
                  <div key={b.month} className="flex items-end gap-1 flex-1">
                    <div className="flex-1 rounded-t-md relative overflow-hidden" style={{ height: `${b.subs}%` }}>
                      <div className="bar absolute inset-0 rounded-t-md" style={{ background: '#405189', animationDelay: `${0.04*i}s` }} />
                    </div>
                    <div className="flex-1 rounded-t-md relative overflow-hidden" style={{ height: `${b.rev}%` }}>
                      <div className="bar absolute inset-0 rounded-t-md" style={{ background: '#0AB39C', opacity: 0.7, animationDelay: `${0.04*i+0.02}s` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-2">
                {CHART_BARS.map((b) => (
                  <div key={b.month} className="flex-1 text-center">
                    <span className="text-[10px]" style={{ color: '#ADB5BD' }}>{b.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Province + enrichment */}
          <div className="bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
              <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Coverage Breakdown</p>
              <p className="text-[12px] mt-0.5" style={{ color: '#878A99' }}>Subscribers by province</p>
            </div>
            <div className="flex justify-center py-5">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#F3F6F9" strokeWidth="4"/>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#405189" strokeWidth="4" strokeDasharray="38 50" strokeDashoffset="0" strokeLinecap="round"/>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#299CDB" strokeWidth="4" strokeDasharray="16 72" strokeDashoffset="-38" strokeLinecap="round"/>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#0AB39C" strokeWidth="4" strokeDasharray="8 80" strokeDashoffset="-54" strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[15px] font-bold leading-none" style={{ color: '#212529' }}>1,847</p>
                  <p className="text-[9px] mt-0.5" style={{ color: '#ADB5BD' }}>total</p>
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 space-y-2.5">
              {PROVINCE_DATA.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: p.color }}/>
                      <span className="text-[12px] font-medium" style={{ color: '#495057' }}>{p.name}</span>
                    </div>
                    <span className="text-[12px] font-semibold" style={{ color: '#212529' }}>{p.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F6F9' }}>
                    <div className="sfill h-1.5 rounded-full" style={{ width: `${p.pct}%`, background: p.color }}/>
                  </div>
                </div>
              ))}
              <div className="pt-2" style={{ borderTop: '1px dashed #E9EBEC' }}>
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] font-medium" style={{ color: '#495057' }}>Enrichment Rate</span>
                  <span className="text-[12px] font-bold" style={{ color: '#0AB39C' }}>42%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F6F9' }}>
                  <div className="sfill h-1.5 rounded-full bg-[#0AB39C]" style={{ width: '42%' }}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content row */}
        <div className="grid grid-cols-5 gap-4">

          {/* Upgrade Pipeline (Deals Status) */}
          <div className="col-span-3 bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
              <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Upgrade Pipeline</p>
              <a href="/upgrades" className="text-[12px] font-semibold hover:underline" style={{ color: '#405189' }}>View all</a>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F6F9' }}>
                  {['Subscriber','Plan Change','Agent','Status','Value'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADMIN_DEMO_UPGRADES.slice(0,5).map((upg) => (
                  <tr key={upg.id} className="vrow" style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-semibold" style={{ color: '#212529' }}>{upg.subscriber_name}</p>
                      <p className="text-[11px] font-mono" style={{ color: '#ADB5BD' }}>{upg.account_number}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-[12px]">
                        <span style={{ color: '#878A99' }}>{upg.current_plan.replace('Fiber ','F')}</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0AB39C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        <span className="font-semibold" style={{ color: '#212529' }}>{upg.requested_plan.replace('Fiber ','F')}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[12px]" style={{ color: upg.assigned_agent ? '#495057' : '#ADB5BD' }}>
                      {upg.assigned_agent ?? 'Unassigned'}
                    </td>
                    <td className="px-5 py-3"><Chip status={upg.status} /></td>
                    <td className="px-5 py-3 text-[13px] font-semibold" style={{ color: '#0AB39C' }}>
                      +PHP {(upg.new_fee - upg.current_fee).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* My Tasks */}
          <div className="col-span-2 bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
              <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>My Tasks</p>
              <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#EEF0F8', color: '#405189' }}>4 remaining</span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { done: false, text: 'Review and merge ticket escalations',   due: 'Today',   color: '#F06548' },
                { done: false, text: 'Follow up on 3 pending upgrade requests', due: 'Today', color: '#F7B84B' },
                { done: true,  text: 'HubSpot sync review for failed contacts', due: 'Done',   color: '#0AB39C' },
                { done: false, text: 'Approve referral rewards for July',       due: 'Jul 12', color: '#299CDB' },
                { done: false, text: 'Enable 4 new serviceable barangays',      due: 'Jul 14', color: '#405189' },
              ].map((task, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ borderColor: task.done ? '#0AB39C' : '#E9EBEC', background: task.done ? '#E7F8F5' : 'transparent' }}>
                    {task.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0AB39C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium" style={{ color: task.done ? '#ADB5BD' : '#212529', textDecoration: task.done ? 'line-through' : 'none' }}>{task.text}</p>
                  </div>
                  <span className="text-[11px] font-semibold flex-shrink-0 px-2 py-0.5 rounded-full" style={{ background: task.color + '18', color: task.color }}>{task.due}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-4">

          {/* Upcoming Activities */}
          <div className="bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
              <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Today's Activity</p>
            </div>
            <div className="p-5">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: '#F3F6F9' }} />
                <div className="space-y-4">
                  {ACTIVITIES.map((act, i) => (
                    <div key={i} className="flex items-start gap-3 relative">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{ background: act.color + '18' }}>
                        <Ico d={act.icon} color={act.color} size={13} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[13px] font-semibold leading-tight" style={{ color: '#212529' }}>{act.title}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: '#ADB5BD' }}>{act.sub}</p>
                      </div>
                      <span className="text-[10px] font-medium flex-shrink-0 pt-1" style={{ color: '#ADB5BD' }}>{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Closing Deals - Referrals */}
          <div className="bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
              <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Referrals</p>
              <a href="/referrals" className="text-[12px] font-semibold hover:underline" style={{ color: '#405189' }}>View all</a>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F6F9' }}>
                  {['Referrer','Referee','Status','Reward'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADMIN_DEMO_REFERRALS.slice(0,5).map((ref) => (
                  <tr key={ref.id} className="vrow" style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-semibold" style={{ color: '#212529' }}>{ref.referrer_name.split(' ')[0]}</p>
                    </td>
                    <td className="px-4 py-3 text-[11px]" style={{ color: '#ADB5BD' }}>
                      {ref.referee_mobile.slice(0,4)}***{ref.referee_mobile.slice(-3)}
                    </td>
                    <td className="px-4 py-3"><Chip status={ref.status} /></td>
                    <td className="px-4 py-3 text-[12px] font-semibold" style={{ color: ref.reward_amount ? '#0AB39C' : '#ADB5BD' }}>
                      {ref.reward_amount ? `PHP ${ref.reward_amount}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* HubSpot + recent subs */}
          <div className="bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>HubSpot Sync</p>
                {failed > 0 && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#FEE9E5', color: '#F06548' }}>{failed} failed</span>}
              </div>
              <a href="/hubspot" className="text-[12px] font-semibold hover:underline" style={{ color: '#405189' }}>View log</a>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Synced', val: synced, color: '#0AB39C', bg: '#E7F8F5' },
                  { label: 'Failed', val: failed,  color: '#F06548', bg: '#FEE9E5' },
                  { label: 'Pending', val: ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'pending').length, color: '#F7B84B', bg: '#FEF6E4' },
                ].map((s) => (
                  <div key={s.label} className="text-center rounded-xl p-2" style={{ background: s.bg }}>
                    <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.val}</p>
                    <p className="text-[10px] font-medium" style={{ color: s.color, opacity: 0.7 }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {ADMIN_DEMO_HUBSPOT_LOGS.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-center gap-2.5 py-1.5 text-[12px]" style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: log.status === 'success' ? '#0AB39C' : log.status === 'failed' ? '#F06548' : '#F7B84B' }} />
                    <span className="capitalize" style={{ color: '#495057' }}>{log.entity_type}</span>
                    <span className="font-mono text-[10px] flex-1 truncate" style={{ color: '#ADB5BD' }}>{log.entity_id.slice(0, 14)}</span>
                    <span className="text-[11px] font-semibold" style={{ color: log.status === 'success' ? '#0AB39C' : log.status === 'failed' ? '#F06548' : '#F7B84B' }}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

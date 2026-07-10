import { Header } from '@/components/layout/Header';
import { ADMIN_DEMO_REFERRALS } from '@/lib/mockData';

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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

function mask(m: string) { return m.slice(0, 4) + '***' + m.slice(-3); }

const CARD_STYLE = { background: '#fff', border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' };

export default function ReferralsPage() {
  const activated  = ADMIN_DEMO_REFERRALS.filter((r) => r.status === 'activated').length;
  const registered = ADMIN_DEMO_REFERRALS.filter((r) => r.status === 'registered').length;
  const invited    = ADMIN_DEMO_REFERRALS.filter((r) => r.status === 'invited').length;
  const credited   = ADMIN_DEMO_REFERRALS.filter((r) => r.reward_credited).reduce((s, r) => s + (r.reward_amount ?? 0), 0);
  const pending    = ADMIN_DEMO_REFERRALS.filter((r) => r.status === 'activated' && !r.reward_credited).reduce((s, r) => s + (r.reward_amount ?? 0), 0);

  const topReferrers = [
    { name: 'Jose Reyes',   code: 'REYE-3310-BTG', count: 2, rewards: 700 },
    { name: 'Maria Santos', code: 'SANT-4821-BTG', count: 1, rewards: 200 },
    { name: 'Ana Cruz',     code: 'CRUZ-7742-QUE', count: 1, rewards: 200 },
  ];

  return (
    <>
      <Header title="Referrals" tag="Growth" subtitle="Subscriber and employee referral tracking" />
      <main className="flex-1 p-7 space-y-5 animate-fade-up" style={{ background: '#F3F6F9' }}>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Activated',        val: activated,         accent: '#0AB39C', i: 1 },
            { label: 'Registered',       val: registered,        accent: '#F7B84B', i: 2 },
            { label: 'Invited',          val: invited,           accent: '#299CDB', i: 3 },
            { label: 'Rewards Credited', val: `PHP ${credited}`, accent: '#212529', i: 4 },
            { label: 'Pending Credit',   val: `PHP ${pending}`,  accent: '#F7B84B', i: 5 },
          ].map((s) => (
            <div key={s.label} className={`vcard au s${s.i} rounded-xl p-5`} style={CARD_STYLE}>
              <p className="text-[28px] font-bold leading-none" style={{ color: s.accent }}>{s.val}</p>
              <p className="text-[13px] font-semibold mt-2" style={{ color: '#495057' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-5">
          {/* Leaderboard */}
          <div className="rounded-xl p-5 vcard au s1" style={CARD_STYLE}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FEF6E4' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7B84B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              </div>
              <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Top Referrers</p>
            </div>
            <div className="space-y-3">
              {topReferrers.map((r, i) => (
                <div key={r.code} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0" style={i === 0 ? { background: '#FEF6E4', color: '#F7B84B' } : i === 1 ? { background: '#F3F6F9', color: '#878A99' } : { background: '#FEE9E5', color: '#F06548' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: '#212529' }}>{r.name}</p>
                    <p className="text-[11px] font-mono" style={{ color: '#ADB5BD' }}>{r.code}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[13px] font-bold" style={{ color: '#495057' }}>{r.count}</p>
                    <p className="text-[11px]" style={{ color: '#ADB5BD' }}>PHP {r.rewards}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 space-y-2.5" style={{ borderTop: '1px solid #E9EBEC' }}>
              {[
                { label: 'Subscriber', count: ADMIN_DEMO_REFERRALS.filter((r) => r.referral_type === 'subscriber').length, color: '#299CDB' },
                { label: 'Employee',   count: ADMIN_DEMO_REFERRALS.filter((r) => r.referral_type === 'employee').length,   color: '#7C3AED' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px]" style={{ color: '#878A99' }}>{item.label}</span>
                    <span className="text-[12px] font-semibold" style={{ color: '#495057' }}>{item.count}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: '#F3F6F9' }}>
                    <div className="h-1 bar rounded-full" style={{ width: `${(item.count / ADMIN_DEMO_REFERRALS.length) * 100}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="col-span-3 rounded-xl vcard au s2" style={CARD_STYLE}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid #E9EBEC' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#E3F2FB' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <span className="text-[15px] font-semibold" style={{ color: '#212529' }}>All Referrals</span>
              </div>
              <select className="h-9 rounded-lg px-2 text-[12px] focus:outline-none" style={{ border: '1px solid #E9EBEC', background: '#fff', color: '#495057' }}>
                <option>All Status</option><option>Activated</option><option>Registered</option><option>Invited</option>
              </select>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E9EBEC' }}>
                  {['Referrer', 'Referee', 'Type', 'Status', 'Reward', 'Date', 'HubSpot'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADMIN_DEMO_REFERRALS.map((ref) => (
                  <tr key={ref.id} className="vrow hover:bg-slate-50/50 transition-colors" style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td className="px-5 py-3">
                      <p className="text-[14px] font-medium" style={{ color: '#212529' }}>{ref.referrer_name}</p>
                      <p className="text-[12px] font-mono" style={{ color: '#ADB5BD' }}>{ref.referrer_code}</p>
                    </td>
                    <td className="px-5 py-3 text-[14px]" style={{ color: '#878A99' }}>{mask(ref.referee_mobile)}</td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded uppercase" style={ref.referral_type === 'subscriber' ? { color: '#299CDB', background: '#E3F2FB' } : { color: '#7C3AED', background: '#EDE9FE' }}>
                        {ref.referral_type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Chip status={ref.status} />
                    </td>
                    <td className="px-5 py-3">
                      {ref.reward_amount ? (
                        <div>
                          <p className="text-[14px] font-semibold" style={{ color: ref.reward_credited ? '#0AB39C' : '#F7B84B' }}>PHP {ref.reward_amount}</p>
                          <p className="text-[12px]" style={{ color: '#ADB5BD' }}>{ref.reward_credited ? 'Credited' : 'Pending'}</p>
                        </div>
                      ) : <span style={{ color: '#ADB5BD' }}>-</span>}
                    </td>
                    <td className="px-5 py-3 text-[12px]" style={{ color: '#ADB5BD' }}>{formatDate(ref.created_at)}</td>
                    <td className="px-5 py-3">
                      {ref.status === 'activated'
                        ? <span className="text-[12px] font-medium" style={{ color: '#FF7A59' }}>Deal Won</span>
                        : <span className="text-[12px]" style={{ color: '#ADB5BD' }}>In pipeline</span>}
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

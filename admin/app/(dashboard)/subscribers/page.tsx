import { Header } from '@/components/layout/Header';
import { ADMIN_DEMO_SUBSCRIBERS } from '@/lib/mockData';

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

export default function SubscribersPage() {
  return (
    <>
      <Header
        title="Subscribers"
        tag="CRM"
        subtitle={`${ADMIN_DEMO_SUBSCRIBERS.length} accounts`}
        actions={
          <button
            className="h-9 px-4 text-[13px] font-semibold rounded-lg transition-colors"
            style={{ background: '#405189', color: '#fff' }}
          >
            Export CSV
          </button>
        }
      />
      <main className="flex-1 p-7 animate-fade-up" style={{ background: '#F3F6F9' }}>
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search subscribers..." className="pl-8 pr-3 h-9 w-64 rounded-lg text-[13px] focus:outline-none" style={{ border: '1px solid #E9EBEC', background: '#fff', color: '#495057' }} />
          </div>
          <select className="h-9 rounded-lg px-2.5 text-[13px] focus:outline-none" style={{ border: '1px solid #E9EBEC', background: '#fff', color: '#495057' }}>
            <option>All Status</option><option>Active</option><option>Suspended</option>
          </select>
          <select className="h-9 rounded-lg px-2.5 text-[13px] focus:outline-none" style={{ border: '1px solid #E9EBEC', background: '#fff', color: '#495057' }}>
            <option>All Provinces</option><option>Batangas</option><option>Quezon Province</option><option>Zambales</option>
          </select>
          <span className="ml-auto text-[13px]" style={{ color: '#ADB5BD' }}>{ADMIN_DEMO_SUBSCRIBERS.length} results</span>
        </div>

        <div className="rounded-xl vcard au s1" style={{ background: '#fff', border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #E9EBEC' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#E3F2FB' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold" style={{ color: '#212529' }}>Subscribers</span>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #E9EBEC' }}>
                <th className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>Subscriber</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>Location</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>Plan</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>Status</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>Balance</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>Enrichment</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>HubSpot</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {ADMIN_DEMO_SUBSCRIBERS.map((sub) => (
                <tr key={sub.id} className="vrow hover:bg-slate-50/50 transition-colors group" style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F3F6F9' }}>
                        <span className="text-[12px] font-semibold" style={{ color: '#495057' }}>{sub.first_name[0]}{sub.last_name[0]}</span>
                      </div>
                      <div>
                        <a href={`/subscribers/${sub.id}`} className="text-[14px] font-medium transition-colors" style={{ color: '#212529' }}>
                          {sub.first_name} {sub.last_name}
                        </a>
                        <p className="text-[12px] font-mono" style={{ color: '#ADB5BD' }}>{sub.account_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[14px]" style={{ color: '#495057' }}>{sub.municipality}</p>
                    <p className="text-[12px]" style={{ color: '#ADB5BD' }}>{sub.province}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[14px]" style={{ color: '#495057' }}>{sub.plan_name}</td>
                  <td className="px-4 py-3.5"><Chip status={sub.subscription_status} /></td>
                  <td className="px-4 py-3.5">
                    <span className="text-[14px] font-semibold" style={{ color: sub.outstanding_balance > 0 ? '#F7B84B' : '#0AB39C' }}>
                      {sub.outstanding_balance > 0 ? `PHP ${sub.outstanding_balance.toLocaleString()}` : 'Paid'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: '#F3F6F9' }}>
                        <div className="h-1 bar rounded-full" style={{ width: `${sub.enrichment_pct}%`, background: '#299CDB' }} />
                      </div>
                      <span className="text-[12px]" style={{ color: '#ADB5BD' }}>{sub.enrichment_pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {sub.hubspot_contact_id
                      ? <span className="text-[12px] font-medium" style={{ color: '#FF7A59' }}>Synced</span>
                      : <span className="text-[12px]" style={{ color: '#ADB5BD' }}>Not synced</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <a href={`/subscribers/${sub.id}`} className="text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#299CDB' }}>View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

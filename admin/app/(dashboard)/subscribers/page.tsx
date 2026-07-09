import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ADMIN_DEMO_SUBSCRIBERS } from '@/lib/mockData';

const STATUS_PILL: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  suspended: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  disconnected: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  pending: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

export default function SubscribersPage() {
  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Subscribers"
          subtitle={`${ADMIN_DEMO_SUBSCRIBERS.length} accounts across Batangas, Quezon, and Zambales`}
          tag="CRM"
          actions={
            <button className="bg-[#021B3A] text-[#00CFFF] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#04285A] transition-colors">
              Export CSV
            </button>
          }
        />
        <main className="flex-1 p-7">
          <div className="bg-white rounded-2xl border border-[rgba(2,27,58,0.07)] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[rgba(2,27,58,0.06)] flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA8BE]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search by name, account, mobile..." className="w-full pl-9 pr-3 py-2 border border-[rgba(2,27,58,0.12)] rounded-lg text-sm focus:outline-none focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/10" />
              </div>
              <select className="border border-[rgba(2,27,58,0.12)] rounded-lg px-3 py-2 text-sm focus:outline-none text-[#4A6580]">
                <option>All Status</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
              <select className="border border-[rgba(2,27,58,0.12)] rounded-lg px-3 py-2 text-sm focus:outline-none text-[#4A6580]">
                <option>All Provinces</option>
                <option>Batangas</option>
                <option>Quezon Province</option>
                <option>Zambales</option>
              </select>
              <div className="ml-auto text-sm text-[#8EA8BE]">{ADMIN_DEMO_SUBSCRIBERS.length} subscribers</div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-[rgba(2,27,58,0.02)] border-b border-[rgba(2,27,58,0.05)]">
                  {['Subscriber', 'Location', 'Plan', 'Status', 'Balance', 'Enrichment', 'HubSpot', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-[#8EA8BE] uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(2,27,58,0.04)]">
                {ADMIN_DEMO_SUBSCRIBERS.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[rgba(2,27,58,0.02)] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#065A82] to-[#021B3A] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#00CFFF] text-[11px] font-bold">
                            {sub.first_name[0]}{sub.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#021B3A] text-sm group-hover:text-[#065A82] transition-colors">
                            {sub.first_name} {sub.last_name}
                          </p>
                          <p className="text-[10px] text-[#8EA8BE] font-mono mt-0.5">{sub.account_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-[#021B3A]">{sub.municipality}</p>
                      <p className="text-[10px] text-[#8EA8BE]">{sub.province}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4A6580]">{sub.plan_name}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${STATUS_PILL[sub.subscription_status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {sub.subscription_status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-bold ${sub.outstanding_balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {sub.outstanding_balance > 0 ? `PHP ${sub.outstanding_balance.toLocaleString()}` : 'Paid'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-1.5 bg-[#00CFFF] rounded-full" style={{ width: `${sub.enrichment_pct}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-[#4A6580]">{sub.enrichment_pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {sub.hubspot_contact_id ? (
                        <span className="text-[10px] font-bold text-[#FF7A59] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A59]" />
                          Synced
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#8EA8BE]">Not synced</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <a href={`/subscribers/${sub.id}`} className="text-xs font-bold text-[#065A82] hover:text-[#00CFFF] transition-colors">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

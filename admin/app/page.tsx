import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ADMIN_METRICS, ADMIN_DEMO_TICKETS, ADMIN_DEMO_SUBSCRIBERS, ADMIN_DEMO_HUBSPOT_LOGS } from '@/lib/mockData';

const STATUS_PILL: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  suspended: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  open: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  in_progress: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  failed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  pending: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

function MetricCard({
  label,
  value,
  sub,
  accentColor,
  icon,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  accentColor: string;
  icon: React.ReactNode;
  trend?: { label: string; up: boolean };
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[rgba(2,27,58,0.07)] shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accentColor}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            {trend.up ? '+' : ''}{trend.label}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-[#021B3A] leading-none mb-1">{value}</p>
      <p className="text-xs font-semibold text-[#4A6580] uppercase tracking-wide">{label}</p>
      {sub && <p className="text-[11px] text-[#8EA8BE] mt-1">{sub}</p>}
    </div>
  );
}

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#065A82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconActivity = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconBilling = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const IconTicket = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconReferral = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);
const IconUpgrade = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/>
  </svg>
);

export default function AdminRootPage() {
  const synced = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'success').length;
  const failed = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'failed').length;
  const pending = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'pending').length;

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Overview"
          subtitle="Live metrics for Asian Vision Cable and Internet"
          tag="Admin Dashboard"
        />

        <main className="flex-1 p-7 overflow-auto">
          {/* Metric grid */}
          <div className="grid grid-cols-3 xl:grid-cols-6 gap-4 mb-7">
            <MetricCard
              label="Active Subscribers"
              value={ADMIN_METRICS.active_subscribers.toLocaleString()}
              sub="All 3 provinces"
              accentColor="bg-[#065A82]/10"
              icon={<IconUsers />}
              trend={{ label: '+12 this month', up: true }}
            />
            <MetricCard
              label="App Users"
              value={ADMIN_METRICS.app_users_30d.toLocaleString()}
              sub="Logged in last 30 days"
              accentColor="bg-[#0891B2]/10"
              icon={<IconActivity />}
              trend={{ label: '+34%', up: true }}
            />
            <MetricCard
              label="Outstanding Bills"
              value={`PHP ${(ADMIN_METRICS.outstanding_bills_total / 1000).toFixed(0)}k`}
              sub="Total unpaid balance"
              accentColor="bg-amber-500/10"
              icon={<IconBilling />}
            />
            <MetricCard
              label="Open Tickets"
              value={ADMIN_METRICS.open_tickets.toString()}
              sub="Requires attention"
              accentColor="bg-red-500/10"
              icon={<IconTicket />}
              trend={{ label: '-3 this week', up: false }}
            />
            <MetricCard
              label="Referrals (July)"
              value={ADMIN_METRICS.referrals_this_month.toString()}
              sub="New referrals this month"
              accentColor="bg-pink-600/10"
              icon={<IconReferral />}
              trend={{ label: '+8 vs last month', up: true }}
            />
            <MetricCard
              label="Pending Upgrades"
              value={ADMIN_METRICS.pending_upgrades.toString()}
              sub="Awaiting sales callback"
              accentColor="bg-emerald-600/10"
              icon={<IconUpgrade />}
            />
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-5 gap-6 mb-6">
            {/* Subscribers table */}
            <div className="col-span-3 bg-white rounded-2xl border border-[rgba(2,27,58,0.07)] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[rgba(2,27,58,0.06)] flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#021B3A] text-[15px]">Subscribers</h2>
                  <p className="text-xs text-[#8EA8BE] mt-0.5">Most recent accounts</p>
                </div>
                <a href="/subscribers" className="text-xs font-bold text-[#065A82] hover:text-[#00CFFF] transition-colors flex items-center gap-1">
                  View all
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-[rgba(2,27,58,0.02)]">
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#8EA8BE] uppercase tracking-widest">Subscriber</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-[#8EA8BE] uppercase tracking-widest">Plan</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-[#8EA8BE] uppercase tracking-widest">Status</th>
                    <th className="text-right px-5 py-3 text-[10px] font-bold text-[#8EA8BE] uppercase tracking-widest">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(2,27,58,0.04)]">
                  {ADMIN_DEMO_SUBSCRIBERS.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[rgba(2,27,58,0.02)] transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#065A82] to-[#021B3A] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#00CFFF] text-[10px] font-bold">
                              {sub.first_name[0]}{sub.last_name[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-[#021B3A] text-sm group-hover:text-[#065A82] transition-colors">
                              {sub.first_name} {sub.last_name}
                            </p>
                            <p className="text-[10px] text-[#8EA8BE] font-mono">{sub.account_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-[#4A6580]">{sub.plan_name}</p>
                        <p className="text-[10px] text-[#8EA8BE]">{sub.province}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${STATUS_PILL[sub.subscription_status] ?? 'bg-slate-100 text-slate-600'}`}>
                          {sub.subscription_status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`text-sm font-bold ${sub.outstanding_balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {sub.outstanding_balance > 0 ? `PHP ${sub.outstanding_balance.toLocaleString()}` : 'Paid'}
                        </span>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <div className="h-1 rounded-full bg-slate-100 w-16 overflow-hidden">
                            <div className="h-1 rounded-full bg-[#00CFFF]" style={{ width: `${sub.enrichment_pct}%` }} />
                          </div>
                          <span className="text-[9px] text-[#8EA8BE]">{sub.enrichment_pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tickets panel */}
            <div className="col-span-2 bg-white rounded-2xl border border-[rgba(2,27,58,0.07)] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[rgba(2,27,58,0.06)] flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#021B3A] text-[15px]">Open Tickets</h2>
                  <p className="text-xs text-[#8EA8BE] mt-0.5">Requires attention</p>
                </div>
                <a href="/tickets" className="text-xs font-bold text-[#065A82] hover:text-[#00CFFF] transition-colors flex items-center gap-1">
                  View all
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
              </div>
              <div className="divide-y divide-[rgba(2,27,58,0.04)]">
                {ADMIN_DEMO_TICKETS.map((tkt) => (
                  <div key={tkt.id} className="px-5 py-4 hover:bg-[rgba(2,27,58,0.02)] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${tkt.ticket_type === 'technical' ? 'bg-blue-50' : 'bg-amber-50'}`}>
                        {tkt.ticket_type === 'technical' ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 6l10.4 10.4a2 2 0 0 0 2.8 0L23 6"/><path d="M1 6h22"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${STATUS_PILL[tkt.status] ?? 'bg-slate-100 text-slate-600'}`}>
                            {tkt.status.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-[#8EA8BE] font-mono">{tkt.ticket_number}</span>
                        </div>
                        <p className="text-sm font-semibold text-[#021B3A] leading-snug truncate">{tkt.subject}</p>
                        <p className="text-xs text-[#8EA8BE] mt-0.5">{tkt.subscriber_name}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${tkt.priority === 'urgent' ? 'bg-red-500' : tkt.priority === 'high' ? 'bg-amber-500' : 'bg-slate-300'}`} title={tkt.priority} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HubSpot + Enrichment row */}
          <div className="grid grid-cols-3 gap-6">
            {/* HubSpot sync status */}
            <div className="col-span-2 bg-[#011428] rounded-2xl p-5 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#FF7A59] mb-1">HubSpot CRM</p>
                  <h3 className="text-white font-bold text-[15px]">Integration Status</h3>
                </div>
                <a href="/hubspot" className="text-xs font-bold text-[#FF7A59] hover:text-[#FFB299] transition-colors flex items-center gap-1">
                  View sync log
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Synced today', value: synced, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Failed', value: failed, color: 'text-red-400', bg: 'bg-red-500/10' },
                  { label: 'Pending', value: pending, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-xl px-4 py-3 border border-white/[0.04]`}>
                    <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                    <p className="text-[10px] text-[#4A6580] uppercase tracking-wide font-medium mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                {ADMIN_DEMO_HUBSPOT_LOGS.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-center gap-3 py-1.5 border-b border-white/[0.04] last:border-0">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${log.status === 'success' ? 'bg-emerald-400' : log.status === 'failed' ? 'bg-red-400' : 'bg-amber-400'}`} />
                    <span className="text-xs text-[#4A6580] capitalize">{log.entity_type}</span>
                    <span className="text-[10px] font-mono text-[#2A4060]">{log.entity_id.substring(0, 16)}</span>
                    <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${STATUS_PILL[log.status] ?? 'bg-slate-100 text-slate-600'}`}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage map placeholder */}
            <div className="bg-white rounded-2xl border border-[rgba(2,27,58,0.07)] shadow-sm p-5">
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#00CFFF] mb-1">Coverage</p>
                <h3 className="font-bold text-[#021B3A] text-[15px]">Province Breakdown</h3>
              </div>
              {[
                { province: 'Batangas', count: 1124, pct: 61, color: '#065A82' },
                { province: 'Quezon Province', count: 482, pct: 26, color: '#0891B2' },
                { province: 'Zambales', count: 241, pct: 13, color: '#00CFFF' },
              ].map((item) => (
                <div key={item.province} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-[#021B3A]">{item.province}</span>
                    <span className="text-xs font-bold text-[#4A6580]">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <p className="text-[10px] text-[#8EA8BE] mt-1">{item.pct}% of total</p>
                </div>
              ))}

              <div className="mt-5 pt-4 border-t border-[rgba(2,27,58,0.07)]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8EA8BE] mb-2">Enrichment Rate</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-[#065A82] to-[#00CFFF]" style={{ width: '42%' }} />
                  </div>
                  <span className="text-sm font-black text-[#021B3A]">42%</span>
                </div>
                <p className="text-[10px] text-[#8EA8BE] mt-1.5">777 subscribers with complete profiles</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

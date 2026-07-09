import { ADMIN_METRICS, ADMIN_DEMO_TICKETS, ADMIN_DEMO_SUBSCRIBERS } from '@/lib/mockData';

function MetricCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[rgba(2,27,58,0.09)] shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-[#4A6580] mb-2">{label}</p>
      <p className={`text-3xl font-black ${accent ?? 'text-[#021B3A]'}`}>{value}</p>
      {sub && <p className="text-xs text-[#8EA8BE] mt-1">{sub}</p>}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-amber-100 text-amber-700',
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  resolved: 'bg-green-100 text-green-700',
};

export default function AdminOverviewPage() {
  return (
    <div className="p-6">
      <div className="mb-6 border-b border-[rgba(2,27,58,0.09)] pb-5">
        <div className="text-xs font-bold tracking-widest text-[#00CFFF] uppercase mb-1">Admin Dashboard</div>
        <h1 className="text-2xl font-black text-[#021B3A]">VisionGo Overview</h1>
        <p className="text-sm text-[#4A6580]">Live metrics for Asian Vision Cable and Internet Corporation</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <MetricCard label="Active Subscribers" value={ADMIN_METRICS.active_subscribers.toLocaleString()} sub="All provinces" />
        <MetricCard label="App Users (30 days)" value={ADMIN_METRICS.app_users_30d.toLocaleString()} sub="Active in last 30 days" accent="text-[#065A82]" />
        <MetricCard label="Outstanding Bills" value={`PHP ${(ADMIN_METRICS.outstanding_bills_total / 1000).toFixed(0)}k`} sub="Total unpaid balance" accent="text-[#F59E0B]" />
        <MetricCard label="Open Tickets" value={ADMIN_METRICS.open_tickets.toString()} sub="Requires attention" accent="text-[#EF4444]" />
        <MetricCard label="Referrals (July)" value={ADMIN_METRICS.referrals_this_month.toString()} sub="This month" accent="text-[#EC4899]" />
        <MetricCard label="Pending Upgrades" value={ADMIN_METRICS.pending_upgrades.toString()} sub="Awaiting callback" accent="text-[#10B981]" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent subscribers */}
        <div className="bg-white rounded-xl border border-[rgba(2,27,58,0.09)] overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[rgba(2,27,58,0.06)] flex items-center justify-between">
            <h2 className="font-bold text-[#021B3A]">Recent Subscribers</h2>
            <a href="/subscribers" className="text-xs text-[#00CFFF] font-bold hover:underline">View all</a>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[rgba(2,27,58,0.03)]">
                <th className="text-left px-4 py-2.5 text-xs font-bold text-[#4A6580] uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-[#4A6580] uppercase tracking-wide">Plan</th>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-[#4A6580] uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-2.5 text-xs font-bold text-[#4A6580] uppercase tracking-wide">Balance</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_DEMO_SUBSCRIBERS.map((sub) => (
                <tr key={sub.id} className="border-t border-[rgba(2,27,58,0.05)] hover:bg-[rgba(2,27,58,0.02)]">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#021B3A] text-sm">{sub.first_name} {sub.last_name}</p>
                    <p className="text-xs text-[#8EA8BE]">{sub.account_number}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#4A6580]">{sub.plan_name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[sub.subscription_status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {sub.subscription_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold" style={{ color: sub.outstanding_balance > 0 ? '#F59E0B' : '#10B981' }}>
                    {sub.outstanding_balance > 0 ? `PHP ${sub.outstanding_balance.toLocaleString()}` : 'Paid'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent tickets */}
        <div className="bg-white rounded-xl border border-[rgba(2,27,58,0.09)] overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[rgba(2,27,58,0.06)] flex items-center justify-between">
            <h2 className="font-bold text-[#021B3A]">Recent Tickets</h2>
            <a href="/tickets" className="text-xs text-[#00CFFF] font-bold hover:underline">View all</a>
          </div>
          <div className="divide-y divide-[rgba(2,27,58,0.05)]">
            {ADMIN_DEMO_TICKETS.map((tkt) => (
              <div key={tkt.id} className="px-4 py-3 hover:bg-[rgba(2,27,58,0.02)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#021B3A] text-sm">{tkt.ticket_number}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[tkt.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {tkt.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-[#4A6580]" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tkt.subject}</p>
                <p className="text-xs text-[#8EA8BE] mt-0.5">{tkt.subscriber_name} | {tkt.ticket_type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HubSpot status bar */}
      <div className="mt-6 bg-[#021B3A] rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF7A59] mb-1">HubSpot CRM Integration</p>
          <p className="text-white font-bold">Sync Status</p>
          <p className="text-[#AACCEE] text-sm mt-1">4 synced today, 1 failed, 1 pending</p>
        </div>
        <a href="/hubspot" className="bg-[#FF7A59] text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#E56340]">
          View Sync Log
        </a>
      </div>
    </div>
  );
}

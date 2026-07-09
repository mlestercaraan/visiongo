import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ADMIN_DEMO_TICKETS } from '@/lib/mockData';

const STATUS_PILL: Record<string, string> = {
  open: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  in_progress: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  closed: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
};

const PRIORITY_CONFIG: Record<string, { dot: string; label: string }> = {
  low: { dot: 'bg-slate-300', label: 'Low' },
  normal: { dot: 'bg-blue-400', label: 'Normal' },
  high: { dot: 'bg-amber-500', label: 'High' },
  urgent: { dot: 'bg-red-500', label: 'Urgent' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TicketsPage() {
  const open = ADMIN_DEMO_TICKETS.filter((t) => t.status === 'open').length;
  const inProgress = ADMIN_DEMO_TICKETS.filter((t) => t.status === 'in_progress').length;
  const resolved = ADMIN_DEMO_TICKETS.filter((t) => t.status === 'resolved').length;

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Support Tickets" subtitle="All subscriber support requests" tag="Support" />
        <main className="flex-1 p-7">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Open', count: open, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
              { label: 'In Progress', count: inProgress, color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-100' },
              { label: 'Resolved', count: resolved, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} ring-1 ${item.ring} rounded-2xl px-5 py-4`}>
                <p className={`text-3xl font-black ${item.color}`}>{item.count}</p>
                <p className="text-xs font-bold text-[#4A6580] uppercase tracking-wide mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(2,27,58,0.07)] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[rgba(2,27,58,0.06)] flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA8BE]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search tickets..." className="w-full pl-9 pr-3 py-2 border border-[rgba(2,27,58,0.12)] rounded-lg text-sm focus:outline-none focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/10" />
              </div>
              <select className="border border-[rgba(2,27,58,0.12)] rounded-lg px-3 py-2 text-sm focus:outline-none text-[#4A6580]">
                <option>All Status</option><option>Open</option><option>In Progress</option><option>Resolved</option>
              </select>
              <select className="border border-[rgba(2,27,58,0.12)] rounded-lg px-3 py-2 text-sm focus:outline-none text-[#4A6580]">
                <option>All Types</option><option>Technical</option><option>Billing</option>
              </select>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-[rgba(2,27,58,0.02)] border-b border-[rgba(2,27,58,0.05)]">
                  {['Ticket', 'Subscriber', 'Subject', 'Priority', 'Status', 'Date', 'HubSpot', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-[#8EA8BE] uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(2,27,58,0.04)]">
                {ADMIN_DEMO_TICKETS.map((tkt) => {
                  const priority = PRIORITY_CONFIG[tkt.priority] ?? PRIORITY_CONFIG.normal;
                  return (
                    <tr key={tkt.id} className="hover:bg-[rgba(2,27,58,0.02)] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-xs font-mono font-bold text-[#021B3A]">{tkt.ticket_number}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${tkt.ticket_type === 'technical' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                          {tkt.ticket_type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#021B3A]">{tkt.subscriber_name}</p>
                        <p className="text-[10px] text-[#8EA8BE] font-mono">{tkt.account_number}</p>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-sm text-[#021B3A] font-medium truncate">{tkt.subject}</p>
                        <p className="text-[10px] text-[#8EA8BE]">{tkt.category}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
                          <span className="text-xs font-semibold text-[#4A6580]">{priority.label}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${STATUS_PILL[tkt.status] ?? 'bg-slate-100 text-slate-600'}`}>
                          {tkt.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#8EA8BE]">{formatDate(tkt.created_at)}</td>
                      <td className="px-5 py-4">
                        {tkt.hubspot_ticket_id ? (
                          <span className="text-[10px] font-bold text-[#FF7A59] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A59]" />
                            Synced
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#8EA8BE]">Pending</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button className="text-xs font-bold text-white bg-[#021B3A] px-3 py-1.5 rounded-lg hover:bg-[#065A82] transition-colors">
                          Update
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

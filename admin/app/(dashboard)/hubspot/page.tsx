import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ADMIN_DEMO_HUBSPOT_LOGS } from '@/lib/mockData';

const STATUS_PILL: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  failed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  skipped: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
};

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const HUBSPOT_PROPERTIES = [
  'account_number', 'subscription_status', 'current_plan', 'outstanding_balance',
  'enrichment_score', 'household_size', 'has_wfh_member', 'has_ofw_member',
  'has_gaming_user', 'has_student_user', 'referral_code', 'last_app_login',
];

export default function HubSpotSyncPage() {
  const successful = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'success').length;
  const failed = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'failed').length;
  const pending = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'pending').length;

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="HubSpot Sync"
          subtitle="CRM sync log and custom property status"
          tag="Integration"
          actions={
            <button className="bg-[#FF7A59] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#E56340] transition-colors">
              Retry All Failed
            </button>
          }
        />
        <main className="flex-1 p-7">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Synced Today', value: successful, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
              { label: 'Failed', value: failed, color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-100' },
              { label: 'Pending', value: pending, color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-100' },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} ring-1 ${item.ring} rounded-2xl px-5 py-4`}>
                <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs font-bold text-[#4A6580] uppercase tracking-wide mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Sync log */}
            <div className="col-span-2 bg-white rounded-2xl border border-[rgba(2,27,58,0.07)] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[rgba(2,27,58,0.06)]">
                <h2 className="font-bold text-[#021B3A] text-[15px]">Sync Log</h2>
                <p className="text-xs text-[#8EA8BE] mt-0.5">All CRM write events from the VisionGo app</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-[rgba(2,27,58,0.02)] border-b border-[rgba(2,27,58,0.05)]">
                    {['Entity', 'HS Object', 'Action', 'Status', 'Synced At', 'Error', ''].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-[#8EA8BE] uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(2,27,58,0.04)]">
                  {ADMIN_DEMO_HUBSPOT_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-[rgba(2,27,58,0.02)] transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-[#021B3A] capitalize">{log.entity_type}</p>
                        <p className="text-[10px] text-[#8EA8BE] font-mono">{log.entity_id.substring(0, 14)}...</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF7A59]/10 text-[#C05232]">
                          {log.hubspot_object_type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#4A6580] capitalize">{log.action}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${STATUS_PILL[log.status] ?? 'bg-slate-100 text-slate-600'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#8EA8BE]">{formatDateTime(log.synced_at)}</td>
                      <td className="px-5 py-3.5 max-w-[180px]">
                        {log.error_message ? (
                          <p className="text-xs text-red-500 truncate" title={log.error_message}>{log.error_message}</p>
                        ) : <span className="text-[#8EA8BE]">-</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        {log.status === 'failed' && (
                          <button className="text-xs font-bold text-white bg-[#FF7A59] px-3 py-1.5 rounded-lg hover:bg-[#E56340] transition-colors">
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Properties panel */}
            <div className="bg-[#011428] rounded-2xl border border-white/[0.06] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#FF7A59] mb-1">Custom Properties</p>
              <h3 className="text-white font-bold text-[15px] mb-4">Contact Properties Status</h3>
              <div className="space-y-2">
                {HUBSPOT_PROPERTIES.map((prop) => (
                  <div key={prop} className="flex items-center gap-2.5 py-1 border-b border-white/[0.04] last:border-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-[#AACCEE] font-mono flex-1">{prop}</span>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A6580] mb-2">HubSpot Pipelines</p>
                {[
                  { name: 'New Subscriber', stages: 4, color: '#00CFFF' },
                  { name: 'Upgrade Pipeline', stages: 5, color: '#10B981' },
                  { name: 'Referral Pipeline', stages: 3, color: '#EC4899' },
                  { name: 'Tech Support', stages: 4, color: '#F59E0B' },
                ].map((pipeline) => (
                  <div key={pipeline.name} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pipeline.color }} />
                      <span className="text-xs text-[#7A9BB8]">{pipeline.name}</span>
                    </div>
                    <span className="text-[10px] text-[#3A5A78]">{pipeline.stages} stages</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

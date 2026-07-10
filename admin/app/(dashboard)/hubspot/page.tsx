import { Header } from '@/components/layout/Header';
import { ADMIN_DEMO_HUBSPOT_LOGS } from '@/lib/mockData';

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

function formatDateTime(d: string | null) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const PROPERTIES = [
  'account_number', 'subscription_status', 'current_plan', 'outstanding_balance',
  'enrichment_score', 'household_size', 'has_wfh_member', 'has_ofw_member',
  'has_gaming_user', 'has_student_user', 'referral_code', 'last_app_login',
];

const PIPELINES = [
  { name: 'New Subscriber',   stages: 4, color: '#299CDB' },
  { name: 'Upgrade Pipeline', stages: 5, color: '#0AB39C' },
  { name: 'Referral',         stages: 3, color: '#7C3AED' },
  { name: 'Tech Support',     stages: 4, color: '#F7B84B' },
];

const CARD_STYLE = { background: '#fff', border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' };

export default function HubSpotSyncPage() {
  const synced  = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'success').length;
  const failed  = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'failed').length;
  const pending = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.status === 'pending').length;

  return (
    <>
      <Header
        title="HubSpot Sync"
        tag="Integration"
        subtitle="CRM sync log and property status"
        actions={
          <button
            className="h-9 px-4 text-[13px] font-semibold rounded-lg transition-colors"
            style={{ background: '#F06548', color: '#fff' }}
          >
            Retry Failed
          </button>
        }
      />
      <main className="flex-1 p-7 space-y-5 animate-fade-up" style={{ background: '#F3F6F9' }}>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Synced today', val: synced,  accent: '#0AB39C', i: 1 },
            { label: 'Failed',       val: failed,  accent: '#F06548', i: 2 },
            { label: 'Pending',      val: pending, accent: '#F7B84B', i: 3 },
          ].map((s) => (
            <div key={s.label} className={`vcard au s${s.i} rounded-xl p-5`} style={CARD_STYLE}>
              <p className="text-[32px] font-bold leading-none" style={{ color: s.accent }}>{s.val}</p>
              <p className="text-[13px] font-semibold mt-2" style={{ color: '#495057' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Sync log */}
          <div className="col-span-2 rounded-xl vcard au s1" style={CARD_STYLE}>
            <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #E9EBEC' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FEE9E5' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F06548" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
              </div>
              <span className="text-[15px] font-semibold" style={{ color: '#212529' }}>Sync Log</span>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E9EBEC' }}>
                  {['Entity', 'Object', 'Action', 'Status', 'Synced', 'Error', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADMIN_DEMO_HUBSPOT_LOGS.map((log) => (
                  <tr key={log.id} className="vrow hover:bg-slate-50/50 transition-colors" style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td className="px-5 py-3">
                      <p className="text-[14px] font-medium capitalize" style={{ color: '#495057' }}>{log.entity_type}</p>
                      <p className="text-[12px] font-mono" style={{ color: '#ADB5BD' }}>{log.entity_id.slice(0, 14)}...</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded" style={{ background: '#FEE9E5', color: '#C05232' }}>
                        {log.hubspot_object_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[14px] capitalize" style={{ color: '#878A99' }}>{log.action}</td>
                    <td className="px-5 py-3">
                      <Chip status={log.status} />
                    </td>
                    <td className="px-5 py-3 text-[12px]" style={{ color: '#ADB5BD' }}>{formatDateTime(log.synced_at)}</td>
                    <td className="px-5 py-3 max-w-[160px]">
                      {log.error_message
                        ? <p className="text-[12px] truncate" style={{ color: '#F06548' }}>{log.error_message}</p>
                        : <span style={{ color: '#ADB5BD' }}>-</span>}
                    </td>
                    <td className="px-5 py-3">
                      {log.status === 'failed' && (
                        <button className="h-9 px-4 text-[11px] font-semibold rounded-lg transition-colors" style={{ background: '#F06548', color: '#fff' }}>
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Properties */}
            <div className="rounded-xl vcard au s2" style={CARD_STYLE}>
              <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #E9EBEC' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#E7F8F5' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0AB39C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span className="text-[15px] font-semibold" style={{ color: '#212529' }}>Custom Properties</span>
              </div>
              <div className="px-5 py-3 space-y-1.5">
                {PROPERTIES.map((p) => (
                  <div key={p} className="flex items-center gap-2.5 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#0AB39C' }} />
                    <span className="text-[12px] font-mono flex-1" style={{ color: '#495057' }}>{p}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ color: '#0AB39C', background: '#E7F8F5' }}>OK</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipelines */}
            <div className="rounded-xl vcard au s3" style={CARD_STYLE}>
              <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #E9EBEC' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EDE9FE' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </div>
                <span className="text-[15px] font-semibold" style={{ color: '#212529' }}>Pipelines</span>
              </div>
              <div className="px-5 py-3 space-y-3">
                {PIPELINES.map((p) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-[13px]" style={{ color: '#495057' }}>{p.name}</span>
                    </div>
                    <span className="text-[12px]" style={{ color: '#ADB5BD' }}>{p.stages} stages</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

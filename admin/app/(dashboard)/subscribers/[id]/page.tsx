import { Header } from '@/components/layout/Header';
import { ADMIN_DEMO_SUBSCRIBERS, ADMIN_DEMO_TICKETS, ADMIN_DEMO_REFERRALS, ADMIN_DEMO_HUBSPOT_LOGS, ADMIN_DEMO_UPGRADES } from '@/lib/mockData';

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

function Chip({ label }: { label: string }) {
  const key = label.replace(' ', '_').toLowerCase();
  const [fg, bg] = CHIPS[key] ?? ['#878A99', '#F3F6F9'];
  return (
    <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize" style={{ color: fg, background: bg }}>
      {label}
    </span>
  );
}

const CARD_STYLE = { background: '#fff', border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' };

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl" style={CARD_STYLE}>
      <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #E9EBEC' }}>
        {icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#E3F2FB' }}>
            {icon}
          </div>
        )}
        <span className="text-[15px] font-semibold" style={{ color: '#212529' }}>{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[1px] mb-0.5" style={{ color: '#ADB5BD' }}>{label}</p>
      <p className={`text-[14px] ${mono ? 'font-mono' : ''}`} style={{ color: '#495057' }}>{value || '-'}</p>
    </div>
  );
}

const ENRICHMENT_QUESTIONS = [
  { key: 'household_size',    label: 'Household Size' },
  { key: 'has_wfh_member',    label: 'WFH Member' },
  { key: 'has_student_user',  label: 'Student User' },
  { key: 'has_gaming_user',   label: 'Gaming User' },
  { key: 'has_ofw_member',    label: 'OFW Member' },
  { key: 'streaming_services', label: 'Streaming' },
  { key: 'device_types',      label: 'Device Types' },
  { key: 'contact_preference', label: 'Contact Pref' },
];

export async function generateStaticParams() {
  return ADMIN_DEMO_SUBSCRIBERS.map((s) => ({ id: s.id }));
}

export default function SubscriberDetailPage({ params }: { params: { id: string } }) {
  const sub = ADMIN_DEMO_SUBSCRIBERS.find((s) => s.id === params.id) ?? ADMIN_DEMO_SUBSCRIBERS[0];
  const tickets   = ADMIN_DEMO_TICKETS.filter((t) => t.account_number === sub.account_number || t.subscriber_name === `${sub.first_name} ${sub.last_name}`);
  const referrals = ADMIN_DEMO_REFERRALS.filter((r) => r.referrer_name === `${sub.first_name} ${sub.last_name}`);
  const upgrades  = ADMIN_DEMO_UPGRADES.filter((u) => u.account_number === sub.account_number);
  const hsLogs    = ADMIN_DEMO_HUBSPOT_LOGS.filter((l) => l.entity_type === 'subscriber').slice(0, 3);

  const enrichmentAnswers: Record<string, boolean> = {
    has_ofw_member: true, device_types: true, streaming_services: true,
  };

  return (
    <>
      <Header
        title={`${sub.first_name} ${sub.last_name}`}
        tag="Subscribers"
        subtitle={sub.account_number}
        actions={
          <div className="flex items-center gap-2">
            <button
              className="h-9 px-4 text-[13px] font-semibold rounded-lg transition-colors"
              style={{ background: '#F06548', color: '#fff' }}
            >
              Sync to HubSpot
            </button>
            <a
              href="/subscribers"
              className="h-9 px-4 text-[13px] font-semibold rounded-lg transition-colors flex items-center"
              style={{ border: '1px solid #E9EBEC', background: '#fff', color: '#212529' }}
            >
              Back
            </a>
          </div>
        }
      />
      <main className="flex-1 p-7 space-y-5 overflow-auto animate-fade-up" style={{ background: '#F3F6F9' }}>

        {/* Summary bar */}
        <div className="rounded-xl p-5 vcard au s1" style={CARD_STYLE}>
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F3F6F9' }}>
              <span className="text-[16px] font-bold" style={{ color: '#495057' }}>{sub.first_name[0]}{sub.last_name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[18px] font-bold" style={{ color: '#212529' }}>{sub.first_name} {sub.last_name}</h2>
                <Chip label={sub.subscription_status} />
                {sub.hubspot_contact_id && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ color: '#FF7A59', background: '#FEE9E5' }}>HubSpot Synced</span>
                )}
              </div>
              <p className="text-[13px]" style={{ color: '#878A99' }}>{sub.mobile} {sub.email && <>&bull; {sub.email}</>}</p>
            </div>
            <div className="flex items-center gap-8 flex-shrink-0 text-right">
              <div>
                <p className="text-[12px] mb-0.5" style={{ color: '#ADB5BD' }}>Plan</p>
                <p className="text-[14px] font-semibold" style={{ color: '#495057' }}>{sub.plan_name}</p>
              </div>
              <div>
                <p className="text-[12px] mb-0.5" style={{ color: '#ADB5BD' }}>Balance</p>
                <p className="text-[16px] font-bold" style={{ color: sub.outstanding_balance > 0 ? '#F7B84B' : '#0AB39C' }}>
                  {sub.outstanding_balance > 0 ? `PHP ${sub.outstanding_balance.toLocaleString()}` : 'Paid'}
                </p>
              </div>
              <div>
                <p className="text-[12px] mb-0.5" style={{ color: '#ADB5BD' }}>Points</p>
                <p className="text-[16px] font-bold" style={{ color: '#299CDB' }}>{sub.points_balance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[12px] mb-0.5" style={{ color: '#ADB5BD' }}>Enrichment</p>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F6F9' }}>
                    <div className="h-1.5 bar rounded-full" style={{ width: `${sub.enrichment_pct}%`, background: '#299CDB' }} />
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: '#495057' }}>{sub.enrichment_pct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-3 gap-5">
          <div className="space-y-5">
            {/* Profile */}
            <Section
              title="Profile"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              }
            >
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name"   value={sub.first_name} />
                <Field label="Last Name"    value={sub.last_name} />
                <Field label="Mobile"       value={sub.mobile} mono />
                <Field label="Email"        value={sub.email} />
                <Field label="Account #"    value={sub.account_number} mono />
                <Field label="Province"     value={sub.province} />
                <Field label="Municipality" value={sub.municipality} />
                <Field label="Barangay"     value={sub.barangay} />
              </div>
              {sub.referral_code && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E9EBEC' }}>
                  <Field label="Referral Code" value={sub.referral_code} mono />
                </div>
              )}
            </Section>

            {/* Enrichment */}
            <Section
              title="Data Enrichment"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              }
            >
              <div className="space-y-2">
                {ENRICHMENT_QUESTIONS.map((q) => {
                  const answered = q.key in enrichmentAnswers;
                  return (
                    <div key={q.key} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid #F3F6F9' }}>
                      <span className="text-[13px]" style={{ color: '#495057' }}>{q.label}</span>
                      {answered
                        ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ color: '#0AB39C', background: '#E7F8F5' }}>Answered</span>
                        : <span className="text-[11px]" style={{ color: '#ADB5BD' }}>Not yet</span>}
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>

          <div className="col-span-2 space-y-5">
            {/* Tickets */}
            <Section
              title={`Support Tickets (${tickets.length})`}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              }
            >
              {tickets.length === 0 ? (
                <p className="text-[13px]" style={{ color: '#ADB5BD' }}>No tickets</p>
              ) : (
                <div className="space-y-2">
                  {tickets.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#F3F6F9' }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium truncate" style={{ color: '#212529' }}>{t.subject}</p>
                        <p className="text-[12px] font-mono" style={{ color: '#ADB5BD' }}>{t.ticket_number}</p>
                      </div>
                      <Chip label={t.status.replace('_', ' ')} />
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Referrals */}
            <Section
              title={`Referrals (${referrals.length})`}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              }
            >
              {referrals.length === 0 ? (
                <p className="text-[13px]" style={{ color: '#ADB5BD' }}>No referrals yet.</p>
              ) : (
                <div className="space-y-2">
                  {referrals.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#F3F6F9' }}>
                      <div className="flex-1">
                        <p className="text-[14px]" style={{ color: '#495057' }}>{r.referee_mobile.slice(0, 4)}***{r.referee_mobile.slice(-3)}</p>
                        <p className="text-[12px]" style={{ color: '#ADB5BD' }}>{new Date(r.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <Chip label={r.status} />
                      {r.reward_amount && <span className="text-[13px] font-semibold" style={{ color: r.reward_credited ? '#0AB39C' : '#F7B84B' }}>PHP {r.reward_amount}</span>}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Upgrade requests */}
            {upgrades.length > 0 && (
              <Section
                title={`Upgrade Requests (${upgrades.length})`}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                }
              >
                {upgrades.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg mb-2 last:mb-0" style={{ background: '#F3F6F9' }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-[12px] mb-0.5">
                        <span className="font-mono" style={{ color: '#ADB5BD' }}>{u.current_plan}</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#299CDB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        <span className="font-mono font-semibold" style={{ color: '#212529' }}>{u.requested_plan}</span>
                      </div>
                      <p className="text-[12px]" style={{ color: '#ADB5BD' }}>{u.notes}</p>
                    </div>
                    <Chip label={u.status} />
                  </div>
                ))}
              </Section>
            )}

            {/* HubSpot */}
            <Section
              title="HubSpot Activity"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F06548" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
              }
            >
              <div className="space-y-2">
                {hsLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 text-[13px]">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: log.status === 'success' ? '#0AB39C' : log.status === 'failed' ? '#F06548' : '#F7B84B' }} />
                    <span className="capitalize" style={{ color: '#878A99' }}>{log.entity_type} {log.action}</span>
                    <span className="ml-auto text-[12px] font-medium" style={{ color: log.status === 'success' ? '#0AB39C' : log.status === 'failed' ? '#F06548' : '#F7B84B' }}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </main>
    </>
  );
}

'use client';

import { useState } from 'react';

type Tab = 'profile' | 'password' | 'notifications' | 'security';

const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', border: '1px solid #E9EBEC', outline: 'none', color: '#212529', background: '#fff', transition: 'border-color .15s' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#878A99', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' };

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input {...props} style={{ ...inputStyle, borderColor: focused ? '#405189' : '#E9EBEC' }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    </div>
  );
}

function Select({ label, children, ...props }: { label: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select {...props} style={{ ...inputStyle, cursor: 'pointer' }}>{children}</select>
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #F3F6F9' }}>
      <div>
        <p className="text-[14px] font-semibold" style={{ color: '#212529' }}>{label}</p>
        {sub && <p className="text-[12px] mt-0.5" style={{ color: '#878A99' }}>{sub}</p>}
      </div>
      <button type="button" onClick={() => onChange(!checked)} className="relative inline-flex h-6 w-11 rounded-full transition-colors flex-shrink-0" style={{ background: checked ? '#405189' : '#CED4DA' }}>
        <span className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform" style={{ transform: checked ? 'translateX(21px)' : 'translateX(2px)', marginTop: '2px' }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ firstName: 'Lester', lastName: 'Caraan', phone: '+63 917 123 4567', email: 'lester@asianvision.ph', joinDate: '2024-01-15', designation: 'System Administrator', website: 'asianvision.ph', city: 'Sto. Tomas', country: 'Philippines', zip: '4234', bio: 'System administrator for Asian Vision Cable and Internet Corporation, managing the VisionGo platform and subscriber operations.' });
  const [notifs, setNotifs] = useState({ email_tickets: true, email_payments: true, email_upgrades: false, sms_alerts: false, hubspot_fail: true, new_subscribers: false });
  const [security, setSecurity] = useState({ two_factor: false, login_alerts: true, api_access: true });
  const fp = (k: keyof typeof profile, v: string) => setProfile((prev) => ({ ...prev, [k]: v }));

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const handleSave = async () => { setSaving(true); await new Promise((r) => setTimeout(r, 1000)); setSaving(false); showToast('Settings saved successfully.'); };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'profile',       label: 'Personal Details' },
    { key: 'password',      label: 'Change Password' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'security',      label: 'Security' },
  ];

  const completionItems = [
    { label: 'Profile photo',  done: true },
    { label: 'Full name',      done: true },
    { label: 'Email address',  done: true },
    { label: 'Phone number',   done: true },
    { label: 'City & country', done: true },
    { label: 'Bio added',      done: !!profile.bio },
  ];
  const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  return (
    <>
      {/* Cover area */}
      <div className="relative flex-shrink-0" style={{ height: '140px', background: 'linear-gradient(135deg,#0D1117 0%,#1a2744 50%,#405189 100%)' }}>
        <button className="absolute top-4 right-5 h-8 px-3 text-[12px] font-semibold rounded-lg flex items-center gap-2" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
          </svg>
          Change Cover
        </button>
      </div>

      <main className="flex-1 overflow-auto p-6 -mt-8" style={{ background: '#F3F6F9' }}>
        <div className="grid grid-cols-4 gap-5 items-start">

          {/* Left: Profile card */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 text-center" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <div className="relative inline-block mb-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-[18px] font-bold text-white" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>LC</div>
                <button className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#405189', border: '2px solid #fff' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
              <h5 className="text-[16px] font-bold" style={{ color: '#212529' }}>{profile.firstName} {profile.lastName}</h5>
              <p className="text-[13px] mt-0.5" style={{ color: '#878A99' }}>{profile.designation}</p>
              <p className="text-[12px] mt-0.5" style={{ color: '#ADB5BD' }}>Asian Vision Cable &amp; Internet</p>
            </div>

            {/* Profile completion */}
            <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-semibold" style={{ color: '#212529' }}>Complete Your Profile</p>
                <span className="text-[12px] font-bold" style={{ color: '#405189' }}>{completionPct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: '#F3F6F9' }}>
                <div className="sfill h-2 rounded-full" style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg,#405189,#299CDB)' }} />
              </div>
              <div className="space-y-2">
                {completionItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: item.done ? '#E7F8F5' : '#F3F6F9' }}>
                      {item.done
                        ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0AB39C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/></svg>}
                    </div>
                    <span className="text-[12px]" style={{ color: item.done ? '#495057' : '#ADB5BD' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <p className="text-[13px] font-semibold mb-3" style={{ color: '#212529' }}>Quick Links</p>
              {[
                { label: profile.designation, icon: '💼', color: '#405189' },
                { label: profile.city + ', ' + profile.country, icon: '📍', color: '#0AB39C' },
                { label: profile.email, icon: '✉', color: '#299CDB' },
                { label: profile.website, icon: '🌐', color: '#F7B84B' },
              ].filter((i) => i.label && i.label !== ', ').map((link) => (
                <div key={link.label} className="flex items-center gap-2.5 py-2" style={{ borderBottom: '1px solid #F3F6F9' }}>
                  <span className="text-[14px]">{link.icon}</span>
                  <span className="text-[12px] truncate" style={{ color: '#495057' }}>{link.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tabbed form */}
          <div className="col-span-3 bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            {/* Tabs */}
            <div className="flex" style={{ borderBottom: '1px solid #F3F6F9' }}>
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className="px-5 py-4 text-[13px] font-semibold transition-colors"
                  style={{ color: tab === t.key ? '#405189' : '#878A99', borderBottom: tab === t.key ? '2px solid #405189' : '2px solid transparent' }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6">

              {/* Personal Details */}
              {tab === 'profile' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <Input label="First Name" value={profile.firstName} onChange={(e) => fp('firstName', e.target.value)} />
                    <Input label="Last Name"  value={profile.lastName}  onChange={(e) => fp('lastName',  e.target.value)} />
                    <Input label="Phone Number"   value={profile.phone}  onChange={(e) => fp('phone',  e.target.value)} />
                    <Input label="Email Address"  value={profile.email}  onChange={(e) => fp('email',  e.target.value)} type="email" />
                    <Input label="Joining Date"   value={profile.joinDate} onChange={(e) => fp('joinDate', e.target.value)} type="date" />
                    <Input label="Designation"    value={profile.designation} onChange={(e) => fp('designation', e.target.value)} />
                    <Input label="Website"        value={profile.website} onChange={(e) => fp('website', e.target.value)} />
                    <Select label="Country" value={profile.country} onChange={(e) => fp('country', e.target.value)}>
                      <option>Philippines</option><option>Other</option>
                    </Select>
                    <Input label="City"      value={profile.city} onChange={(e) => fp('city', e.target.value)} />
                    <Input label="Zip Code"  value={profile.zip}  onChange={(e) => fp('zip',  e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Bio</label>
                    <textarea value={profile.bio} onChange={(e) => fp('bio', e.target.value)} rows={4}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                      onFocus={(e) => (e.target.style.borderColor = '#405189')}
                      onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
                  </div>
                </div>
              )}

              {/* Change Password */}
              {tab === 'password' && (
                <div className="space-y-5 max-w-md">
                  <div className="p-4 rounded-xl" style={{ background: '#EEF0F8', border: '1px solid #D6DBF0' }}>
                    <p className="text-[13px] font-semibold mb-1" style={{ color: '#405189' }}>Password Requirements</p>
                    <ul className="text-[12px] space-y-1" style={{ color: '#6B7280' }}>
                      <li>Minimum 8 characters</li>
                      <li>At least one uppercase letter</li>
                      <li>At least one number</li>
                      <li>At least one special character</li>
                    </ul>
                  </div>
                  {['Current Password','New Password','Confirm New Password'].map((label) => (
                    <Input key={label} label={label} type="password" placeholder={`Enter ${label.toLowerCase()}`} />
                  ))}
                </div>
              )}

              {/* Notifications */}
              {tab === 'notifications' && (
                <div className="space-y-1">
                  <p className="text-[14px] font-semibold mb-3" style={{ color: '#212529' }}>Email Notifications</p>
                  <Toggle label="New support ticket filed" sub="Get notified when a subscriber files a ticket" checked={notifs.email_tickets} onChange={(v) => setNotifs((p) => ({ ...p, email_tickets: v }))} />
                  <Toggle label="Payment received" sub="Get notified when a subscriber makes a payment" checked={notifs.email_payments} onChange={(v) => setNotifs((p) => ({ ...p, email_payments: v }))} />
                  <Toggle label="Plan upgrade request" sub="Get notified when a subscriber requests an upgrade" checked={notifs.email_upgrades} onChange={(v) => setNotifs((p) => ({ ...p, email_upgrades: v }))} />
                  <Toggle label="New subscriber registered" sub="Get notified when a new account is activated" checked={notifs.new_subscribers} onChange={(v) => setNotifs((p) => ({ ...p, new_subscribers: v }))} />
                  <p className="text-[14px] font-semibold mb-1 mt-5 pt-4" style={{ color: '#212529', borderTop: '1px solid #F3F6F9', paddingTop: '16px' }}>System Alerts</p>
                  <Toggle label="HubSpot sync failures" sub="Alert when CRM sync fails for a contact or ticket" checked={notifs.hubspot_fail} onChange={(v) => setNotifs((p) => ({ ...p, hubspot_fail: v }))} />
                  <Toggle label="SMS critical alerts" sub="Receive SMS for urgent system events" checked={notifs.sms_alerts} onChange={(v) => setNotifs((p) => ({ ...p, sms_alerts: v }))} />
                </div>
              )}

              {/* Security */}
              {tab === 'security' && (
                <div>
                  <div className="space-y-1 mb-6">
                    <p className="text-[14px] font-semibold mb-3" style={{ color: '#212529' }}>Account Security</p>
                    <Toggle label="Two-Factor Authentication" sub="Add an extra layer of security with SMS or authenticator app" checked={security.two_factor} onChange={(v) => setSecurity((p) => ({ ...p, two_factor: v }))} />
                    <Toggle label="Login activity alerts" sub="Get notified when a new device signs in to your account" checked={security.login_alerts} onChange={(v) => setSecurity((p) => ({ ...p, login_alerts: v }))} />
                    <Toggle label="API access enabled" sub="Allow external applications to access the admin API" checked={security.api_access} onChange={(v) => setSecurity((p) => ({ ...p, api_access: v }))} />
                  </div>
                  <div className="p-4 rounded-xl mb-4" style={{ background: '#FEF6E4', border: '1px solid #F7B84B' }}>
                    <p className="text-[13px] font-semibold" style={{ color: '#F7B84B' }}>Active Sessions</p>
                    <p className="text-[12px] mt-1" style={{ color: '#92400E' }}>You are currently signed in on 2 devices. <button className="font-semibold underline" style={{ color: '#F7B84B' }}>Sign out all other sessions</button></p>
                  </div>
                  <div className="pt-4" style={{ borderTop: '1px solid #F3F6F9' }}>
                    <p className="text-[14px] font-semibold mb-3" style={{ color: '#F06548' }}>Danger Zone</p>
                    <button className="h-9 px-4 text-[13px] font-semibold rounded-lg transition-opacity hover:opacity-80" style={{ background: '#FEE9E5', color: '#F06548', border: '1px solid #FCA5A5' }}>
                      Delete My Account
                    </button>
                  </div>
                </div>
              )}

              {/* Save button */}
              <div className="flex justify-end mt-6 pt-5" style={{ borderTop: '1px solid #F3F6F9' }}>
                <button onClick={handleSave} disabled={saving} className="h-9 px-6 text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: '#405189', color: '#fff' }}>
                  {saving && <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
                  {saving ? 'Saving...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {toast && <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-[13px] font-semibold shadow-xl" style={{ background: '#0AB39C' }}>{toast}</div>}
    </>
  );
}

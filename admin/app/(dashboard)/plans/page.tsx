'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Modal, Field, Input, Textarea, Select, Toggle, Btn } from '@/components/ui/Modal';
import { ADMIN_DEMO_PLANS } from '@/lib/mockData';

type Plan = typeof ADMIN_DEMO_PLANS[0];

const PLAN_COLORS = ['#405189','#299CDB','#0AB39C','#F7B84B','#F06548','#7C3AED'];
const TYPE_CHIP: Record<string, [string, string]> = {
  fiber:  ['#299CDB', '#E3F2FB'],
  cable:  ['#F7B84B', '#FEF6E4'],
  bundle: ['#7C3AED', '#EDE9FE'],
};
function TypeChip({ type }: { type: string }) {
  const [fg, bg] = TYPE_CHIP[type] ?? ['#878A99', '#F3F6F9'];
  return <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize" style={{ color: fg, background: bg }}>{type}</span>;
}

const EMPTY: Partial<Plan> = {
  plan_code: '', plan_name: '', plan_type: 'fiber', speed_down_mbps: 50,
  speed_up_mbps: 50, monthly_fee: 0, install_fee: 0, contract_months: 12,
  description: '', features: [], tags: [], is_active: true, is_featured: false,
  subscriber_count: 0, pending_upgrades: 0, monthly_revenue: 0,
};
let _nextId = 100;

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(ADMIN_DEMO_PLANS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState<Partial<Plan>>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, id: `plan-new-${++_nextId}` }); setModalOpen(true); };
  const openEdit = (p: Plan) => { setEditing(p); setForm({ ...p }); setModalOpen(true); };
  const f = (k: keyof Plan, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.plan_name || !form.plan_code) { showToast('Plan name and code are required.'); return; }
    if (editing) {
      setPlans((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...form } as Plan : p));
      showToast('Plan updated successfully.');
    } else {
      setPlans((prev) => [...prev, { ...EMPTY, ...form } as Plan]);
      showToast('Plan created successfully.');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setPlans((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast('Plan deleted.');
  };

  const active = plans.filter((p) => p.is_active).length;
  const totalSubs = plans.reduce((s, p) => s + p.subscriber_count, 0);
  const totalRev = plans.reduce((s, p) => s + p.monthly_revenue, 0);

  return (
    <>
      <Header
        title="Plans"
        tag="Product"
        subtitle="Manage all internet and bundle plans"
        actions={
          <button onClick={openAdd} className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-opacity hover:opacity-90" style={{ background: '#405189', color: '#fff' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Plan
          </button>
        }
      />
      <main className="flex-1 p-6 space-y-5 overflow-auto" style={{ background: '#F3F6F9' }}>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Active Plans', val: active, color: '#0AB39C' },
            { label: 'Total Subscribers', val: totalSubs.toLocaleString(), color: '#299CDB' },
            { label: 'Monthly Revenue', val: `PHP ${(totalRev / 1000).toFixed(0)}k`, color: '#405189' },
            { label: 'Total Plans', val: plans.length, color: '#F7B84B' },
          ].map((s, i) => (
            <div key={s.label} className={`vcard au s${i+1} rounded-xl p-5 bg-white`} style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <p className="text-[32px] font-bold leading-none" style={{ color: s.color }}>{s.val}</p>
              <p className="text-[13px] font-semibold mt-2" style={{ color: '#495057' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl au s3" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
            <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>All Plans ({plans.length})</p>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F6F9' }}>
                {['Plan','Type','Speed','Price','Contract','Subscribers','Status',''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, i) => (
                <tr key={plan.id} className="vrow" style={{ borderBottom: '1px solid #F8FAFC', opacity: plan.is_active ? 1 : 0.5 }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: PLAN_COLORS[i % PLAN_COLORS.length] + '18' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PLAN_COLORS[i % PLAN_COLORS.length]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-[14px] font-semibold" style={{ color: '#212529' }}>{plan.plan_name}</p>
                          {plan.is_featured && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase" style={{ background: '#E3F2FB', color: '#299CDB' }}>Featured</span>}
                        </div>
                        <p className="text-[11px] font-mono" style={{ color: '#ADB5BD' }}>{plan.plan_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><TypeChip type={plan.plan_type} /></td>
                  <td className="px-5 py-4">
                    {plan.speed_down_mbps
                      ? <p className="text-[13px] font-semibold" style={{ color: '#212529' }}>{plan.speed_down_mbps} Mbps</p>
                      : <span style={{ color: '#ADB5BD' }}>-</span>}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[14px] font-bold" style={{ color: '#212529' }}>PHP {plan.monthly_fee.toLocaleString()}</p>
                    <p className="text-[11px]" style={{ color: '#ADB5BD' }}>{plan.install_fee > 0 ? `+PHP ${plan.install_fee} install` : 'Free install'}</p>
                  </td>
                  <td className="px-5 py-4 text-[13px]" style={{ color: '#495057' }}>{plan.contract_months > 0 ? `${plan.contract_months} mo` : 'None'}</td>
                  <td className="px-5 py-4 text-[14px] font-semibold" style={{ color: '#212529' }}>{plan.subscriber_count.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold" style={{ color: plan.is_active ? '#0AB39C' : '#878A99', background: plan.is_active ? '#E7F8F5' : '#F3F6F9' }}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(plan)} className="h-7 px-3 text-[12px] font-semibold rounded-lg" style={{ background: '#E3F2FB', color: '#299CDB' }}>Edit</button>
                      <button onClick={() => setDeleteTarget(plan)} className="h-7 px-3 text-[12px] font-semibold rounded-lg" style={{ background: '#FEE9E5', color: '#F06548' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Plan' : 'Add New Plan'} subtitle={editing ? `Editing ${editing.plan_name}` : 'Fill in details to create a new plan'} size="lg"
        footer={<><Btn variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Btn><Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Create Plan'}</Btn></>}>
        <div className="grid grid-cols-2 gap-x-5">
          <Field label="Plan Name" required><Input value={form.plan_name ?? ''} onChange={(e) => f('plan_name', e.target.value)} placeholder="e.g. Fiber 100" /></Field>
          <Field label="Plan Code" required><Input value={form.plan_code ?? ''} onChange={(e) => f('plan_code', e.target.value)} placeholder="e.g. FIBER-100" /></Field>
          <Field label="Plan Type"><Select value={form.plan_type ?? 'fiber'} onChange={(e) => f('plan_type', e.target.value)}><option value="fiber">Fiber</option><option value="cable">Cable</option><option value="bundle">Bundle</option><option value="vas">VAS</option></Select></Field>
          <Field label="Contract (months)"><Input type="number" value={form.contract_months ?? 12} onChange={(e) => f('contract_months', +e.target.value)} /></Field>
          <Field label="Download Speed (Mbps)"><Input type="number" value={form.speed_down_mbps ?? 0} onChange={(e) => f('speed_down_mbps', +e.target.value)} /></Field>
          <Field label="Upload Speed (Mbps)"><Input type="number" value={form.speed_up_mbps ?? 0} onChange={(e) => f('speed_up_mbps', +e.target.value)} /></Field>
          <Field label="Monthly Fee (PHP)" required><Input type="number" value={form.monthly_fee ?? 0} onChange={(e) => f('monthly_fee', +e.target.value)} /></Field>
          <Field label="Install Fee (PHP)"><Input type="number" value={form.install_fee ?? 0} onChange={(e) => f('install_fee', +e.target.value)} /></Field>
        </div>
        <Field label="Description"><Input value={form.description ?? ''} onChange={(e) => f('description', e.target.value)} placeholder="Short plan description" /></Field>
        <Field label="Features" hint="One feature per line"><Textarea value={Array.isArray(form.features) ? (form.features as string[]).join('\n') : ''} onChange={(e) => f('features', e.target.value.split('\n').filter(Boolean))} placeholder={"100 Mbps download\nNo data cap\nFree installation"} rows={4} /></Field>
        <Field label="Tags" hint="Comma-separated: popular, family, wfh, ofw, gaming"><Input value={Array.isArray(form.tags) ? (form.tags as string[]).join(', ') : ''} onChange={(e) => f('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} placeholder="popular, family" /></Field>
        <div className="flex items-center gap-8 mt-2">
          <Toggle checked={form.is_active ?? true} onChange={(v) => f('is_active', v)} label="Active" />
          <Toggle checked={form.is_featured ?? false} onChange={(v) => f('is_featured', v)} label="Featured plan" />
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Plan" size="sm"
        footer={<><Btn variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Btn><Btn variant="danger" onClick={handleDelete}>Yes, Delete</Btn></>}>
        <p style={{ color: '#495057' }}>Are you sure you want to delete <strong style={{ color: '#212529' }}>{deleteTarget?.plan_name}</strong>? This cannot be undone.</p>
        {(deleteTarget?.subscriber_count ?? 0) > 0 && (
          <div className="mt-3 p-3 rounded-lg" style={{ background: '#FEF6E4', border: '1px solid #F7B84B' }}>
            <p className="text-[13px] font-semibold" style={{ color: '#F7B84B' }}>Warning: {deleteTarget?.subscriber_count} active subscribers are on this plan.</p>
          </div>
        )}
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-[13px] font-semibold shadow-xl" style={{ background: '#0AB39C' }}>{toast}</div>}
    </>
  );
}

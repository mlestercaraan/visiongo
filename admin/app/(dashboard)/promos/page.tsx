'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Modal, Field, Input, Textarea, Select, Toggle, Btn } from '@/components/ui/Modal';
import { ADMIN_DEMO_PROMOS } from '@/lib/mockData';

type Promo = typeof ADMIN_DEMO_PROMOS[0];

const TYPE_CHIP: Record<string, [string, string]> = {
  discount:     ['#0AB39C', '#E7F8F5'],
  announcement: ['#299CDB', '#E3F2FB'],
  new_plan:     ['#7C3AED', '#EDE9FE'],
  event:        ['#F7B84B', '#FEF6E4'],
  tip:          ['#878A99', '#F3F6F9'],
};

const CARD_BG = ['#0F4C81','#5B21B6','#065F46','#9D174D','#B45309'];

function TypeChip({ type }: { type: string }) {
  const [fg, bg] = TYPE_CHIP[type] ?? ['#878A99', '#F3F6F9'];
  return <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize" style={{ color: fg, background: bg }}>{type.replace('_', ' ')}</span>;
}

const EMPTY: Partial<Promo> = {
  title: '', subtitle: '', body: '', cta_text: '', promo_type: 'announcement',
  target_tags: [], is_active: true, starts_at: new Date().toISOString().split('T')[0],
  ends_at: null, sort_order: 1,
};
let _nextId = 100;

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>(ADMIN_DEMO_PROMOS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [form, setForm] = useState<Partial<Promo>>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Promo | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, id: `promo-new-${++_nextId}`, sort_order: promos.length + 1 }); setModalOpen(true); };
  const openEdit = (p: Promo) => { setEditing(p); setForm({ ...p }); setModalOpen(true); };
  const f = (k: keyof Promo, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.title) { showToast('Title is required.'); return; }
    if (editing) {
      setPromos((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...form } as Promo : p));
      showToast('Promo updated.');
    } else {
      setPromos((prev) => [...prev, { ...EMPTY, ...form } as Promo]);
      showToast('Promo created.');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setPromos((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast('Promo deleted.');
  };

  const toggleActive = (id: string) => {
    setPromos((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !p.is_active } : p));
  };

  const active = promos.filter((p) => p.is_active).length;

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No end';

  return (
    <>
      <Header title="Promos" tag="Content" subtitle="Mobile app carousel cards"
        actions={
          <button onClick={openAdd} className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ background: '#405189', color: '#fff' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Promo
          </button>
        }
      />
      <main className="flex-1 p-6 space-y-5 overflow-auto" style={{ background: '#F3F6F9' }}>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Live in App',       val: active,                   color: '#0AB39C' },
            { label: 'Scheduled / Draft', val: promos.length - active,  color: '#878A99' },
            { label: 'Total Promos',      val: promos.length,            color: '#405189' },
          ].map((s, i) => (
            <div key={s.label} className={`vcard au s${i+1} rounded-xl p-5 bg-white`} style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <p className="text-[32px] font-bold leading-none" style={{ color: s.color }}>{s.val}</p>
              <p className="text-[13px] font-semibold mt-2" style={{ color: '#495057' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-5">
          {/* Live preview */}
          <div className="col-span-2 space-y-3 au s3">
            <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#878A99' }}>App Preview</p>
            {promos.filter((p) => p.is_active).map((promo, i) => (
              <div key={promo.id} className="rounded-xl p-4" style={{ background: CARD_BG[i % CARD_BG.length] }}>
                <p className="text-white font-bold text-[13px] mb-1">{promo.title}</p>
                <p className="text-[11px] mb-3" style={{ color: 'rgba(255,255,255,.65)' }}>{promo.subtitle}</p>
                {promo.cta_text && <span className="inline-block text-white text-[11px] font-semibold px-3 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,.18)' }}>{promo.cta_text}</span>}
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="col-span-3 bg-white rounded-xl au s4" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
              <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>All Promos ({promos.length})</p>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F6F9' }}>
                  {['#','Title','Type','Dates','Status',''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promos.map((promo) => (
                  <tr key={promo.id} className="vrow" style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td className="px-5 py-3.5 text-[13px] font-mono" style={{ color: '#ADB5BD' }}>{promo.sort_order}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-[14px] font-semibold" style={{ color: '#212529' }}>{promo.title}</p>
                      <p className="text-[11px] truncate max-w-[160px]" style={{ color: '#ADB5BD' }}>{promo.subtitle}</p>
                    </td>
                    <td className="px-5 py-3.5"><TypeChip type={promo.promo_type} /></td>
                    <td className="px-5 py-3.5">
                      <p className="text-[12px]" style={{ color: '#495057' }}>{formatDate(promo.starts_at)}</p>
                      <p className="text-[11px]" style={{ color: '#ADB5BD' }}>to {formatDate(promo.ends_at)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleActive(promo.id)} className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80" style={{ color: promo.is_active ? '#0AB39C' : '#878A99', background: promo.is_active ? '#E7F8F5' : '#F3F6F9' }}>
                        {promo.is_active ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(promo)} className="h-7 px-3 text-[12px] font-semibold rounded-lg" style={{ background: '#E3F2FB', color: '#299CDB' }}>Edit</button>
                        <button onClick={() => setDeleteTarget(promo)} className="h-7 px-3 text-[12px] font-semibold rounded-lg" style={{ background: '#FEE9E5', color: '#F06548' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Promo' : 'Add New Promo'} subtitle="Fill in the details for the carousel card" size="md"
        footer={<><Btn variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Btn><Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Create Promo'}</Btn></>}>
        <Field label="Title" required><Input value={form.title ?? ''} onChange={(e) => f('title', e.target.value)} placeholder="e.g. OFW Family Package" /></Field>
        <Field label="Subtitle"><Input value={form.subtitle ?? ''} onChange={(e) => f('subtitle', e.target.value)} placeholder="Short supporting text" /></Field>
        <Field label="Body text"><Textarea value={form.body ?? ''} onChange={(e) => f('body', e.target.value)} placeholder="Promotional message body" rows={2} /></Field>
        <div className="grid grid-cols-2 gap-x-5">
          <Field label="CTA Button Text"><Input value={form.cta_text ?? ''} onChange={(e) => f('cta_text', e.target.value)} placeholder="e.g. Learn More" /></Field>
          <Field label="Promo Type">
            <Select value={form.promo_type ?? 'announcement'} onChange={(e) => f('promo_type', e.target.value)}>
              <option value="announcement">Announcement</option>
              <option value="discount">Discount</option>
              <option value="new_plan">New Plan</option>
              <option value="event">Event</option>
              <option value="tip">Tip</option>
            </Select>
          </Field>
          <Field label="Start Date"><Input type="date" value={typeof form.starts_at === 'string' ? form.starts_at.split('T')[0] : ''} onChange={(e) => f('starts_at', e.target.value)} /></Field>
          <Field label="End Date" hint="Leave empty for no end date"><Input type="date" value={form.ends_at ? (form.ends_at as string).split('T')[0] : ''} onChange={(e) => f('ends_at', e.target.value || null)} /></Field>
          <Field label="Sort Order"><Input type="number" value={form.sort_order ?? 1} onChange={(e) => f('sort_order', +e.target.value)} /></Field>
          <Field label="Target Tags" hint="Comma-separated: ofw, gaming, wfh"><Input value={Array.isArray(form.target_tags) ? (form.target_tags as string[]).join(', ') : ''} onChange={(e) => f('target_tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} placeholder="ofw, gaming" /></Field>
        </div>
        <div className="mt-2">
          <Toggle checked={form.is_active ?? true} onChange={(v) => f('is_active', v)} label="Publish immediately (show in app)" />
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Promo" size="sm"
        footer={<><Btn variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Btn><Btn variant="danger" onClick={handleDelete}>Yes, Delete</Btn></>}>
        <p style={{ color: '#495057' }}>Are you sure you want to delete <strong style={{ color: '#212529' }}>{deleteTarget?.title}</strong>?</p>
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-[13px] font-semibold shadow-xl" style={{ background: '#0AB39C' }}>{toast}</div>}
    </>
  );
}

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { Modal, Field, Input, Select, Toggle, Btn } from '@/components/ui/Modal';
import { ADMIN_DEMO_SERVICE_AREAS } from '@/lib/mockData';

const ServiceAreaMap = dynamic(() => import('@/components/ui/ServiceAreaMap'), { ssr: false });

type Area = typeof ADMIN_DEMO_SERVICE_AREAS[0];

const PROVINCE_COLOR: Record<string, string> = {
  'Batangas':        '#405189',
  'Quezon Province': '#299CDB',
  'Zambales':        '#0AB39C',
};
const PROVINCES = ['Batangas', 'Quezon Province', 'Zambales'];

const EMPTY: Partial<Area> = {
  province: 'Batangas', municipality: '', barangay: '', is_serviceable: false, waitlist_count: 0,
};
let _nextId = 100;

export default function ServiceAreasPage() {
  const [areas, setAreas] = useState<Area[]>(ADMIN_DEMO_SERVICE_AREAS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);
  const [form, setForm] = useState<Partial<Area>>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Area | null>(null);
  const [filterProv, setFilterProv] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, id: `sa-new-${++_nextId}` }); setModalOpen(true); };
  const openEdit = (a: Area) => { setEditing(a); setForm({ ...a }); setModalOpen(true); };
  const f = (k: keyof Area, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.barangay || !form.municipality) { showToast('Barangay and municipality are required.'); return; }
    if (editing) {
      setAreas((prev) => prev.map((a) => a.id === editing.id ? { ...a, ...form } as Area : a));
      showToast('Area updated.');
    } else {
      setAreas((prev) => [...prev, { ...EMPTY, ...form } as Area]);
      showToast('Area added.');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setAreas((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast('Area removed.');
  };

  const toggleServiceable = (id: string) => {
    setAreas((prev) => prev.map((a) => a.id === id ? { ...a, is_serviceable: !a.is_serviceable } : a));
  };

  const filtered = areas.filter((a) => {
    if (filterProv && a.province !== filterProv) return false;
    if (filterStatus === 'serviceable' && !a.is_serviceable) return false;
    if (filterStatus === 'not-yet' && a.is_serviceable) return false;
    return true;
  });

  const serviceable = areas.filter((a) => a.is_serviceable).length;
  const totalWaitlist = areas.reduce((s, a) => s + a.waitlist_count, 0);
  const topDemand = [...areas].filter((a) => !a.is_serviceable && a.waitlist_count > 0).sort((a, b) => b.waitlist_count - a.waitlist_count);

  return (
    <>
      <Header title="Service Areas" tag="Coverage" subtitle="Serviceable barangays and expansion demand"
        actions={
          <button onClick={openAdd} className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ background: '#405189', color: '#fff' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Area
          </button>
        }
      />
      <main className="flex-1 p-6 space-y-5 overflow-auto" style={{ background: '#F3F6F9' }}>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Serviceable',  val: serviceable,                color: '#0AB39C' },
            { label: 'Not Yet',      val: areas.length - serviceable, color: '#878A99' },
            { label: 'On Waitlist',  val: totalWaitlist,             color: '#F7B84B' },
            { label: 'Total Areas',  val: areas.length,              color: '#405189' },
          ].map((s, i) => (
            <div key={s.label} className={`vcard au s${i+1} rounded-xl p-5 bg-white`} style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <p className="text-[32px] font-bold leading-none" style={{ color: s.color }}>{s.val}</p>
              <p className="text-[13px] font-semibold mt-2" style={{ color: '#495057' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <ServiceAreaMap areas={areas} />

        <div className="grid grid-cols-3 gap-5">
          {/* Province summary + top demand */}
          <div className="space-y-3 au s3">
            {PROVINCES.map((prov, pi) => {
              const pAreas = areas.filter((a) => a.province === prov);
              const pCovered = pAreas.filter((a) => a.is_serviceable).length;
              const pWait = pAreas.reduce((s, a) => s + a.waitlist_count, 0);
              const pPct = pAreas.length > 0 ? Math.round((pCovered / pAreas.length) * 100) : 0;
              return (
                <div key={prov} className={`vcard rounded-xl p-4 bg-white s${pi+1}`} style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: PROVINCE_COLOR[prov] }} />
                      <span className="text-[14px] font-semibold" style={{ color: '#212529' }}>{prov}</span>
                    </div>
                    <span className="text-[12px]" style={{ color: '#878A99' }}>{pCovered}/{pAreas.length}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: '#F3F6F9' }}>
                    <div className="sfill h-1.5 rounded-full" style={{ width: `${pPct}%`, background: PROVINCE_COLOR[prov] }} />
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span style={{ color: '#ADB5BD' }}>{pPct}% covered</span>
                    {pWait > 0 && <span style={{ color: '#F7B84B', fontWeight: 600 }}>{pWait} waiting</span>}
                  </div>
                </div>
              );
            })}

            <div className="rounded-xl p-4 bg-white au s4" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <p className="text-[14px] font-semibold mb-3" style={{ color: '#212529' }}>Highest Demand</p>
              <div className="space-y-2.5">
                {topDemand.slice(0, 4).map((area) => (
                  <div key={area.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: '#495057' }}>{area.barangay}</p>
                      <p className="text-[11px]" style={{ color: '#ADB5BD' }}>{area.municipality}</p>
                    </div>
                    <span className="text-[16px] font-bold" style={{ color: '#F7B84B' }}>{area.waitlist_count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="col-span-2 bg-white rounded-xl au s4" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: '1px solid #F3F6F9' }}>
              <select value={filterProv} onChange={(e) => setFilterProv(e.target.value)} className="h-8 rounded-lg px-2.5 text-[12px] outline-none" style={{ border: '1px solid #E9EBEC', color: '#495057', background: '#fff' }}>
                <option value="">All Provinces</option>
                {PROVINCES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-lg px-2.5 text-[12px] outline-none" style={{ border: '1px solid #E9EBEC', color: '#495057', background: '#fff' }}>
                <option value="">All Coverage</option>
                <option value="serviceable">Serviceable</option>
                <option value="not-yet">Not Yet</option>
              </select>
              <span className="ml-auto text-[12px]" style={{ color: '#ADB5BD' }}>{filtered.length} areas</span>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F6F9' }}>
                  {['Barangay','Municipality','Province','Coverage','Waitlist',''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((area) => (
                  <tr key={area.id} className="vrow" style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td className="px-5 py-3 text-[14px] font-semibold" style={{ color: '#212529' }}>{area.barangay}</td>
                    <td className="px-5 py-3 text-[13px]" style={{ color: '#495057' }}>{area.municipality}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: PROVINCE_COLOR[area.province] ?? '#94A3B8' }} />
                        <span className="text-[12px]" style={{ color: '#495057' }}>{area.province}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleServiceable(area.id)} className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80" style={{ color: area.is_serviceable ? '#0AB39C' : '#878A99', background: area.is_serviceable ? '#E7F8F5' : '#F3F6F9' }}>
                        {area.is_serviceable ? 'Covered' : 'Not yet'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-[14px] font-semibold" style={{ color: area.waitlist_count > 0 ? '#F7B84B' : '#ADB5BD' }}>
                      {area.waitlist_count > 0 ? area.waitlist_count : '-'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(area)} className="h-7 px-3 text-[12px] font-semibold rounded-lg" style={{ background: '#E3F2FB', color: '#299CDB' }}>Edit</button>
                        <button onClick={() => setDeleteTarget(area)} className="h-7 px-3 text-[12px] font-semibold rounded-lg" style={{ background: '#FEE9E5', color: '#F06548' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service Area' : 'Add Service Area'} size="sm"
        footer={<><Btn variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Btn><Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Add Area'}</Btn></>}>
        <Field label="Province" required>
          <Select value={form.province ?? 'Batangas'} onChange={(e) => f('province', e.target.value)}>
            {PROVINCES.map((p) => <option key={p}>{p}</option>)}
          </Select>
        </Field>
        <Field label="Municipality" required><Input value={form.municipality ?? ''} onChange={(e) => f('municipality', e.target.value)} placeholder="e.g. Lipa City" /></Field>
        <Field label="Barangay" required><Input value={form.barangay ?? ''} onChange={(e) => f('barangay', e.target.value)} placeholder="e.g. San Pedro" /></Field>
        <Field label="Waitlist Count" hint="Number of people waiting for service">
          <Input type="number" value={form.waitlist_count ?? 0} onChange={(e) => f('waitlist_count', +e.target.value)} />
        </Field>
        <div className="mt-2">
          <Toggle checked={form.is_serviceable ?? false} onChange={(v) => f('is_serviceable', v)} label="Currently serviceable" />
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Service Area" size="sm"
        footer={<><Btn variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Btn><Btn variant="danger" onClick={handleDelete}>Yes, Remove</Btn></>}>
        <p style={{ color: '#495057' }}>Remove <strong style={{ color: '#212529' }}>{deleteTarget?.barangay}, {deleteTarget?.municipality}</strong> from the service area list?</p>
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-[13px] font-semibold shadow-xl" style={{ background: '#0AB39C' }}>{toast}</div>}
    </>
  );
}

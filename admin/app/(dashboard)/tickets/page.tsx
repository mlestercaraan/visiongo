'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Modal, Field, Input, Textarea, Select, Btn } from '@/components/ui/Modal';
import { ADMIN_DEMO_TICKETS } from '@/lib/mockData';

type Ticket = typeof ADMIN_DEMO_TICKETS[0];
type View = 'list' | 'kanban';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; col: string }> = {
  open:        { label: 'Open',        color: '#299CDB', bg: '#E3F2FB', col: 'border-t-[#299CDB]' },
  in_progress: { label: 'In Progress', color: '#F7B84B', bg: '#FEF6E4', col: 'border-t-[#F7B84B]' },
  resolved:    { label: 'Resolved',    color: '#0AB39C', bg: '#E7F8F5', col: 'border-t-[#0AB39C]' },
  closed:      { label: 'Closed',      color: '#878A99', bg: '#F3F6F9', col: 'border-t-[#878A99]' },
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  low:    { color: '#ADB5BD', bg: '#F3F6F9' },
  normal: { color: '#299CDB', bg: '#E3F2FB' },
  high:   { color: '#F7B84B', bg: '#FEF6E4' },
  urgent: { color: '#F06548', bg: '#FEE9E5' },
};

function StatusChip({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#878A99', bg: '#F3F6F9' };
  return <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>;
}
function PriorityChip({ priority }: { priority: string }) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.normal;
  return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold capitalize" style={{ color: cfg.color, background: cfg.bg }}>{priority}</span>;
}

const EMPTY_TICKET: Partial<Ticket> = {
  ticket_type: 'technical', category: '', subject: '', description: '',
  status: 'open', priority: 'normal', assigned_agent: null,
};
let _nextId = 200;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatDue(d?: string | null) {
  if (!d) return '-';
  const due = new Date(d);
  const today = new Date();
  const overdue = due < today;
  const str = due.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
  return { str, overdue };
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(ADMIN_DEMO_TICKETS);
  const [view, setView] = useState<View>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Ticket>>(EMPTY_TICKET);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const dragTicket = useRef<Ticket | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const f = (k: keyof Ticket, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleCreate = () => {
    if (!form.subject) { showToast('Subject is required.'); return; }
    const id = `tkt-new-${++_nextId}`;
    const num = `AV-TKT-${Date.now().toString().slice(-8)}`;
    setTickets((prev) => [({
      ...EMPTY_TICKET, ...form, id, ticket_number: num,
      subscriber_name: form.subscriber_name || 'Unassigned',
      account_number: '', hubspot_ticket_id: null,
      created_at: new Date().toISOString(), due_date: null,
    }) as unknown as Ticket, ...prev]);
    setModalOpen(false);
    showToast('Ticket created.');
  };

  const moveStatus = (id: string, newStatus: string) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: newStatus } : t));
  };

  const filtered = tickets.filter((t) => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterType && t.ticket_type !== filterType) return false;
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase()) && !t.subscriber_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const byStatus = (s: string) => filtered.filter((t) => t.status === s);
  const statuses = ['open', 'in_progress', 'resolved', 'closed'];

  const statCounts = { open: tickets.filter((t) => t.status === 'open').length, in_progress: tickets.filter((t) => t.status === 'in_progress').length, resolved: tickets.filter((t) => t.status === 'resolved').length, closed: tickets.filter((t) => t.status === 'closed').length };

  return (
    <>
      <Header title="Tickets" tag="Support" subtitle="Subscriber support and issue tracking"
        actions={
          <div className="flex items-center gap-2.5">
            {/* View toggle */}
            <div className="flex items-center h-9 rounded-lg overflow-hidden" style={{ border: '1px solid #E9EBEC', background: '#F3F6F9' }}>
              {([['list','List'],['kanban','Kanban']] as [View, string][]).map(([v, label]) => (
                <button key={v} onClick={() => setView(v)} className="h-full px-4 text-[13px] font-semibold transition-colors" style={{ background: view === v ? '#405189' : 'transparent', color: view === v ? '#fff' : '#878A99' }}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => { setForm({ ...EMPTY_TICKET }); setModalOpen(true); }} className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ background: '#405189', color: '#fff' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create Ticket
            </button>
          </div>
        }
      />
      <main className="flex-1 overflow-auto p-6 space-y-5" style={{ background: '#F3F6F9' }}>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Tickets', val: tickets.length,           color: '#405189' },
            { label: 'Open',          val: statCounts.open,          color: '#299CDB' },
            { label: 'In Progress',   val: statCounts.in_progress,   color: '#F7B84B' },
            { label: 'Resolved',      val: statCounts.resolved,      color: '#0AB39C' },
          ].map((s, i) => (
            <div key={s.label} className={`vcard au s${i+1} rounded-xl p-5 bg-white`} style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <p className="text-[32px] font-bold leading-none" style={{ color: s.color }}>{s.val}</p>
              <p className="text-[13px] font-semibold mt-2" style={{ color: '#495057' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets..." className="w-full pl-9 pr-3 h-9 rounded-lg text-[13px] outline-none" style={{ border: '1px solid #E9EBEC', color: '#212529', background: '#fff' }} />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-9 rounded-lg px-2.5 text-[13px] outline-none" style={{ border: '1px solid #E9EBEC', color: '#495057', background: '#fff' }}>
            <option value="">All Status</option>
            {statuses.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-9 rounded-lg px-2.5 text-[13px] outline-none" style={{ border: '1px solid #E9EBEC', color: '#495057', background: '#fff' }}>
            <option value="">All Types</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
          </select>
          <span className="ml-auto text-[12px]" style={{ color: '#ADB5BD' }}>{filtered.length} tickets</span>
        </div>

        {/* ---- KANBAN VIEW ---- */}
        {view === 'kanban' && (
          <div className="grid grid-cols-4 gap-4 items-start">
            {statuses.map((status) => {
              const cfg = STATUS_CONFIG[status];
              const cols = byStatus(status);
              const isOver = dragOver === status;
              return (
                <div
                  key={status}
                  className="rounded-xl transition-colors"
                  style={{ background: isOver ? '#E2E8F0' : '#EAECEF' }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(status); }}
                  onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragTicket.current && dragTicket.current.status !== status) {
                      moveStatus(dragTicket.current.id, status);
                      showToast(`Moved to ${cfg.label}`);
                    }
                    setDragId(null);
                    setDragOver(null);
                    dragTicket.current = null;
                  }}
                >
                  <div className="flex items-center justify-between px-4 py-3 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
                      <span className="text-[13px] font-bold uppercase tracking-wide" style={{ color: '#495057' }}>{cfg.label}</span>
                    </div>
                    <span className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center text-white" style={{ background: cfg.color }}>{cols.length}</span>
                  </div>

                  <div className="p-2 space-y-2 min-h-[200px]">
                    {cols.map((ticket) => {
                      const due = formatDue((ticket as any).due_date);
                      const isDragging = dragId === ticket.id;
                      return (
                        <div
                          key={ticket.id}
                          draggable
                          onDragStart={(e) => {
                            dragTicket.current = ticket;
                            setDragId(ticket.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragEnd={() => { setDragId(null); setDragOver(null); dragTicket.current = null; }}
                          className="bg-white rounded-xl p-4 cursor-grab active:cursor-grabbing select-none transition-all"
                          style={{
                            border: `1px solid #E9EBEC`,
                            borderTop: `3px solid ${cfg.color}`,
                            boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,.18)' : '0 1px 3px rgba(0,0,0,.06)',
                            opacity: isDragging ? 0.55 : 1,
                            transform: isDragging ? 'rotate(1.5deg) scale(1.02)' : 'none',
                          }}
                        >
                          {/* Drag handle hint */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-semibold" style={{ color: '#ADB5BD' }}>{ticket.ticket_number}</span>
                            <div className="flex items-center gap-1.5">
                              <PriorityChip priority={ticket.priority} />
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="5" r="1" fill="#CBD5E1"/><circle cx="9" cy="12" r="1" fill="#CBD5E1"/><circle cx="9" cy="19" r="1" fill="#CBD5E1"/>
                                <circle cx="15" cy="5" r="1" fill="#CBD5E1"/><circle cx="15" cy="12" r="1" fill="#CBD5E1"/><circle cx="15" cy="19" r="1" fill="#CBD5E1"/>
                              </svg>
                            </div>
                          </div>
                          <Link href={`/tickets/${ticket.id}`} className="text-[13px] font-semibold leading-snug hover:underline block mb-2" style={{ color: '#212529' }} onClick={(e) => isDragging && e.preventDefault()}>
                            {ticket.subject}
                          </Link>
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-[11px] px-2 py-0.5 rounded font-semibold" style={{ background: ticket.ticket_type === 'technical' ? '#E3F2FB' : '#FEF6E4', color: ticket.ticket_type === 'technical' ? '#299CDB' : '#F7B84B' }}>
                              {ticket.ticket_type}
                            </span>
                            <span className="text-[11px]" style={{ color: '#ADB5BD' }}>{ticket.category}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: '#405189' }}>
                                {ticket.subscriber_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </div>
                              <span className="text-[11px]" style={{ color: '#878A99' }}>{ticket.subscriber_name.split(' ')[0]}</span>
                            </div>
                            {typeof due === 'object' && (
                              <span className="text-[10px] font-semibold" style={{ color: due.overdue ? '#F06548' : '#ADB5BD' }}>{due.str}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {/* Drop zone indicator */}
                    {isOver && dragTicket.current && dragTicket.current.status !== status && (
                      <div className="rounded-xl border-2 border-dashed h-16 flex items-center justify-center" style={{ borderColor: cfg.color, background: cfg.bg + '60' }}>
                        <span className="text-[12px] font-semibold" style={{ color: cfg.color }}>Drop here to move to {cfg.label}</span>
                      </div>
                    )}
                    {cols.length === 0 && !isOver && (
                      <p className="text-center py-8 text-[12px]" style={{ color: '#ADB5BD' }}>No tickets - drag one here</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- LIST VIEW ---- */}
        {view === 'list' && (
          <div className="bg-white rounded-xl au s3" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F6F9' }}>
                  {['Ticket','Subscriber','Subject','Type','Priority','Status','Due Date','Assigned',''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket) => {
                  const due = formatDue((ticket as any).due_date);
                  return (
                    <tr key={ticket.id} className="vrow" style={{ borderBottom: '1px solid #F8FAFC' }}>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-mono font-bold" style={{ color: '#405189' }}>{ticket.ticket_number}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-[14px] font-semibold" style={{ color: '#212529' }}>{ticket.subscriber_name}</p>
                        <p className="text-[11px] font-mono" style={{ color: '#ADB5BD' }}>{ticket.account_number}</p>
                      </td>
                      <td className="px-5 py-3.5 max-w-[220px]">
                        <Link href={`/tickets/${ticket.id}`} className="text-[13px] font-semibold hover:underline" style={{ color: '#212529' }}>
                          {ticket.subject}
                        </Link>
                        <p className="text-[11px] mt-0.5" style={{ color: '#ADB5BD' }}>{ticket.category}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded capitalize" style={{ background: ticket.ticket_type === 'technical' ? '#E3F2FB' : '#FEF6E4', color: ticket.ticket_type === 'technical' ? '#299CDB' : '#F7B84B' }}>
                          {ticket.ticket_type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><PriorityChip priority={ticket.priority} /></td>
                      <td className="px-5 py-3.5"><StatusChip status={ticket.status} /></td>
                      <td className="px-5 py-3.5">
                        {typeof due === 'object'
                          ? <span className="text-[12px] font-medium" style={{ color: due.overdue ? '#F06548' : '#495057' }}>{due.str}</span>
                          : <span style={{ color: '#ADB5BD' }}>-</span>}
                      </td>
                      <td className="px-5 py-3.5 text-[12px]" style={{ color: (ticket as any).assigned_agent ? '#495057' : '#ADB5BD' }}>
                        {(ticket as any).assigned_agent ?? 'Unassigned'}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link href={`/tickets/${ticket.id}`} className="h-7 px-3 text-[12px] font-semibold rounded-lg inline-flex items-center" style={{ background: '#E3F2FB', color: '#299CDB' }}>
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="py-12 text-center text-[13px]" style={{ color: '#ADB5BD' }}>No tickets match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Create ticket modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New Ticket" subtitle="File a support ticket on behalf of a subscriber" size="md"
        footer={<><Btn variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Btn><Btn onClick={handleCreate}>Create Ticket</Btn></>}>
        <div className="grid grid-cols-2 gap-x-5">
          <Field label="Subscriber Name"><Input value={form.subscriber_name ?? ''} onChange={(e) => f('subscriber_name', e.target.value)} placeholder="e.g. Maria Santos" /></Field>
          <Field label="Account Number"><Input value={form.account_number ?? ''} onChange={(e) => f('account_number', e.target.value)} placeholder="e.g. AV-BTG-10234" /></Field>
          <Field label="Ticket Type">
            <Select value={form.ticket_type ?? 'technical'} onChange={(e) => f('ticket_type', e.target.value)}>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Category"><Input value={form.category ?? ''} onChange={(e) => f('category', e.target.value)} placeholder="e.g. No internet, Slow speed" /></Field>
          <Field label="Priority">
            <Select value={form.priority ?? 'normal'} onChange={(e) => f('priority', e.target.value)}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </Field>
          <Field label="Assigned Agent"><Input value={(form as any).assigned_agent ?? ''} onChange={(e) => f('assigned_agent' as keyof Ticket, e.target.value || null)} placeholder="e.g. Jomar Santos" /></Field>
        </div>
        <Field label="Subject" required><Input value={form.subject ?? ''} onChange={(e) => f('subject', e.target.value)} placeholder="Brief description of the issue" /></Field>
        <Field label="Description"><Textarea value={form.description ?? ''} onChange={(e) => f('description', e.target.value)} placeholder="Detailed description of the issue..." rows={4} /></Field>
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-[13px] font-semibold shadow-xl" style={{ background: '#0AB39C' }}>{toast}</div>}
    </>
  );
}

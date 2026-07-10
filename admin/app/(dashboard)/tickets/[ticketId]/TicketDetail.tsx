'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ADMIN_DEMO_TICKETS, ADMIN_DEMO_TICKET_COMMENTS } from '@/lib/mockData';

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  open:        { label: 'Open',        color: '#299CDB', bg: '#E3F2FB' },
  in_progress: { label: 'In Progress', color: '#F7B84B', bg: '#FEF6E4' },
  resolved:    { label: 'Resolved',    color: '#0AB39C', bg: '#E7F8F5' },
  closed:      { label: 'Closed',      color: '#878A99', bg: '#F3F6F9' },
};
const PRIORITY_CFG: Record<string, { color: string; bg: string }> = {
  low:    { color: '#ADB5BD', bg: '#F3F6F9' },
  normal: { color: '#299CDB', bg: '#E3F2FB' },
  high:   { color: '#F7B84B', bg: '#FEF6E4' },
  urgent: { color: '#F06548', bg: '#FEE9E5' },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function formatShort(d: string) {
  return new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start py-3" style={{ borderBottom: '1px solid #F3F6F9' }}>
      <span className="text-[12px] font-semibold w-28 flex-shrink-0 pt-0.5" style={{ color: '#878A99' }}>{label}</span>
      <span className="text-[13px] flex-1" style={{ color: '#212529' }}>{children}</span>
    </div>
  );
}

export default function TicketDetailPage({ ticketId }: { ticketId: string }) {
  const ticket = ADMIN_DEMO_TICKETS.find((t) => t.id === ticketId) ?? ADMIN_DEMO_TICKETS[0];
  const initComments = ADMIN_DEMO_TICKET_COMMENTS[ticket.id] ?? [];
  const [comments, setComments] = useState(initComments);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState(ticket.status);
  const [assigned, setAssigned] = useState((ticket as any).assigned_agent ?? '');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [...prev, { id: `c-new-${Date.now()}`, author: 'Admin', avatar: 'AD', message: newComment, created_at: new Date().toISOString() }]);
    setNewComment('');
    showToast('Comment added.');
  };

  const statusCfg = STATUS_CFG[status] ?? STATUS_CFG.open;
  const priorityCfg = PRIORITY_CFG[ticket.priority] ?? PRIORITY_CFG.normal;

  return (
    <>
      <Header
        title={ticket.ticket_number}
        tag="Tickets"
        subtitle={ticket.subject}
        actions={
          <Link href="/tickets" className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors hover:opacity-90" style={{ background: '#F3F6F9', color: '#495057', border: '1px solid #E9EBEC' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Tickets
          </Link>
        }
      />
      <main className="flex-1 overflow-auto p-6" style={{ background: '#F3F6F9' }}>
        <div className="grid grid-cols-3 gap-5">

          {/* ---- LEFT: Metadata panel ---- */}
          <div className="space-y-4">
            {/* Task info */}
            <div className="bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
                <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Ticket Details</p>
              </div>
              <div className="px-5 py-1">
                <MetaRow label="Ticket #">
                  <span className="font-mono font-bold" style={{ color: '#405189' }}>{ticket.ticket_number}</span>
                </MetaRow>
                <MetaRow label="Type">
                  <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold capitalize" style={{ background: ticket.ticket_type === 'technical' ? '#E3F2FB' : '#FEF6E4', color: ticket.ticket_type === 'technical' ? '#299CDB' : '#F7B84B' }}>
                    {ticket.ticket_type}
                  </span>
                </MetaRow>
                <MetaRow label="Category">{ticket.category}</MetaRow>
                <MetaRow label="Priority">
                  <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize" style={{ color: priorityCfg.color, background: priorityCfg.bg }}>{ticket.priority}</span>
                </MetaRow>
                <MetaRow label="Status">
                  <select value={status} onChange={(e) => { setStatus(e.target.value); showToast('Status updated.'); }}
                    className="h-8 px-2.5 rounded-lg text-[12px] font-semibold outline-none cursor-pointer"
                    style={{ color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.color}40` }}>
                    {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </MetaRow>
                <MetaRow label="Filed on">{formatShort(ticket.created_at)}</MetaRow>
                {(ticket as any).due_date && (
                  <MetaRow label="Due Date">
                    <span style={{ color: new Date((ticket as any).due_date) < new Date() ? '#F06548' : '#495057' }}>
                      {formatShort((ticket as any).due_date)}
                    </span>
                  </MetaRow>
                )}
              </div>
            </div>

            {/* Subscriber */}
            <div className="bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
                <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Subscriber</p>
              </div>
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
                  {ticket.subscriber_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: '#212529' }}>{ticket.subscriber_name}</p>
                  <p className="text-[12px] font-mono" style={{ color: '#ADB5BD' }}>{ticket.account_number}</p>
                </div>
              </div>
              {ticket.account_number && (
                <div className="px-5 pb-4">
                  <Link href={`/subscribers/sub-001`} className="text-[12px] font-semibold hover:underline flex items-center gap-1" style={{ color: '#405189' }}>
                    View subscriber profile
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                </div>
              )}
            </div>

            {/* Assigned agent */}
            <div className="bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
                <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Assigned To</p>
              </div>
              <div className="px-5 py-4">
                <select value={assigned} onChange={(e) => { setAssigned(e.target.value); showToast('Assignment updated.'); }}
                  className="w-full h-9 px-3 rounded-lg text-[13px] outline-none" style={{ border: '1px solid #E9EBEC', color: '#495057', background: '#fff' }}>
                  <option value="">Unassigned</option>
                  <option value="Jomar Santos">Jomar Santos</option>
                  <option value="Ana Reyes">Ana Reyes</option>
                  <option value="Carla Mendoza">Carla Mendoza</option>
                </select>
                {assigned && (
                  <div className="flex items-center gap-2.5 mt-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: '#0AB39C' }}>
                      {assigned.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: '#212529' }}>{assigned}</p>
                      <p className="text-[11px]" style={{ color: '#ADB5BD' }}>Support Agent</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ---- RIGHT: Description + Comments ---- */}
          <div className="col-span-2 space-y-4">
            {/* Description */}
            <div className="bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <div className="px-6 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
                <h4 className="text-[16px] font-semibold" style={{ color: '#212529' }}>{ticket.subject}</h4>
                <p className="text-[12px] mt-1" style={{ color: '#ADB5BD' }}>Filed {formatDate(ticket.created_at)}</p>
              </div>
              <div className="px-6 py-5">
                <p className="text-[14px] leading-relaxed" style={{ color: '#495057' }}>
                  {(ticket as any).description || 'No description provided.'}
                </p>
                {/* Tags */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold capitalize" style={{ background: ticket.ticket_type === 'technical' ? '#E3F2FB' : '#FEF6E4', color: ticket.ticket_type === 'technical' ? '#299CDB' : '#F7B84B' }}>
                    {ticket.ticket_type}
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ background: '#F3F6F9', color: '#878A99' }}>
                    {ticket.category}
                  </span>
                  {ticket.hubspot_ticket_id && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ background: '#FEE9E5', color: '#FF7A59' }}>
                      HubSpot Synced
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F3F6F9' }}>
                <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Activity</p>
                <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#E3F2FB', color: '#299CDB' }}>{comments.length} comments</span>
              </div>

              <div className="px-6 py-4 space-y-5">
                {comments.length === 0 && (
                  <p className="text-center py-6 text-[13px]" style={{ color: '#ADB5BD' }}>No comments yet. Be the first to comment.</p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: c.author === 'System' ? '#ADB5BD' : 'linear-gradient(135deg,#405189,#299CDB)' }}>
                      {c.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[13px] font-semibold" style={{ color: '#212529' }}>{c.author}</span>
                        <span className="text-[11px]" style={{ color: '#ADB5BD' }}>{formatDate(c.created_at)}</span>
                      </div>
                      <div className="rounded-xl p-4 text-[13px] leading-relaxed" style={{ background: '#F8FAFC', border: '1px solid #F3F6F9', color: '#495057' }}>
                        {c.message}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add comment */}
                <div className="flex gap-3 pt-3" style={{ borderTop: '1px solid #F3F6F9' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
                    AD
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment or update..."
                      rows={3}
                      className="w-full rounded-xl p-4 text-[13px] outline-none resize-none"
                      style={{ border: '1px solid #E9EBEC', color: '#212529', background: '#fff', lineHeight: '1.5' }}
                      onFocus={(e) => (e.target.style.borderColor = '#405189')}
                      onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')}
                    />
                    <div className="flex justify-end mt-2">
                      <button onClick={addComment} disabled={!newComment.trim()} className="h-9 px-5 text-[13px] font-semibold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40" style={{ background: '#405189', color: '#fff' }}>
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {toast && <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-[13px] font-semibold shadow-xl" style={{ background: '#0AB39C' }}>{toast}</div>}
    </>
  );
}

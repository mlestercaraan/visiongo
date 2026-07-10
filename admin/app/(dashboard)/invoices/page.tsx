'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ADMIN_DEMO_INVOICES } from '@/lib/mockData';

type Invoice = typeof ADMIN_DEMO_INVOICES[0];

const STATUS_CFG: Record<string, [string, string]> = {
  paid:       ['#0AB39C', '#E7F8F5'],
  unpaid:     ['#F7B84B', '#FEF6E4'],
  overdue:    ['#F06548', '#FEE9E5'],
  cancelled:  ['#878A99', '#F3F6F9'],
};

function Chip({ status }: { status: string }) {
  const [fg, bg] = STATUS_CFG[status] ?? ['#878A99', '#F3F6F9'];
  return <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize" style={{ color: fg, background: bg }}>{status}</span>;
}
function formatDate(d: string) { return new Date(d).toLocaleDateString('en-PH', { day: '2-digit', month: 'short', year: 'numeric' }); }

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>(ADMIN_DEMO_INVOICES);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = invoices.filter((inv) => {
    if (filterStatus && inv.status !== filterStatus) return false;
    if (search && !inv.subscriber_name.toLowerCase().includes(search.toLowerCase()) && !inv.invoice_number.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSent      = invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid      = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalUnpaid    = invoices.filter((i) => i.status === 'unpaid' || i.status === 'overdue').reduce((s, i) => s + i.total, 0);
  const totalCancelled = invoices.filter((i) => i.status === 'cancelled').reduce((s, i) => s + i.total, 0);
  const countPaid      = invoices.filter((i) => i.status === 'paid').length;
  const countUnpaid    = invoices.filter((i) => i.status === 'unpaid' || i.status === 'overdue').length;
  const countCancelled = invoices.filter((i) => i.status === 'cancelled').length;

  return (
    <>
      <Header title="Invoices" tag="Billing" subtitle="Manage subscriber invoices and billing records"
        actions={
          <Link href="/invoices/create" className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ background: '#405189', color: '#fff' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Invoice
          </Link>
        }
      />
      <main className="flex-1 p-6 space-y-5 overflow-auto" style={{ background: '#F3F6F9' }}>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Invoices Sent', val: `PHP ${(totalSent/1000).toFixed(1)}k`, sub: `${invoices.length} invoices sent`, trend: '+89.24%', trendUp: true, color: '#405189', bg: '#EEF0F8', icon: <><rect x="14" y="2" width="4" height="7"/><rect x="10" y="9" width="4" height="5"/><rect x="6" y="14" width="4" height="8"/><rect x="2" y="14" width="4" height="8"/><line x1="22" y1="22" x2="2" y2="22"/></> },
            { label: 'Paid Invoices', val: `PHP ${(totalPaid/1000).toFixed(1)}k`, sub: `${countPaid} paid by subscribers`, trend: '+8.09%', trendUp: true, color: '#0AB39C', bg: '#E7F8F5', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
            { label: 'Unpaid Invoices', val: `PHP ${(totalUnpaid/1000).toFixed(1)}k`, sub: `${countUnpaid} unpaid / overdue`, trend: '+9.01%', trendUp: false, color: '#F7B84B', bg: '#FEF6E4', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
            { label: 'Cancelled', val: `PHP ${(totalCancelled/1000).toFixed(1)}k`, sub: `${countCancelled} cancelled`, trend: '+7.55%', trendUp: true, color: '#F06548', bg: '#FEE9E5', icon: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></> },
          ].map((s, i) => (
            <div key={s.label} className={`vcard au s${i+1} bg-white rounded-xl p-5`} style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#878A99' }}>{s.label}</p>
                  <p className="text-[26px] font-bold leading-none" style={{ color: '#212529' }}>{s.val}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[12px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${s.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {s.trendUp ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                  </svg>
                  {s.trend}
                </span>
                <span className="text-[11px]" style={{ color: '#878A99' }}>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl au s3" style={{ border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F6F9' }}>
            <p className="text-[15px] font-semibold" style={{ color: '#212529' }}>Invoices ({filtered.length})</p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer or invoice..." className="pl-9 pr-3 h-8 w-56 rounded-lg text-[12px] outline-none" style={{ border: '1px solid #E9EBEC', color: '#212529', background: '#F3F6F9' }} />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-lg px-2.5 text-[12px] outline-none" style={{ border: '1px solid #E9EBEC', color: '#495057', background: '#fff' }}>
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F6F9' }}>
                {['Invoice ID','Customer','Billing Period','Date','Due Date','Amount','Status',''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="vrow" style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td className="px-5 py-3.5">
                    <Link href={`/invoices/${inv.id}`} className="text-[13px] font-bold hover:underline" style={{ color: '#405189' }}>{inv.invoice_number}</Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#405189,#299CDB)' }}>
                        {inv.subscriber_name.split(' ').map((n) => n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: '#212529' }}>{inv.subscriber_name}</p>
                        <p className="text-[11px] font-mono" style={{ color: '#ADB5BD' }}>{inv.account_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px]" style={{ color: '#495057' }}>{inv.billing_period}</td>
                  <td className="px-5 py-3.5 text-[13px]" style={{ color: '#495057' }}>{formatDate(inv.date)}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-medium" style={{ color: new Date(inv.due_date) < new Date() && inv.status !== 'paid' ? '#F06548' : '#495057' }}>{formatDate(inv.due_date)}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[14px] font-bold" style={{ color: '#212529' }}>PHP {inv.total.toLocaleString()}</td>
                  <td className="px-5 py-3.5"><Chip status={inv.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/invoices/${inv.id}`} className="h-7 px-2.5 text-[11px] font-semibold rounded-lg inline-flex items-center" style={{ background: '#E3F2FB', color: '#299CDB' }}>View</Link>
                      <Link href={`/invoices/${inv.id}`} className="h-7 px-2.5 text-[11px] font-semibold rounded-lg inline-flex items-center" style={{ background: '#F3F6F9', color: '#878A99' }}>Download</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

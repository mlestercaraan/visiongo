'use client';

import Link from 'next/link';
import { ADMIN_DEMO_INVOICES } from '@/lib/mockData';

const STATUS_CFG: Record<string, [string, string]> = {
  paid:       ['#0AB39C', '#E7F8F5'],
  unpaid:     ['#F7B84B', '#FEF6E4'],
  overdue:    ['#F06548', '#FEE9E5'],
  cancelled:  ['#878A99', '#F3F6F9'],
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-PH', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function InvoiceDetail({ invoiceId }: { invoiceId: string }) {
  const inv = ADMIN_DEMO_INVOICES.find((i) => i.id === invoiceId) ?? ADMIN_DEMO_INVOICES[0];
  const [fg, bg] = STATUS_CFG[inv.status] ?? ['#878A99', '#F3F6F9'];

  return (
    <div className="flex-1 p-6 overflow-auto" style={{ background: '#F3F6F9' }}>
      {/* Action bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-[13px]" style={{ color: '#878A99' }}>
          <Link href="/invoices" className="hover:underline" style={{ color: '#405189' }}>Invoices</Link>
          <span>/</span>
          <span style={{ color: '#212529' }}>Invoice Details</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-opacity hover:opacity-90" style={{ background: '#F3F6F9', color: '#495057', border: '1px solid #E9EBEC' }}
            onClick={() => window.print()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print
          </button>
          <button className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-opacity hover:opacity-90" style={{ background: '#405189', color: '#fff' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Invoice document */}
      <div className="bg-white rounded-xl mx-auto" style={{ maxWidth: '860px', border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#00CFFF' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <span className="text-[20px] font-bold" style={{ color: '#0D1117' }}>Vision<span style={{ color: '#00CFFF' }}>Go</span></span>
              </div>
              <p className="text-[13px]" style={{ color: '#495057' }}>
                Asian Vision Cable and Internet Corporation<br/>
                Sto. Tomas, Batangas, Philippines<br/>
                Tel: (043) 123-4567
              </p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#878A99' }}>Invoice</p>
              <p className="text-[24px] font-black mb-1" style={{ color: '#405189' }}>{inv.invoice_number}</p>
              <span className="inline-flex px-3 py-1 rounded-full text-[12px] font-bold capitalize" style={{ color: fg, background: bg }}>{inv.status}</span>
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-4 gap-4 mb-8 p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #F3F6F9' }}>
            {[
              { label: 'Invoice No', val: inv.invoice_number },
              { label: 'Issue Date',  val: formatDate(inv.date) },
              { label: 'Due Date',    val: formatDate(inv.due_date) },
              { label: 'Total Amount',val: `PHP ${inv.total.toLocaleString()}` },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#ADB5BD' }}>{m.label}</p>
                <p className="text-[14px] font-semibold" style={{ color: m.label === 'Total Amount' ? '#405189' : '#212529' }}>{m.val}</p>
              </div>
            ))}
          </div>

          {/* Billing address */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#ADB5BD' }}>Billed To</p>
              <p className="text-[15px] font-bold mb-1" style={{ color: '#212529' }}>{inv.subscriber_name}</p>
              <p className="text-[13px] mb-0.5" style={{ color: '#495057' }}>{inv.account_number}</p>
              <p className="text-[13px] mb-0.5" style={{ color: '#495057' }}>{inv.address}</p>
              {inv.email && <p className="text-[13px]" style={{ color: '#495057' }}>{inv.email}</p>}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#ADB5BD' }}>Payment Info</p>
              <p className="text-[13px] mb-0.5" style={{ color: '#495057' }}>Plan: <strong style={{ color: '#212529' }}>{inv.plan}</strong></p>
              <p className="text-[13px] mb-0.5" style={{ color: '#495057' }}>Billing period: <strong style={{ color: '#212529' }}>{inv.billing_period}</strong></p>
              {inv.payment_method && <p className="text-[13px]" style={{ color: '#495057' }}>Paid via: <strong style={{ color: '#0AB39C' }}>{inv.payment_method}</strong></p>}
            </div>
          </div>

          {/* Line items */}
          <table className="w-full mb-6" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E9EBEC' }}>
                <th className="text-left px-4 py-3 text-[12px] font-bold uppercase tracking-wide" style={{ color: '#878A99' }}>#</th>
                <th className="text-left px-4 py-3 text-[12px] font-bold uppercase tracking-wide" style={{ color: '#878A99' }}>Description</th>
                <th className="text-right px-4 py-3 text-[12px] font-bold uppercase tracking-wide" style={{ color: '#878A99' }}>Rate</th>
                <th className="text-right px-4 py-3 text-[12px] font-bold uppercase tracking-wide" style={{ color: '#878A99' }}>Qty</th>
                <th className="text-right px-4 py-3 text-[12px] font-bold uppercase tracking-wide" style={{ color: '#878A99' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {inv.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F6F9' }}>
                  <td className="px-4 py-3.5 text-[13px]" style={{ color: '#878A99' }}>{String(i + 1).padStart(2, '0')}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-[14px] font-semibold" style={{ color: '#212529' }}>{item.desc}</p>
                    {item.detail && <p className="text-[12px] mt-0.5" style={{ color: '#ADB5BD' }}>{item.detail}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-right text-[13px]" style={{ color: '#495057' }}>PHP {item.rate.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right text-[13px]" style={{ color: '#495057' }}>{item.qty}</td>
                  <td className="px-4 py-3.5 text-right text-[14px] font-bold" style={{ color: '#212529' }}>PHP {(item.rate * item.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div style={{ width: '280px' }}>
              {[
                { label: 'Sub Total',      val: inv.subtotal },
                { label: 'Tax (0%)',        val: inv.tax },
                { label: 'Discount',       val: inv.discount },
                { label: 'Shipping',       val: inv.shipping },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #F3F6F9' }}>
                  <span className="text-[13px]" style={{ color: '#878A99' }}>{row.label}</span>
                  <span className="text-[13px]" style={{ color: '#495057' }}>PHP {row.val.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 mt-1" style={{ borderTop: '2px solid #E9EBEC' }}>
                <span className="text-[15px] font-bold" style={{ color: '#212529' }}>Total Amount</span>
                <span className="text-[18px] font-black" style={{ color: '#405189' }}>PHP {inv.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="p-4 rounded-xl" style={{ background: '#EEF0F8', border: '1px solid #D6DBF0' }}>
            <p className="text-[12px] font-bold uppercase tracking-wide mb-1.5" style={{ color: '#405189' }}>Notes</p>
            <p className="text-[13px]" style={{ color: '#495057' }}>
              All accounts are to be paid within 7 days from receipt of invoice. To be paid by GCash, Maya, bank transfer, or cash at any Asian Vision branch.
              If payment is not received within 7 days, a late payment penalty of PHP 100 will be applied.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

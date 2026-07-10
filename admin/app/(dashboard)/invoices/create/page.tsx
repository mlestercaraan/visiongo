'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type LineItem = { desc: string; detail: string; rate: number; qty: number };

const EMPTY_ITEM: LineItem = { desc: '', detail: '', rate: 0, qty: 1 };
const TAX_RATE = 0;
const DISCOUNT = 0;
const SHIPPING = 0;

let _nextInvoice = 700;

export default function CreateInvoicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    subscriber_name: '',
    account_number: '',
    email: '',
    address: '',
    billing_period: '',
    due_date: '',
    payment_method: '',
    notes: 'All accounts are to be paid within 7 days from receipt of invoice. To be paid by GCash, Maya, bank transfer, or cash at any Asian Vision branch.',
  });
  const [items, setItems] = useState<LineItem[]>([{ desc: 'Fiber 100 Mbps - Monthly Subscription', detail: '', rate: 1799, qty: 1 }]);

  const f = (k: keyof typeof form, v: string) => setForm((prev) => ({ ...prev, [k]: v }));
  const updateItem = (i: number, k: keyof LineItem, v: string | number) => setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, item) => s + item.rate * item.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax - DISCOUNT + SHIPPING;

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '13px', border: '1px solid #E9EBEC', outline: 'none', color: '#212529', background: '#fff' };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    router.push('/invoices');
  };

  return (
    <div className="flex-1 p-6 overflow-auto" style={{ background: '#F3F6F9' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-[13px]" style={{ color: '#878A99' }}>
          <Link href="/invoices" className="hover:underline" style={{ color: '#405189' }}>Invoices</Link>
          <span>/</span><span style={{ color: '#212529' }}>Create Invoice</span>
        </div>
      </div>

      <div className="bg-white rounded-xl mx-auto" style={{ maxWidth: '900px', border: '1px solid #E9EBEC', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
        <div className="p-8 space-y-8">

          {/* Header */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#00CFFF' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <span className="text-[20px] font-bold" style={{ color: '#0D1117' }}>Vision<span style={{ color: '#00CFFF' }}>Go</span></span>
              </div>
              <p className="text-[13px]" style={{ color: '#878A99' }}>Asian Vision Cable and Internet Corporation<br/>Sto. Tomas, Batangas, Philippines</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#878A99' }}>Invoice No</label>
                <input value={`#AV-INV-2025-0${_nextInvoice++}`} readOnly style={{ ...inputStyle, background: '#F3F6F9', color: '#878A99' }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#878A99' }}>Due Date</label>
                <input type="date" value={form.due_date} onChange={(e) => f('due_date', e.target.value)} style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#878A99' }}>Payment Method</label>
                <select value={form.payment_method} onChange={(e) => f('payment_method', e.target.value)} style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')}>
                  <option value="">Select method</option>
                  <option>GCash</option><option>Maya</option><option>Bank Transfer</option><option>Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#878A99' }}>Status</label>
                <select style={{ ...inputStyle, background: '#FEF6E4', color: '#F7B84B', fontWeight: 600 }}>
                  <option>Unpaid</option><option>Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Billing address */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-wide mb-3" style={{ color: '#212529' }}>Billing Address</p>
              <div className="space-y-3">
                <input placeholder="Subscriber Name" value={form.subscriber_name} onChange={(e) => f('subscriber_name', e.target.value)} style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
                <input placeholder="Account Number (AV-BTG-XXXXX)" value={form.account_number} onChange={(e) => f('account_number', e.target.value)} style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
                <textarea placeholder="Service Address" value={form.address} onChange={(e) => f('address', e.target.value)} rows={2} style={{ ...inputStyle, resize: 'none' }}
                  onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
                <input placeholder="Email Address" type="email" value={form.email} onChange={(e) => f('email', e.target.value)} style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
              </div>
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-wide mb-3" style={{ color: '#212529' }}>Billing Details</p>
              <div className="space-y-3">
                <input placeholder="Billing Period (e.g. June 1-30, 2025)" value={form.billing_period} onChange={(e) => f('billing_period', e.target.value)} style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
              </div>
            </div>
          </div>

          {/* Line items */}
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wide mb-3" style={{ color: '#212529' }}>Line Items</p>
            <table className="w-full mb-3" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E9EBEC' }}>
                  {['#','Product / Service','Rate (PHP)','Qty','Amount',''].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: '#878A99' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F3F6F9' }}>
                    <td className="px-3 py-3 text-[13px]" style={{ color: '#878A99', width: '32px' }}>{String(i+1).padStart(2,'0')}</td>
                    <td className="px-3 py-3">
                      <input value={item.desc} onChange={(e) => updateItem(i, 'desc', e.target.value)} placeholder="Product name" style={{ ...inputStyle, marginBottom: '4px' }}
                        onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
                      <input value={item.detail} onChange={(e) => updateItem(i, 'detail', e.target.value)} placeholder="Details (optional)" style={{ ...inputStyle, fontSize: '11px', padding: '6px 12px' }}
                        onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
                    </td>
                    <td className="px-3 py-3" style={{ width: '120px' }}>
                      <input type="number" value={item.rate} onChange={(e) => updateItem(i, 'rate', +e.target.value)} style={{ ...inputStyle, width: '110px' }}
                        onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
                    </td>
                    <td className="px-3 py-3" style={{ width: '80px' }}>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateItem(i, 'qty', Math.max(1, item.qty - 1))} className="w-7 h-7 rounded flex items-center justify-center text-lg" style={{ border: '1px solid #E9EBEC', color: '#495057' }}>-</button>
                        <span className="text-[13px] w-6 text-center font-semibold" style={{ color: '#212529' }}>{item.qty}</span>
                        <button onClick={() => updateItem(i, 'qty', item.qty + 1)} className="w-7 h-7 rounded flex items-center justify-center text-lg" style={{ border: '1px solid #E9EBEC', color: '#495057' }}>+</button>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[14px] font-bold text-right" style={{ color: '#212529', width: '120px' }}>PHP {(item.rate * item.qty).toLocaleString()}</td>
                    <td className="px-3 py-3" style={{ width: '60px' }}>
                      <button onClick={() => removeItem(i)} disabled={items.length === 1} className="h-7 px-2.5 text-[11px] font-semibold rounded-lg disabled:opacity-30" style={{ background: '#FEE9E5', color: '#F06548' }}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addItem} className="h-8 px-4 text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-opacity hover:opacity-80" style={{ background: '#EEF0F8', color: '#405189' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Item
            </button>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div style={{ width: '280px' }}>
              {[['Sub Total', `PHP ${subtotal.toLocaleString()}`],['Tax (0%)',`PHP 0`],['Discount',`PHP 0`],['Shipping',`PHP 0`]].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid #F3F6F9' }}>
                  <span className="text-[13px]" style={{ color: '#878A99' }}>{label}</span>
                  <span className="text-[13px]" style={{ color: '#495057' }}>{val}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 mt-1" style={{ borderTop: '2px solid #E9EBEC' }}>
                <span className="text-[15px] font-bold" style={{ color: '#212529' }}>Total Amount</span>
                <span className="text-[18px] font-black" style={{ color: '#405189' }}>PHP {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[13px] font-bold uppercase tracking-wide mb-2" style={{ color: '#212529' }}>Notes</label>
            <textarea value={form.notes} onChange={(e) => f('notes', e.target.value)} rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
              onFocus={(e) => (e.target.style.borderColor = '#405189')} onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #F3F6F9' }}>
            <Link href="/invoices" className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center transition-colors hover:bg-slate-100" style={{ color: '#878A99', border: '1px solid #E9EBEC' }}>
              Cancel
            </Link>
            <div className="flex items-center gap-2">
              <button className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-opacity hover:opacity-90" style={{ background: '#F3F6F9', color: '#495057', border: '1px solid #E9EBEC' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download
              </button>
              <button className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-opacity hover:opacity-90" style={{ background: '#0AB39C', color: '#fff' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Send Invoice
              </button>
              <button onClick={handleSave} disabled={saving} className="h-9 px-4 text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: '#405189', color: '#fff' }}>
                {saving && <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
                {saving ? 'Saving...' : 'Save Invoice'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

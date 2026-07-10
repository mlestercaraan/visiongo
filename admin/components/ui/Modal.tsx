'use client';

import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: '420px', md: '560px', lg: '720px' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-xl w-full flex flex-col max-h-[90vh]"
        style={{ maxWidth: widths[size], boxShadow: '0 20px 60px rgba(0,0,0,0.18)', border: '1px solid #E9EBEC' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5" style={{ borderBottom: '1px solid #F3F6F9' }}>
          <div>
            <h5 className="text-[17px] font-semibold" style={{ color: '#212529' }}>{title}</h5>
            {subtitle && <p className="text-[13px] mt-0.5" style={{ color: '#878A99' }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            style={{ color: '#878A99', marginTop: '-2px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 px-6 py-4" style={{ borderTop: '1px solid #F3F6F9' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Form field helpers ---- */
interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#495057' }}>
        {label} {required && <span style={{ color: '#F06548' }}>*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] mt-1" style={{ color: '#ADB5BD' }}>{hint}</p>}
    </div>
  );
}

const inputBase = {
  width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '14px',
  border: '1px solid #E9EBEC', outline: 'none', color: '#212529',
  background: '#fff', transition: 'border-color .15s',
};

export function Input({ value, onChange, placeholder, type = 'text', ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={inputBase as React.CSSProperties}
      onFocus={(e) => (e.target.style.borderColor = '#405189')}
      onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')}
      {...rest}
    />
  );
}

export function Textarea({ value, onChange, placeholder, rows = 3 }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputBase, resize: 'vertical', lineHeight: '1.5' } as React.CSSProperties}
      onFocus={(e) => (e.target.style.borderColor = '#405189')}
      onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')}
    />
  );
}

export function Select({ value, onChange, children }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{ ...inputBase, cursor: 'pointer' } as React.CSSProperties}
      onFocus={(e) => (e.target.style.borderColor = '#405189')}
      onBlur={(e) => (e.target.style.borderColor = '#E9EBEC')}
    >
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-6 w-11 rounded-full transition-colors focus:outline-none flex-shrink-0"
        style={{ background: checked ? '#0AB39C' : '#CED4DA' }}
      >
        <span
          className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(21px)' : 'translateX(2px)', marginTop: '2px' }}
        />
      </button>
      {label && <span className="text-[13px]" style={{ color: '#495057' }}>{label}</span>}
    </div>
  );
}

export function Btn({
  children, onClick, variant = 'primary', type = 'button',
}: {
  children: React.ReactNode; onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary:   { background: '#405189', color: '#fff', border: '1px solid #405189' },
    secondary: { background: '#fff', color: '#495057', border: '1px solid #E9EBEC' },
    danger:    { background: '#F06548', color: '#fff', border: '1px solid #F06548' },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ ...styles[variant], padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity .15s' }}
      onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.88')}
      onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
    >
      {children}
    </button>
  );
}

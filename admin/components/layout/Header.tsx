'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
  tag?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, tag, actions }: HeaderProps) {
  return (
    <div className="bg-white border-b px-7 py-4 flex-shrink-0" style={{ borderColor: '#E9EBEC' }}>
      <div className="flex items-center justify-between">
        <div>
          {tag && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] text-slate-400">Home</span>
              <span className="text-slate-300">/</span>
              <span className="text-[11px] font-medium" style={{ color: '#405189' }}>{tag}</span>
            </div>
          )}
          <h4 className="text-[20px] font-semibold" style={{ color: '#212529' }}>{title}</h4>
          {subtitle && <p className="text-[13px] mt-0.5" style={{ color: '#878A99' }}>{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2.5">
          {actions}
        </div>
      </div>
    </div>
  );
}

'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
  tag?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, tag, actions }: HeaderProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white border-b border-[rgba(2,27,58,0.08)] px-7 py-5 flex items-center justify-between">
      <div>
        {tag && (
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#00CFFF] mb-1">{tag}</p>
        )}
        <h1 className="text-xl font-black text-[#021B3A] leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[#4A6580] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <div className="text-right">
          <p className="text-xs font-semibold text-[#4A6580]">{dateStr}</p>
          <p className="text-[10px] text-[#8EA8BE] mt-0.5">Last synced: just now</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#021B3A] flex items-center justify-center">
          <span className="text-[#00CFFF] text-xs font-bold">AV</span>
        </div>
      </div>
    </div>
  );
}

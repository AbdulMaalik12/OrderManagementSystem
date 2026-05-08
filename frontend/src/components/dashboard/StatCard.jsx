/**
 * Futuristic 3D stat card.
 */
export default function StatCard({ title, value, icon: Icon, color = 'primary', subtitle }) {
  const colorMap = {
    primary: { cls: 'stat-primary', icon: 'text-primary-400', glow: 'rgba(99,102,241,0.3)', iconBg: 'rgba(99,102,241,0.15)' },
    cyan:    { cls: 'stat-cyan',    icon: 'text-cyan-400',    glow: 'rgba(6,182,212,0.3)',   iconBg: 'rgba(6,182,212,0.15)' },
    success: { cls: 'stat-success', icon: 'text-success-400', glow: 'rgba(16,185,129,0.3)',  iconBg: 'rgba(16,185,129,0.15)' },
    warning: { cls: 'stat-warning', icon: 'text-warning-400', glow: 'rgba(245,158,11,0.3)',  iconBg: 'rgba(245,158,11,0.15)' },
    violet:  { cls: 'stat-violet',  icon: 'text-violet-400',  glow: 'rgba(139,92,246,0.3)',  iconBg: 'rgba(139,92,246,0.15)' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className={`${c.cls} card-3d rounded-2xl p-5 relative overflow-hidden`}>
      {/* Corner shine */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
        style={{ background: `radial-gradient(circle, ${c.glow.replace('0.3', '0.8')}, transparent)` }} />

      <div className="flex items-start justify-between relative">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-dark-300 uppercase tracking-[2px] mb-2">{title}</p>
          <p className="text-2xl font-black text-white truncate" style={{ fontFamily: "'Exo 2', sans-serif" }}>{value}</p>
          {subtitle && <p className="text-[10px] text-dark-400 mt-1.5">{subtitle}</p>}
        </div>

        {Icon && (
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ml-3"
            style={{ background: c.iconBg, boxShadow: `0 0 20px ${c.glow}` }}>
            <Icon className={`w-5 h-5 ${c.icon}`} />
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-40"
        style={{ background: `linear-gradient(90deg, transparent, ${c.glow.replace('0.3','0.8')}, transparent)` }} />
    </div>
  );
}

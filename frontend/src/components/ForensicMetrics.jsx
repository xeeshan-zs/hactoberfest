import React from 'react';
import { Activity, Waves, Radio, Timer } from 'lucide-react';

export default function ForensicMetrics({ result }) {
  if (!result) return null;
  const d = result.diagnostics || {};
  const number = value => typeof value === 'number' && Number.isFinite(value);
  const metrics = [
    { label: 'Spectral slope', value: number(d.spectral_slope_alpha) ? d.spectral_slope_alpha.toFixed(3) : '—', detail: 'Frequency decay · α', icon: Activity },
    { label: 'High-frequency energy', value: number(d.high_freq_ratio) ? `${Math.round(d.high_freq_ratio * 100)}%` : '—', detail: 'Outer spectrum energy', icon: Waves },
    { label: 'Spectral entropy', value: number(d.spectral_entropy) ? `${Math.round(d.spectral_entropy * 100)}%` : '—', detail: 'Frequency distribution', icon: Radio },
    { label: 'Analysis time', value: number(result.processing_time_ms) ? `${(result.processing_time_ms / 1000).toFixed(2)}s` : '—', detail: 'Reported processing time', icon: Timer },
  ];
  return <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" aria-label="Image diagnostics">
    {metrics.map(({ label, value, detail, icon: Icon }) => <div key={label} className="results-metric">
      <div className="flex justify-between gap-2 items-start"><span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</span><Icon className="w-4 h-4 text-slate-400 shrink-0" /></div>
      <p className="text-2xl sm:text-3xl font-bold tracking-tight mt-4 tabular-nums">{value}</p>
      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2">{detail}</p>
    </div>)}
  </section>;
}

import React from 'react';
import { ShieldCheck, ScanLine, Layers, Info } from 'lucide-react';

export default function VerdictBadge({ result }) {
  if (!result) return null;
  const isFake = ['fake', 'ai'].includes(result.prediction?.toLowerCase());
  const validScore = typeof result.confidence === 'number' && Number.isFinite(result.confidence);
  const score = validScore ? Math.round(Math.max(0, Math.min(1, result.confidence)) * 100) : null;
  const ensemble = result.ensemble || {};
  const both = ensemble.active_engine === 'ENSEMBLE';
  const Icon = isFake ? ScanLine : ShieldCheck;
  return <section className={`results-panel verdict-panel ${isFake ? 'verdict-synthetic' : 'verdict-real'}`} aria-labelledby="verdict-title">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex-1 min-w-0">
        <p className="results-kicker flex items-center gap-2 mb-4"><Layers className="w-3.5 h-3.5" />{both ? 'Combined model assessment' : ensemble.active_engine_label || 'Model assessment'}</p>
        <div className="flex items-center gap-3"><span className="verdict-icon"><Icon className="w-6 h-6" /></span><h2 id="verdict-title" className="text-2xl sm:text-4xl font-black tracking-tight">{isFake ? 'Likely AI-generated' : 'Likely real'}</h2></div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed max-w-xl">{isFake ? 'The available analysis leans toward synthetic imagery. Review the individual signals and visual explanation below.' : 'The available analysis leans toward a real image. Review the individual signals and visual explanation below.'}</p>
      </div>
      <div className="verdict-score md:w-56 shrink-0">
        <p className="results-kicker">{both ? 'Weighted model score' : 'Model score'}</p>
        <div className="flex items-baseline gap-2 mt-2"><span className="text-5xl font-black tracking-tighter tabular-nums">{score ?? '—'}</span>{score !== null && <span className="text-lg font-bold text-slate-500">%</span>}</div>
        <div className="result-score-track mt-4" role="progressbar" aria-label="Score for the predicted class" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score ?? undefined}><span style={{ width: `${score ?? 0}%` }} /></div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">For this prediction · not measured accuracy</p>
      </div>
    </div>
    <p className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2 leading-relaxed"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />Visual analysis and detector scores are clues, not proof of authenticity.</p>
    {ensemble.fallback_notice && <p className="result-inline-notice mt-4">{ensemble.fallback_notice}</p>}
  </section>;
}

import React from 'react';
import { Cpu, Sparkles, Info } from 'lucide-react';

export default function ApiComparison({ result }) {
  if (!result) return null;
  const local = result.local_model;
  const vision = result.nvidia_vision;
  const localAvailable = Boolean(local?.available && local?.prediction);
  const visionAvailable = Boolean(vision?.available && vision?.prediction);
  const ensemble = result.ensemble || {};
  const both = ensemble.active_engine === 'ENSEMBLE';
  const agreement = both && localAvailable && visionAvailable && local.prediction === vision.prediction;
  const weight = (value, fallback) => Math.round((typeof value === 'number' ? value : fallback) * 100);
  const models = [
    { name: 'Gemma vision', description: 'DiffusionGemma 26B · NVIDIA NIM', icon: Sparkles, active: visionAvailable, data: vision, weight: weight(ensemble.nim_weight, both ? .8 : visionAvailable ? 1 : 0), primary: true },
    { name: 'Local frequency model', description: 'Trained classifier · 40 FFT features', icon: Cpu, active: localAvailable, data: local, weight: weight(ensemble.fourier_weight, both ? .2 : localAvailable ? 1 : 0) },
  ];
  return <section className="results-panel" aria-labelledby="comparison-title">
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
      <div><p className="results-kicker mb-2">Behind the prediction</p><h2 id="comparison-title" className="text-xl font-bold tracking-tight">Two models. Individual perspectives.</h2></div>
      <span className="result-pill">{both ? agreement ? 'Models agree' : 'Models disagree' : 'Single model available'}</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {models.map(model => <article key={model.name} className={`model-card ${model.primary && model.active ? 'model-card-primary' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0"><span className="model-icon"><model.icon className="w-5 h-5" /></span><div><h3 className="text-sm font-bold">{model.name}</h3><p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{model.description}</p></div></div>
          <span className="result-pill shrink-0">{model.active ? `${model.weight}% weight` : 'Unavailable'}</span>
        </div>
        {model.active ? <>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mt-6"><span className={`text-xl font-bold ${model.data.prediction === 'fake' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>{model.data.prediction === 'fake' ? 'AI-generated signal' : 'Real-image signal'}</span><span className="text-sm font-semibold tabular-nums">{typeof model.data.confidence === 'number' ? `${Math.round(model.data.confidence * 100)}% score` : 'Score unavailable'}</span></div>
          <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
            {model.primary ? <><p className="results-kicker mb-2">Visual explanation</p>{model.data.explanation || 'No visual explanation was returned.'}</> : 'Evaluates frequency decay, texture patterns, and relationships between color channels.'}
          </div>
        </> : <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{model.primary ? 'The vision service did not return an analysis for this image.' : 'The local classifier did not return an analysis for this image.'}</p>}
      </article>)}
    </div>
    <div className="result-blend mt-5"><span className="font-semibold">{both ? 'How the score is combined' : 'Current analysis mode'}</span><span className="text-xs">{both ? `${models[0].weight}% Gemma + ${models[1].weight}% local classifier` : ensemble.active_engine_label || 'Available model only'}</span></div>
    {both && !agreement && <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2 mt-4 leading-relaxed"><Info className="w-4 h-4 shrink-0" />The models reached different conclusions. Review their reasoning and the image’s source before making a decision.</p>}
  </section>;
}

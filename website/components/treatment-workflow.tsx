'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, ClipboardList, HeartHandshake, Pause, Play, RotateCcw, Search, Stethoscope, TrendingUp } from 'lucide-react';
import { steps } from '@/lib/content';
import { useReducedMotion } from './depth-surface';

const visuals = [
  { icon: Stethoscope, short: 'Consultation', labels: ['Health history', 'Your concerns', 'Pulse assessment'] },
  { icon: Search, short: 'Diagnosis', labels: ['Your constitution', 'Dosha balance', 'Root causes'] },
  { icon: ClipboardList, short: 'Care plan', labels: ['Therapies & herbs', 'Diet', 'Lifestyle'] },
  { icon: HeartHandshake, short: 'Therapy', labels: ['In-clinic care', 'Trained therapists', 'Doctor supervision'] },
  { icon: TrendingUp, short: 'Follow-up', labels: ['Monitor progress', 'Review your plan', 'Adjust care'] },
];

export default function TreatmentWorkflow() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const running = playing && visible && !reduced;
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .35 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      if (active === steps.length - 1) setPlaying(false);
      else setActive(value => value + 1);
    }, 6500);
    return () => clearTimeout(timer);
  }, [active, running]);
  const select = (index: number) => { setPlaying(false); setActive(index); };
  const Icon = visuals[active].icon;

  return <div ref={root} className="treatment-workflow">
    <div className="workflow-intro"><span><span className="workflow-dot" />Your care, one step at a time</span><span>Select any step to explore</span></div>
    <ol className="workflow-track" style={{ '--journey-progress': `${active * 25}%` } as CSSProperties} aria-label="Treatment steps">
      {steps.map(([title], index) => {
        const StepIcon = visuals[index].icon;
        return <li key={title} className={index === active ? 'is-current' : index < active ? 'is-past' : ''}>
          <button type="button" onClick={() => select(index)} aria-current={index === active ? 'step' : undefined} aria-controls="treatment-detail" aria-label={`Step ${index + 1}: ${title}`}>
            <span className="workflow-node"><StepIcon size={26} strokeWidth={1.6} /><span className="workflow-number">{index < active ? <Check size={12} /> : index + 1}</span></span>
            <span className="workflow-step-title">{visuals[index].short}</span>
          </button>
        </li>;
      })}
    </ol>
    <div className="workflow-detail" id="treatment-detail" aria-live={running ? 'off' : 'polite'} aria-atomic="true">
      <div key={active} className="workflow-detail-inner">
        <div className="workflow-visual" aria-hidden="true">
          <span className="workflow-orbit" /><span className="workflow-main-icon"><Icon size={64} strokeWidth={1.25} /></span>
          <span className="workflow-visual-caption">{visuals[active].short}</span>
          <div className="workflow-mini-steps">{visuals[active].labels.map((label, index) => <span key={label} style={{ '--item': index } as CSSProperties}><Check size={14} />{label}</span>)}</div>
        </div>
        <div className="workflow-copy"><span className="eyebrow">STEP 0{active + 1} OF 05</span><h3>{steps[active][0]}</h3><p>{steps[active][1]}</p><div className="workflow-next-preview">{active < 4 ? <>Up next <ArrowRight size={15} /><strong>{visuals[active + 1].short}</strong></> : <><Check size={17} /><strong>Continuing care, centered on you</strong></>}</div></div>
      </div>
    </div>
    <div className="workflow-footer">
      <div className="workflow-playback">{!reduced && <button type="button" onClick={() => { if (active === 4 && !playing) setActive(0); setPlaying(value => !value); }} aria-label={playing ? 'Pause journey animation' : active === 4 ? 'Replay journey animation' : 'Play journey animation'}>{playing ? <Pause size={16} /> : active === 4 ? <RotateCcw size={16} /> : <Play size={16} />}<span>{playing ? 'Pause' : active === 4 ? 'Replay' : 'Play journey'}</span></button>}<span className="workflow-count">0{active + 1}<span> / 05</span></span></div>
      <div className="workflow-navigation"><button type="button" onClick={() => select(active - 1)} disabled={active === 0} aria-label="Previous treatment step"><ChevronLeft size={18} /></button><button type="button" onClick={() => select(active + 1)} disabled={active === 4} aria-label="Next treatment step"><span>Next step</span><ChevronRight size={18} /></button></div>
    </div>
    <div key={`${active}-${running}`} className={`workflow-timer ${running ? 'is-running' : ''}`} aria-hidden="true" />
  </div>;
}

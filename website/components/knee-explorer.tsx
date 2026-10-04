'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Plus, RotateCcw, Scan } from 'lucide-react';
import DepthSurface, { useReducedMotion } from './depth-surface';

const areas = [
  { id: 'joint', label: 'Knee joint', concern: 'Ayurvedic Management of Knee Joint Health', x: '74%', y: '31%' },
  { id: 'ligaments', label: 'Ligaments', concern: 'Ligament Discomfort', x: '52%', y: '42%' },
  { id: 'meniscus', label: 'Meniscus', concern: 'Meniscus Discomfort', x: '65%', y: '48%' },
];

export default function KneeExplorer() {
  const [selected, setSelected] = useState('joint');
  const [rotation, setRotation] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const panelId = useId();
  const active = areas.find(area => area.id === selected)!;
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={root} className={`knee-explorer knee-studio ${playing && visible && !reduced ? 'is-animated' : ''}`} aria-label="Interactive knee illustration">
    <div className="knee-explorer-heading"><span className="eyebrow">AN INTERACTIVE LOOK INSIDE</span><span className="knee-model-tag">Knee care</span></div>
    <div className="knee-studio-title"><h3>A closer look at your knee.</h3><p>Select a point. Get to know your joint.</p></div>
    <div className="knee-stage">
    <div className="knee-light-ring" aria-hidden="true" />
    <div className="knee-floor" aria-hidden="true" />
    <DepthSurface className="knee-depth" restRotation={rotation} tilt={3}>
      <div className="knee-float">
      <div className="knee-model">
        <img src="/assets/knee-anatomy.webp" width={1024} height={1536} alt="Three-dimensional illustration of the knee joint showing bones, cartilage, and ligaments" loading="lazy" draggable={false} />
        {areas.map(area => <button key={area.id} className={`knee-hotspot ${selected === area.id ? 'is-selected' : ''}`} style={{ left: area.x, top: area.y }} onClick={() => setSelected(area.id)} aria-label={area.label} aria-pressed={selected === area.id} aria-controls={panelId}>
          <Plus size={22} strokeWidth={1.7} /><span className="hotspot-label">{area.label}</span>
        </button>)}
      </div>
      </div>
    </DepthSurface>
    <span className="knee-stage-caption"><Scan size={13} />Explore your knee</span>
    </div>
    <div className="knee-selection" id={panelId} aria-live="polite" aria-atomic="true"><span className="knee-selection-index">0{areas.findIndex(area => area.id === selected) + 1}</span><div key={selected}><strong>{active.label}</strong><span>{active.concern}</span></div></div>
    <div className="knee-toolbar">
      <p>{reduced ? 'Select a point to explore' : 'Move your pointer to explore'}</p>
      <div className="knee-controls" aria-label="Illustration view controls">
        {!reduced && <button type="button" aria-label={playing ? 'Pause knee animation' : 'Play knee animation'} onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={15} /> : <Play size={15} />}</button>}
        <button type="button" aria-label="Tilt illustration left" disabled={reduced || rotation <= -16} onClick={() => setRotation(angle => Math.max(-16, angle - 8))}><ChevronLeft size={18} /></button>
        <button type="button" aria-label="Reset illustration view" disabled={reduced || rotation === 0} onClick={() => setRotation(0)}><RotateCcw size={16} /></button>
        <button type="button" aria-label="Tilt illustration right" disabled={reduced || rotation >= 16} onClick={() => setRotation(angle => Math.min(16, angle + 8))}><ChevronRight size={18} /></button>
      </div>
    </div>
  </div>;
}

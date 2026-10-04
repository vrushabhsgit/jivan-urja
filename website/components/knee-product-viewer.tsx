'use client';

import { createElement, useEffect, useRef, useState } from 'react';
import type { ModelViewerElement } from '@google/model-viewer';
import { Move, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import KneeExplorer from './knee-explorer';
import { useReducedMotion } from './depth-surface';

const views = [{ label: 'Front', angle: '0deg' }, { label: 'Side', angle: '90deg' }, { label: 'Back', angle: '180deg' }];

export default function KneeProductViewer() {
  const [mode, setMode] = useState<'3d' | 'illustration'>('3d');
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState('');
  const viewer = useRef<ModelViewerElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    import('@google/model-viewer').catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const element = viewer.current;
    if (!element) return;
    const loaded = () => {
      setReady(true); setFailed(false);
      // Presentation colors only; the source anatomical geometry is unchanged.
      for (const material of element.model?.materials ?? []) {
        const pbr = material.pbrMetallicRoughness;
        pbr.setBaseColorFactor(material.name.includes('Bone') ? '#ead9b8' : material.name.includes('meniscus') ? '#82b5a1' : '#b1cabd');
        pbr.setRoughnessFactor(.65);
        pbr.setMetallicFactor(0);
      }
    };
    const error = () => { setFailed(true); setPlaying(false); };
    const changed = (event: Event) => { if ((event as CustomEvent).detail.source === 'user-interaction') setView(''); };
    const interacting = () => setPlaying(false);
    element.addEventListener('load', loaded);
    element.addEventListener('error', error);
    element.addEventListener('camera-change', changed);
    element.addEventListener('pointerdown', interacting);
    element.addEventListener('wheel', interacting, { passive: true });
    element.addEventListener('keydown', interacting);
    if (element.loaded) loaded();
    return () => { element.removeEventListener('load', loaded); element.removeEventListener('error', error); element.removeEventListener('camera-change', changed); element.removeEventListener('pointerdown', interacting); element.removeEventListener('wheel', interacting); element.removeEventListener('keydown', interacting); };
  }, [mode]);
  useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);

  const angle = (label: string, theta: string) => {
    if (!viewer.current) return;
    setView(label); setPlaying(false);
    viewer.current.resetTurntableRotation();
    viewer.current.cameraOrbit = `${theta} 80deg 0.65m`;
    if (reduced) viewer.current.jumpCameraToGoal();
  };
  const zoom = (direction: number) => {
    if (!viewer.current) return;
    const orbit = viewer.current.getCameraOrbit();
    viewer.current.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${Math.max(.35, Math.min(1.8, orbit.radius + direction * .12))}m`;
    if (reduced) viewer.current.jumpCameraToGoal();
  };

  return <div className="knee-product">
    <div className="knee-view-modes" aria-label="Knee viewing mode">
      <button type="button" aria-pressed={mode === '3d'} onClick={() => { if (mode !== '3d') { setMode('3d'); setReady(false); setFailed(false); } }}>360° view</button>
      <button type="button" aria-pressed={mode === 'illustration'} onClick={() => { setMode('illustration'); setPlaying(false); }}>Guided illustration</button>
    </div>
    {mode === 'illustration' ? <KneeExplorer /> : <div className="knee-real-view">
      <div className="knee-real-heading"><span className="eyebrow">EXPLORE FROM EVERY ANGLE</span><h3>Get to know your knee.</h3><p>Drag to rotate. Pinch to take a closer look.</p></div>
      <div className="knee-webgl-stage">
        {!failed && createElement('model-viewer', {
          ref: viewer, src: '/assets/knee-reference.glb', alt: 'Interactive three-dimensional right knee anatomy. Drag to rotate or use the view and zoom buttons below.',
          'camera-controls': '', 'touch-action': 'pan-y', 'disable-pan': '',
          'camera-orbit': '25deg 80deg 0.65m', 'camera-target': '-0.14m -0.42m 0m',
          'min-camera-orbit': 'auto 35deg 0.35m', 'max-camera-orbit': 'auto 145deg 1.8m',
          'field-of-view': '35deg', 'shadow-intensity': '0', exposure: '1.1',
          'interaction-prompt': 'none', 'interpolation-decay': reduced ? '0' : '100',
          'auto-rotate': playing && !reduced ? '' : undefined, 'rotation-per-second': '12deg',
          'auto-rotate-delay': '0', loading: 'eager',
        })}
        {!ready && !failed && <div className="knee-load" role="status"><span />Loading your 3D view…</div>}
        {failed && <div className="knee-load" role="status"><p>The 3D view is unavailable on this device.</p><button className="button" onClick={() => setMode('illustration')}>Explore the illustration</button></div>}
        <span className="knee-drag-hint"><Move size={14} />Drag to explore 360°</span>
      </div>
      <div className="knee-view-presets" aria-label="Anatomy camera views">{views.map(item => <button type="button" key={item.label} disabled={!ready || failed} aria-pressed={view === item.label} onClick={() => angle(item.label, item.angle)}>{item.label}</button>)}</div>
      <div className="knee-view-tools">
        <button type="button" disabled={!ready || failed || reduced} aria-label={playing ? 'Pause 3D rotation' : 'Start 3D rotation'} onClick={() => { setView(''); setPlaying(value => !value); }}>{playing ? <Pause size={16} /> : <Play size={16} />}<span>{playing ? 'Pause rotation' : 'Auto rotate'}</span></button>
        <div><button type="button" disabled={!ready || failed} aria-label="Zoom out knee" onClick={() => zoom(1)}><ZoomOut size={18} /></button><button type="button" disabled={!ready || failed} aria-label="Zoom in knee" onClick={() => zoom(-1)}><ZoomIn size={18} /></button><button type="button" disabled={!ready || failed} aria-label="Reset 3D knee view" onClick={() => angle('', '25deg')}><RotateCcw size={17} /></button></div>
      </div>
      <div className="knee-model-key"><span><i />Bone</span><span><i />Cartilage</span><span><i />Meniscus</span></div>
      <p className="knee-attribution">Anatomy: <a href="https://doi.org/10.48539/HBM262.NWXL.436" target="_blank" rel="noreferrer">Human Reference Atlas</a> · K. Browne & H. Schlehlein · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Colors adapted.</p>
    </div>}
  </div>;
}

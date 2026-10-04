'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** A lightweight perspective surface, with no motion on touch or reduced-motion devices. */
export default function DepthSurface({ children, className = '', restRotation = 0, tilt = 5 }: {
  children: ReactNode; className?: string; restRotation?: number; tilt?: number;
}) {
  const plane = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const reduced = useReducedMotion();

  const reset = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    plane.current?.style.setProperty('--tilt-x', '0deg');
    plane.current?.style.setProperty('--tilt-y', '0deg');
  };
  useEffect(() => {
    if (reduced) reset();
    return () => { if (frame.current !== null) cancelAnimationFrame(frame.current); };
  }, [reduced]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * tilt * 2;
    const y = -((event.clientY - bounds.top) / bounds.height - .5) * tilt * 2;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      plane.current?.style.setProperty('--tilt-x', `${y.toFixed(2)}deg`);
      plane.current?.style.setProperty('--tilt-y', `${x.toFixed(2)}deg`);
      frame.current = null;
    });
  };

  return <div className={`depth-surface ${className}`} onPointerMove={move} onPointerLeave={reset}>
    <div ref={plane} className="depth-plane" style={{ '--rest-y': `${reduced ? 0 : restRotation}deg` } as CSSProperties}>{children}</div>
  </div>;
}

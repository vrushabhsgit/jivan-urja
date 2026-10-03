'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Progressive enhancement: content remains visible without JavaScript. */
export default function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!('IntersectionObserver' in window) || preference.matches) return;
    const animations = new Set<Animation>();
    const selector = '.section-title,.intro-photo,.intro-copy,.care-card,.difference-grid>article,.process-grid>article,.stories-grid>article,.team-grid>*,.faq-layout>*,.booking-grid>*,.comfort-grid>*,.mission>*,.doctor-card,.contact-grid>*,.consultation-intro,.consultation-page-form,.journey-cta .container';
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        if (preference.matches || entry.boundingClientRect.bottom < 0) continue;
        const siblings = element.parentElement;
        const delay = siblings?.matches('.difference-grid,.process-grid,.stories-grid,.doctor-grid')
          ? Math.min(Array.from(siblings.children).indexOf(element) * 75, 300) : 0;
        const animation = element.animate(
          [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 700, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' },
        );
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation)).catch(() => {});
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll(selector).forEach((element) => observer.observe(element));
    const stop = () => {
      if (preference.matches) {
        observer.disconnect();
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };
    preference.addEventListener('change', stop);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', stop);
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);
  return null;
}

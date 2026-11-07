import { useEffect, useRef } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Scroll reveal: one shared IntersectionObserver for the whole app ---------- */
let observer = null;
function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  return observer;
}

/** Adds `is-visible` to the element the first time it scrolls into view. */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = getObserver();
    if (!io || prefersReducedMotion()) {
      el.classList.add('is-visible');
      return undefined;
    }
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}

/* ---------- Magnetic buttons ---------- */
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return undefined;
    let frame = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      el.style.transform = '';
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);
  return ref;
}

/* ---------- Global pointer + scroll variables (one listener each, rAF-throttled) ---------- */
let started = false;
export function startGlobalMotionVars() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const root = document.documentElement;
  let px = 0.5;
  let py = 0.5;
  let pending = false;
  const flush = () => {
    pending = false;
    root.style.setProperty('--mx', px.toFixed(4));
    root.style.setProperty('--my', py.toFixed(4));
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    root.style.setProperty('--scroll', (window.scrollY / max).toFixed(4));
    root.style.setProperty('--scroll-px', `${window.scrollY}px`);
  };
  const queue = () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(flush);
    }
  };
  window.addEventListener(
    'pointermove',
    (e) => {
      px = e.clientX / window.innerWidth;
      py = e.clientY / window.innerHeight;
      queue();
    },
    { passive: true }
  );
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  flush();
}

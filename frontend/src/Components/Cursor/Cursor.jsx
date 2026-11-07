import React, { useEffect, useRef, useState } from 'react';
import './Cursor.css';
import { hasFinePointer, prefersReducedMotion } from '../../lib/motion';

/* A soft trailing ring that grows over links and buttons.
   Desktop (fine pointer) only; the native cursor is kept for accessibility. */
const Cursor = () => {
  const ref = useRef(null);
  const [enabled] = useState(() => hasFinePointer() && !prefersReducedMotion());

  useEffect(() => {
    if (!enabled) return undefined;
    const el = ref.current;
    let x = -100, y = -100, cx = -100, cy = -100;
    let raf = 0;
    let running = false;

    const tick = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(x - cx) + Math.abs(y - cy) > 0.3) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      el.classList.add('is-visible');
      const interactive = e.target.closest && e.target.closest('a, button, [role="option"], input, label');
      el.classList.toggle('is-hover', !!interactive);
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const leave = () => el.classList.remove('is-visible');
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={ref} className="cursor-ring" aria-hidden="true"><span /></div>;
};

export default Cursor;

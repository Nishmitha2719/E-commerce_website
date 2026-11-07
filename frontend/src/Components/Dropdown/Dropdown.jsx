import React, { useEffect, useId, useRef, useState } from 'react';
import './Dropdown.css';
import { Chevron, Check } from '../Icons/Icons';

/** Small accessible dropdown (listbox) with a smooth open animation. */
const Dropdown = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();
  const current = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;
    setFocusIdx(Math.max(0, options.findIndex((o) => o.value === value)));
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, options, value]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const choose = (v) => {
    onChange(v);
    setOpen(false);
  };

  const onKey = (e) => {
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIdx((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(options[focusIdx].value);
    }
  };

  return (
    <div className={`dropdown${open ? ' is-open' : ''}`} ref={wrapRef}>
      <button
        type="button"
        className="dropdown__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => setOpen((o) => !o)}
      >
        <span id={`${id}-label`} className="dropdown__label">{label}</span>
        <span id={`${id}-value`} className="dropdown__value">{current.label}</span>
        <Chevron width={16} height={16} />
      </button>
      {open && (
        <ul
          className="dropdown__list"
          role="listbox"
          tabIndex={-1}
          ref={listRef}
          aria-activedescendant={`${id}-opt-${focusIdx}`}
          onKeyDown={onKey}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={o.value === value}
              className={`${i === focusIdx ? 'is-focus' : ''}${o.value === value ? ' is-selected' : ''}`}
              style={{ '--i': i }}
              onClick={() => choose(o.value)}
              onPointerEnter={() => setFocusIdx(i)}
            >
              {o.label}
              {o.value === value && <Check width={16} height={16} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

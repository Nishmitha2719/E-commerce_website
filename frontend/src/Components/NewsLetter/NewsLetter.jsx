import React, { useState } from 'react';
import './NewsLetter.css';
import { useMagnetic, useReveal } from '../../lib/motion';
import { ArrowRight, Check } from '../Icons/Icons';

const NewsLetter = () => {
  const ref = useReveal();
  const btn = useMagnetic(0.2);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | done

  const onSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      return;
    }
    // There's no newsletter endpoint in the backend yet — confirm locally.
    setStatus('done');
    setEmail('');
  };

  return (
    <section className="newsletter-wrap" aria-labelledby="newsletter-title">
      <div className="container">
        <div className="newsletter glass reveal" ref={ref}>
          <span className="eyebrow">Newsletter</span>
          <h2 id="newsletter-title" className="display">Get exclusive offers <em>in your inbox</em></h2>
          <p>Subscribe to our newsletter and stay updated.</p>
          <form className={`newsletter__form${status === 'error' ? ' has-error' : ''}`} onSubmit={onSubmit} noValidate>
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
              aria-invalid={status === 'error'}
              aria-describedby="newsletter-msg"
            />
            <button ref={btn} type="submit" className="btn">
              {status === 'done' ? <>Subscribed <Check /></> : <>Subscribe <ArrowRight /></>}
            </button>
          </form>
          <p id="newsletter-msg" className="newsletter__msg" role="status">
            {status === 'error' && 'Please enter a valid email address.'}
            {status === 'done' && 'Thanks — you’re on the list.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;

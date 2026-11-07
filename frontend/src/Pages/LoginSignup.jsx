import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/LoginSignup.css';
import { ShopContext } from '../Context/ShopContext';
import { API_BASE } from '../lib/api';
import { ArrowRight } from '../Components/Icons/Icons';

const LoginSignup = () => {
  const { login: saveToken } = useContext(ShopContext);
  const navigate = useNavigate();
  const [state, setState] = useState('Login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const submit = async (path, fallbackMsg) => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (responseData.success) {
        saveToken(responseData.token);
        navigate('/');
      } else {
        setError(responseData.errors || fallbackMsg);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (state === 'Login') submit('/login', 'Login failed');
    else submit('/signup', 'Sign up failed');
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-orb" aria-hidden="true" />
      <form className="loginsignup-container glass" onSubmit={onSubmit}>
        <span className="eyebrow">{state === 'Login' ? 'Welcome back' : 'Join SkyDy'}</span>
        <h1 className="display">{state === 'Login' ? <>Log <em>in</em></> : <>Sign <em>up</em></>}</h1>

        <div className="loginsignup-fields">
          {state === 'Sign Up' && (
            <label>
              <span className="sr-only">Your name</span>
              <input className="field" name="username" value={formData.username} onChange={changeHandler} type="text" placeholder="Your name" autoComplete="name" required />
            </label>
          )}
          <label>
            <span className="sr-only">Email address</span>
            <input className="field" name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Your email address" autoComplete="email" required />
          </label>
          <label>
            <span className="sr-only">Password</span>
            <input
              className="field"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              type="password"
              placeholder="Password"
              autoComplete={state === 'Login' ? 'current-password' : 'new-password'}
              required
            />
          </label>
        </div>

        {error && <p className="loginsignup-error" role="alert">{error}</p>}

        <button type="submit" className="btn loginsignup-submit" disabled={busy}>
          {busy ? 'Please wait…' : <>Continue <ArrowRight /></>}
        </button>

        {state === 'Sign Up' ? (
          <p className="loginsignup-login">
            Already have an account?{' '}
            <button type="button" onClick={() => setState('Login')}>Login here</button>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account{' '}
            <button type="button" onClick={() => setState('Sign Up')}>Click here</button>
          </p>
        )}

        <label className="loginsignup-agree">
          <input type="checkbox" />
          <span>By continuing, I agree to the terms and conditions</span>
        </label>
      </form>
    </div>
  );
};

export default LoginSignup;

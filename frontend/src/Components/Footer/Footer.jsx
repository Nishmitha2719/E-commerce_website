import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import footer_logo from '../Assets/logo_big.png';
import { Instagram, Pinterest, Whatsapp } from '../Icons/Icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__top">
          <Link to="/" className="footer-logo" aria-label="SkyDy home">
            <img src={footer_logo} alt="" width="56" height="56" loading="lazy" />
            <p>SkyDy</p>
          </Link>
          <ul className="footer-links">
            <li><Link to="/">Shop</Link></li>
            <li><Link to="/mens">Men</Link></li>
            <li><Link to="/womens">Women</Link></li>
            <li><Link to="/kids">Kids</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
          <ul className="footer-links footer-links--muted">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="footer__wordmark display" aria-hidden="true">SkyDy</div>
        <div className="footer-copyright">
          <p>Copyright © {new Date().getFullYear()} SkyDy — All rights reserved</p>
          <div className="footer-social-icon">
            <span className="footer-icons-container" role="img" aria-label="Instagram"><Instagram /></span>
            <span className="footer-icons-container" role="img" aria-label="Pinterest"><Pinterest /></span>
            <span className="footer-icons-container" role="img" aria-label="WhatsApp"><Whatsapp /></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

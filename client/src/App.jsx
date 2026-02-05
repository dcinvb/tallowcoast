import { useState, useEffect } from 'react';
import WaitlistForm from './WaitlistForm';
import './App.css';

function scrollToWaitlist() {
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
}

const SCROLL_THRESHOLD = 20;

export default function App() {
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setHeaderScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="app">
      <div className="banner">
        <div className="banner-video-wrap" aria-hidden="true">
          <video
            className="hero-video-bg"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>
        <header className={`header ${headerScrolled ? 'header-scrolled' : ''}`}>
          <div className="header-inner">
            <img src="/logo.png" alt="" className="logo" aria-hidden="true" />
            <img src="/wordmark.webp" alt="Tallow Coast" className="wordmark" />
          </div>
        </header>
        <section className="hero">
          <div className="hero-content">
            <h1>
              Natural skin care from
              <br />
              grass-fed beef tallow
            </h1>
            <p className="hero-subline">
              Simple, honest ingredients. No fillers.
              <br />
              Just quality tallow from pasture-raised cattle.
            </p>
            <button type="button" onClick={scrollToWaitlist} className="cta-button">
              Get notified at launch
            </button>
          </div>
        </section>
      </div>

      <main>
        <div className="main-inner">
        <section className="value-block">
          <h2 className="value-title">Why Tallow Coast</h2>
          <ul className="value-list">
            <li>
              <strong>Grass-fed tallow</strong> — Sourced from cattle raised on pasture, not grain.
            </li>
            <li>
              <strong>Minimal ingredients</strong> — We keep formulas simple so your skin gets what it needs.
            </li>
            <li>
              <strong>Launching soon</strong> — Join the waitlist and be first in line.
            </li>
          </ul>
        </section>

        <WaitlistForm />
        </div>
      </main>

      <footer className="footer">
        <p>© Tallow Coast. Natural skin care from grass-fed beef tallow.</p>
      </footer>
    </div>
  );
}

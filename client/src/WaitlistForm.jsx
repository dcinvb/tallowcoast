import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus('success');
        setMessage("You're on the list. We'll be in touch soon.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <section className="waitlist-section" id="waitlist">
      <h2>Join the waitlist</h2>
      <p className="waitlist-intro">Be the first to know when we launch. No spam, ever.</p>
      <form onSubmit={handleSubmit} className="waitlist-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={status === 'loading'}
          aria-label="Email address"
          className="waitlist-input"
        />
        <button type="submit" disabled={status === 'loading'} className="waitlist-button">
          {status === 'loading' ? 'Joining…' : 'Notify me'}
        </button>
      </form>
      {message && (
        <p className={`waitlist-message ${status === 'success' ? 'success' : 'error'}`} role="status">
          {message}
        </p>
      )}
    </section>
  );
}

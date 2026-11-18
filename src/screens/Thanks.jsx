import { useState } from 'react';
import { api } from '../lib/api.js';
import { useToast } from '../components/Layout.jsx';
import { AlertIcon, BagIcon, CheckIcon, DocIcon, PhoneIcon } from '../components/Icons.jsx';

const RATE_TXT = ['Tap a star to rate', 'We’re sorry — we’ll improve', 'Thanks for the feedback', 'Good to hear!', 'Great, thank you!', 'Excellent! Thank you 🙏'];
const fmt = (s) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
const ref = (id) => `EPS-${id.slice(0, 8).toUpperCase()}`;

export default function Thanks({ call, result, user, mode, onRetry, onDone }) {
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState({});
  const first = user.name.split(' ')[0];
  const connected = result.status === 'completed';

  const request = async (type, msg) => {
    if (sent[type]) return;
    try {
      await api(`/public/calls/${call.id}/requests`, { method: 'POST', body: { token: call.token, type } });
      setSent((s) => ({ ...s, [type]: true }));
      toast(msg);
    } catch (e) { toast(e.message); }
  };

  const rate = async (v) => {
    setRating(v);
    try { await api(`/public/calls/${call.id}/feedback`, { method: 'POST', body: { token: call.token, rating: v } }); }
    catch (e) { toast(e.message); }
  };

  if (!connected) {
    const missed = result.status === 'missed';
    return (
      <section className="screen">
        <div className="content center">
          <div className="result-ic warn"><AlertIcon /></div>
          <h2 style={{ marginTop: 14 }}>{missed ? 'All our experts are busy' : 'Call not connected'}</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            {missed ? 'Sorry for the wait, ' + first + '. You can try again or we can call you back shortly.' : 'The call was cancelled before an expert joined.'}
          </p>
          <div className="summary">
            <div className="r"><span>Reference ID</span><b>{ref(call.id)}</b></div>
            <div className="r"><span>Requested</span><b>{mode === 'video' ? 'Video call' : 'Voice call'}</b></div>
          </div>
          <button type="button" className={`na ${sent.callback ? 'done' : ''}`} style={{ width: '100%', marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}
            onClick={() => request('callback', `We’ll call you on +91 ${user.mobile}`)}>
            {sent.callback ? <CheckIcon /> : <PhoneIcon />}
            <div><b style={{ marginTop: 0 }}>{sent.callback ? 'Callback requested' : 'Request a callback'}</b><span>An expert will call +91 {user.mobile}</span></div>
          </button>
        </div>
        <div className="footer-cta">
          <button className="btn btn-primary" type="button" onClick={onRetry}>Try Again</button>
          <button className="btn btn-ghost" type="button" onClick={onDone}>Done</button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen">
      <div className="content center">
        <div className="result-ic ok"><CheckIcon /></div>
        <h2 style={{ marginTop: 14 }}>Thank you, {first}!</h2>
        <p className="muted" style={{ marginTop: 4 }}>We hope our expert was able to help you.</p>

        <div className="summary">
          <div className="r"><span>Reference ID</span><b>{ref(call.id)}</b></div>
          <div className="r"><span>Expert</span><b>{result.agentName || '—'}</b></div>
          <div className="r"><span>Call type</span><b>{mode === 'video' ? 'Video call' : 'Voice call'}</b></div>
          <div className="r"><span>Duration</span><b>{fmt(result.duration || 0)}</b></div>
        </div>

        <div className="rate-box">
          <b style={{ fontSize: 15 }}>Rate your experience</b>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} type="button" className={v <= rating ? 'on' : ''} aria-label={`${v} star`} onClick={() => rate(v)}>★</button>
            ))}
          </div>
          <div className="tiny" style={{ marginTop: 6 }}>{RATE_TXT[rating]}</div>
        </div>

        <div className="next-actions">
          <button className={`na ${sent.brochure ? 'done' : ''}`} type="button" onClick={() => request('brochure', 'Brochure will be sent to your WhatsApp')}>
            {sent.brochure ? <CheckIcon /> : <DocIcon />}<b>Get brochure</b><span>{sent.brochure ? 'Requested' : 'On WhatsApp'}</span>
          </button>
          <button className={`na ${sent.store_assist ? 'done' : ''}`} type="button" onClick={() => request('store_assist', 'Store staff notified — they will assist you shortly')}>
            {sent.store_assist ? <CheckIcon /> : <BagIcon />}<b>Buy in store</b><span>{sent.store_assist ? 'Staff notified' : 'Notify store staff'}</span>
          </button>
        </div>
      </div>
      <div className="footer-cta">
        <button className="btn btn-primary" type="button" onClick={onRetry}>Connect Again</button>
        <button className="btn btn-ghost" type="button" onClick={onDone}>Done</button>
      </div>
    </section>
  );
}

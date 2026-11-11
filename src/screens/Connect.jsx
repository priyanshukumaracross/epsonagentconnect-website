import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { LANGUAGES } from '../data/states.js';
import { PhoneIcon, VideoIcon } from '../components/Icons.jsx';

export default function Connect({ user, mode, setMode, language, setLanguage, onEdit, onStart, busy, error }) {
  const [avail, setAvail] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () => api('/public/availability').then((d) => alive && setAvail(d)).catch(() => {});
    load();
    const t = setInterval(load, 10000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const first = user.name.split(' ')[0];
  const available = avail?.agentsAvailable ?? 0;
  const online = avail?.agentsOnline ?? 0;

  return (
    <section className="screen">
      <div className="content">
        <div className="greet">
          <div className="avatar-sm">{first[0]?.toUpperCase()}</div>
          <div>
            <b>Hi {first}</b>
            <span>+91 {user.mobile.slice(0, 5)} {user.mobile.slice(5)} · {user.city}</span>
          </div>
          <button className="edit-link" type="button" onClick={onEdit}>Edit</button>
        </div>

        <h2 style={{ marginTop: 22 }}>How would you like to connect?</h2>
        <p className="muted" style={{ marginTop: 4 }}>Choose your preferred way to talk to an Epson expert.</p>

        <div className="mode-grid" role="radiogroup">
          <button className={`mode ${mode === 'video' ? 'on' : ''}`} type="button" role="radio" aria-checked={mode === 'video'} onClick={() => setMode('video')}>
            <span className="rec">RECOMMENDED</span>
            <div className="ic"><VideoIcon /></div>
            <div><b>Video call</b><span>See live product demos &amp; print samples</span></div>
            <div className="radio" />
          </button>
          <button className={`mode ${mode === 'voice' ? 'on' : ''}`} type="button" role="radio" aria-checked={mode === 'voice'} onClick={() => setMode('voice')}>
            <div className="ic"><PhoneIcon /></div>
            <div><b>Voice call</b><span>Quick audio consultation, low data usage</span></div>
            <div className="radio" />
          </button>
        </div>

        <div className="section-label">Preferred language</div>
        <div className="chips">
          {LANGUAGES.map((l) => (
            <button key={l.value} type="button" className={`chip ${language === l.value ? 'on' : ''}`} aria-pressed={language === l.value} onClick={() => setLanguage(l.value)}>{l.label}</button>
          ))}
        </div>

        {avail && (
          available > 0 ? (
            <div className="availability"><span className="dot-live" /><span><b>{available} expert{available > 1 ? 's' : ''}</b> available now · Est. wait under 1 min</span></div>
          ) : (
            <div className="availability"><span className="dot-off" /><span>{online > 0 ? 'All experts are on calls right now — you’ll be next in line.' : 'Our experts are currently offline. You can still request — we’ll call you back.'}</span></div>
          )
        )}

        {error && <div className="alert alert-error">{error}</div>}
      </div>

      <div className="footer-cta">
        <button className="btn btn-primary" type="button" onClick={onStart} disabled={busy}>
          {busy ? <span className="spinner" /> : (<>{mode === 'video' ? <VideoIcon width="20" height="20" /> : <PhoneIcon width="20" height="20" />} Start {mode === 'video' ? 'Video' : 'Voice'} Call</>)}
        </button>
      </div>
    </section>
  );
}

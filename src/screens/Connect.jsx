import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { PhoneIcon, VideoIcon } from '../components/Icons.jsx';

export default function Connect({ user, mode, setMode, onEdit, onStart, busy, error }) {
  const [avail, setAvail] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () => api('/public/availability').then((d) => alive && setAvail(d)).catch(() => {});
    load();
    const t = setInterval(load, 10000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const available = avail?.agentsAvailable ?? 0;
  const online = avail?.agentsOnline ?? 0;

  return (
    <section className="screen">
      <div className="content">
        <div className="greet">
          <div className="avatar-sm">{user.name.trim()[0]?.toUpperCase()}</div>
          <div>
            <b>{user.name}</b>
            <span>+91 {user.mobile.slice(0, 5)} {user.mobile.slice(5)}</span>
          </div>
          <button className="edit-link" type="button" onClick={onEdit}>Edit</button>
        </div>

        <h2 className="connect-q">How would you like to connect?</h2>

        <div className="mode-grid" role="radiogroup" aria-label="Call type">
          <button className={`mode ${mode === 'video' ? 'on' : ''}`} type="button" role="radio" aria-checked={mode === 'video'} onClick={() => setMode('video')}>
            <div className="ic"><VideoIcon /></div>
            <b>Video Call</b>
            <div className="radio" />
          </button>
          <button className={`mode ${mode === 'voice' ? 'on' : ''}`} type="button" role="radio" aria-checked={mode === 'voice'} onClick={() => setMode('voice')}>
            <div className="ic"><PhoneIcon /></div>
            <b>Voice Call</b>
            <div className="radio" />
          </button>
        </div>

        {avail && (
          available > 0 ? (
            <div className="availability"><span className="dot-live" /><span><b>{available} expert{available > 1 ? 's' : ''}</b> available now</span></div>
          ) : (
            <div className="availability"><span className="dot-off" /><span>{online > 0 ? 'All experts are on calls right now. You’ll be next in line.' : 'Our experts are currently offline. You can still call, and we’ll call you back if nobody is free.'}</span></div>
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

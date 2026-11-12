import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { api, SOCKET_URL } from '../lib/api.js';
import { createPeer, getMedia, mediaErrorMessage } from '../lib/peer.js';
import { FlipIcon, HangupIcon, LockIcon, MicIcon, MicOffIcon, UserIcon, VideoIcon, VideoOffIcon } from '../components/Icons.jsx';

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const initials = (name) => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

/**
 * phases: waiting (in queue) -> connecting (agent accepted, WebRTC negotiating) -> connected
 */
export default function Call({ call, mode, language, product, onEnd }) {
  const [phase, setPhase] = useState('waiting');
  const [mediaError, setMediaError] = useState('');
  const [queue, setQueue] = useState(null);
  const [agentName, setAgentName] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [hasLocalVideo, setHasLocalVideo] = useState(false);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [netIssue, setNetIssue] = useState(false);
  const [ending, setEnding] = useState(false);
  const [facing, setFacing] = useState('user');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const s = useRef({ stream: null, socket: null, peer: null, ice: null, facing: 'user', done: false, connectedAt: null, agentName: '', accepted: false });
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  const isVideo = mode === 'video';

  const finish = useCallback((result) => {
    const st = s.current;
    if (st.done) return;
    st.done = true;
    st.peer?.close();
    st.stream?.getTracks().forEach((t) => t.stop());
    st.socket?.disconnect();
    const localDuration = st.connectedAt ? Math.round((Date.now() - st.connectedAt) / 1000) : 0;
    onEndRef.current({ agentName: st.agentName, duration: result.duration ?? localDuration, ...result });
  }, []);

  const attachLocal = useCallback(() => {
    const st = s.current;
    if (localVideoRef.current && st.stream) localVideoRef.current.srcObject = st.stream;
    setHasLocalVideo(!!st.stream?.getVideoTracks().length);
  }, []);

  const startPeer = useCallback(async () => {
    const st = s.current;
    if (!st.ice) st.ice = (await api('/public/ice').catch(() => ({ iceServers: [] }))).iceServers;
    st.peer?.close();
    st.peer = createPeer({
      iceServers: st.ice,
      localStream: st.stream,
      recvVideo: isVideo,
      onSignal: (m) => st.socket?.emit('signal', m),
      onRemoteStream: (stream) => {
        if (isVideo && remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
        if (!isVideo && remoteAudioRef.current) remoteAudioRef.current.srcObject = stream;
        setHasRemoteVideo(stream.getVideoTracks().length > 0);
      },
      onStateChange: (state) => {
        if (state === 'connected') {
          setNetIssue(false);
          if (!st.connectedAt) { st.connectedAt = Date.now(); setPhase('connected'); }
        }
        if (state === 'disconnected' || state === 'failed') setNetIssue(true);
      },
    });
    await st.peer.makeOffer();
  }, [isVideo]);

  const acquireMedia = useCallback(async () => {
    const st = s.current;
    const run = st.run;
    try {
      const stream = await getMedia(mode, st.facing);
      // effect was torn down meanwhile (unmount / StrictMode re-run)
      if (st.done || st.run !== run || !run) { stream.getTracks().forEach((t) => t.stop()); return; }
      st.stream?.getTracks().forEach((t) => t.stop());
      st.stream = stream;
      setMediaError('');
      attachLocal();
      // agent may already have accepted while we were waiting for permission
      if (st.accepted) startPeer().catch(console.error);
    } catch (err) {
      setMediaError(mediaErrorMessage(err));
    }
  }, [mode, attachLocal, startPeer]);

  useEffect(() => {
    const st = s.current;
    const run = {};
    st.run = run;
    api('/public/ice').then((d) => { st.ice = d.iceServers; }).catch(() => {});
    acquireMedia();

    // Default transports: long-polling, upgraded to WebSocket when available
    const socket = io(SOCKET_URL, { auth: { callId: call.id, customerToken: call.token } });
    st.socket = socket;
    socket.on('connect_error', (err) => {
      if (err.message === 'CALL_NOT_ACTIVE' || err.message === 'UNAUTHORIZED') finish({ status: 'cancelled' });
      // temporary server/database problem: socket.io doesn't retry these by itself
      else if (err.message === 'SERVER_ERROR') setTimeout(() => { if (st.run === run) socket.connect(); }, 3000);
    });
    socket.on('queue:position', setQueue);
    socket.on('call:accepted', ({ agent }) => {
      st.agentName = agent.name;
      st.accepted = true;
      setAgentName(agent.name);
      setPhase((p) => (p === 'connected' ? p : 'connecting'));
      if (st.stream) startPeer().catch(console.error);
    });
    socket.on('signal', (msg) => st.peer?.handle(msg).catch(console.error));
    socket.on('call:ended', ({ status, duration }) => finish({ status, duration }));
    socket.on('call:missed', () => finish({ status: 'missed' }));

    const onHide = () => socket.emit('call:end');
    window.addEventListener('pagehide', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      st.run = null;
      st.peer?.close();
      st.peer = null;
      st.stream?.getTracks().forEach((t) => t.stop());
      st.stream = null;
      socket.removeAllListeners();
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== 'connected') return undefined;
    const t = setInterval(() => setSeconds(Math.round((Date.now() - s.current.connectedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // re-attach local preview when the <video> mounts
  useEffect(attachLocal, [attachLocal, phase]);

  const hangUp = () => {
    if (ending) return;
    setEnding(true);
    const st = s.current;
    st.socket?.emit('call:end');
    // fallback if the server confirmation doesn't arrive
    setTimeout(() => finish({ status: st.connectedAt ? 'completed' : 'cancelled' }), 4000);
  };

  const toggleMute = () => {
    const next = !muted;
    s.current.stream?.getAudioTracks().forEach((t) => { t.enabled = !next; });
    setMuted(next);
  };

  const toggleCam = () => {
    const next = !camOff;
    s.current.stream?.getVideoTracks().forEach((t) => { t.enabled = !next; });
    setCamOff(next);
  };

  const flipCam = async () => {
    const st = s.current;
    const old = st.stream?.getVideoTracks()[0];
    if (!old) return;
    const next = st.facing === 'user' ? 'environment' : 'user';
    old.stop(); // many phones can't open two cameras at once
    try {
      const ns = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: next } } })
        .catch(() => navigator.mediaDevices.getUserMedia({ video: { facingMode: next } }));
      const track = ns.getVideoTracks()[0];
      track.enabled = !camOff;
      await st.peer?.replaceVideoTrack(track);
      st.stream.removeTrack(old);
      st.stream.addTrack(track);
      st.facing = next;
      setFacing(next);
      attachLocal();
    } catch {
      // restore the previous camera
      const ns = await navigator.mediaDevices.getUserMedia({ video: { facingMode: st.facing } }).catch(() => null);
      const track = ns?.getVideoTracks()[0];
      if (track) { await st.peer?.replaceVideoTrack(track); st.stream.removeTrack(old); st.stream.addTrack(track); attachLocal(); }
    }
  };

  /* ---------- status line ---------- */
  const status = phase === 'connected'
    ? (<><span className="dot-live" /><span className="timer">{fmt(seconds)}</span></>)
    : phase === 'connecting'
      ? <span className="connecting-dots">Connecting</span>
      : <span className="connecting-dots">Finding an expert</span>;

  const waitingInfo = phase === 'waiting' && (
    <div className="queue-info">
      Matching you with an expert who speaks <b>{language}</b>
      {queue && queue.position > 1 ? <> · You are <b>#{queue.position}</b> in line</> : null}
      <div style={{ marginTop: 6, opacity: 0.8 }}>Please keep this screen open.</div>
    </div>
  );

  const errorBox = mediaError && (
    <div className="media-error">
      {mediaError}
      <button type="button" className="btn btn-primary" onClick={acquireMedia}>Try again</button>
    </div>
  );

  const avatar = (
    <div className="ring-wrap">
      {phase !== 'connected' && (<><div className="ring" /><div className="ring" /><div className="ring" /></>)}
      <div className="avatar-lg">{agentName ? initials(agentName) : <UserIcon width="46" height="46" />}</div>
    </div>
  );

  const controls = (
    <div className="controls">
      <button className={`ctl ${muted ? 'on' : ''}`} type="button" onClick={toggleMute} disabled={!s.current.stream} aria-pressed={muted}>
        <span className="c">{muted ? <MicOffIcon /> : <MicIcon />}</span>{muted ? 'Unmute' : 'Mute'}
      </button>
      {isVideo && hasLocalVideo && (
        <>
          <button className={`ctl ${camOff ? 'on' : ''}`} type="button" onClick={toggleCam} aria-pressed={camOff}>
            <span className="c">{camOff ? <VideoOffIcon /> : <VideoIcon />}</span>Camera
          </button>
          <button className="ctl" type="button" onClick={flipCam}><span className="c"><FlipIcon /></span>Flip</button>
        </>
      )}
      <button className="ctl end" type="button" onClick={hangUp} disabled={ending}>
        <span className="c"><HangupIcon /></span>{phase === 'waiting' ? 'Cancel' : 'End'}
      </button>
    </div>
  );

  const top = (
    <div className="call-top">
      <span className="wordmark">EPSON</span>
      <span className="secure"><LockIcon width="12" height="12" />{isVideo ? 'Encrypted video' : 'Secure call'}</span>
    </div>
  );

  if (!isVideo) {
    return (
      <div className="call">
        {top}
        <div className="call-center">
          {avatar}
          <div className="call-name">{agentName || 'Epson Expert'}</div>
          <div className="call-role">Epson Product Specialist{product ? ` · ${product}` : ''}</div>
          <div className="call-status">{status}</div>
          {phase === 'connected' && <div className={`wave ${muted ? 'paused' : ''}`}>{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div>}
          {netIssue && <div className="net-warn">Weak connection — trying to reconnect…</div>}
          {waitingInfo}
          {errorBox}
        </div>
        {controls}
        <audio ref={remoteAudioRef} autoPlay />
      </div>
    );
  }

  return (
    <div className="call">
      <div className="remote-video">
        <video ref={remoteVideoRef} autoPlay playsInline style={{ display: hasRemoteVideo && phase === 'connected' ? 'block' : 'none' }} />
      </div>
      <div className="video-shade-top" />
      <div className="video-shade-bottom" />
      {top}
      {phase === 'connected' && hasRemoteVideo ? (
        <div className="video-info" style={{ flex: 1 }}>
          <div className="call-name">{agentName}</div>
          <div className="call-role">Epson Product Specialist</div>
          <div className="call-status">{status}</div>
          {netIssue && <div className="net-warn" style={{ display: 'inline-block', marginLeft: 8 }}>Weak connection…</div>}
        </div>
      ) : (
        <div className="call-center">
          {avatar}
          <div className="call-name">{agentName || 'Epson Expert'}</div>
          <div className="call-role">Epson Product Specialist{product ? ` · ${product}` : ''}</div>
          <div className="call-status">{status}</div>
          {phase === 'connected' && !hasRemoteVideo && <div className="queue-info">Expert joined with audio only</div>}
          {waitingInfo}
          {errorBox}
        </div>
      )}
      <div className="self-view">
        <video ref={localVideoRef} autoPlay playsInline muted className={facing === 'user' ? 'mirror' : ''} style={{ opacity: hasLocalVideo && !camOff ? 1 : 0 }} />
        {(!hasLocalVideo || camOff) && <span>{camOff ? 'Camera off' : 'You'}</span>}
      </div>
      {controls}
    </div>
  );
}

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import epsonLogo from '../assets/epson-logo.webp';

const HELPLINE = import.meta.env.VITE_HELPLINE_NUMBER || '';

export function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <img className="wordmark" src={epsonLogo} alt="Epson" />
        <span className="brand-sub">Expert Connect</span>
      </div>
      {HELPLINE && <a className="help-link" href={`tel:${HELPLINE.replace(/[^\d+]/g, '')}`}>Helpline</a>}
    </header>
  );
}

const STEPS = ['Your Details', 'How to Connect', 'Talk to an Expert'];

export function Stepper({ step }) {
  if (!step) return null;
  return (
    <div className="stepper" aria-label={`Step ${step} of 3`}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        return (
          <div key={label} className={`s ${n < step ? 'done' : ''} ${n === step ? 'active' : ''}`}>
            <div className="bar"><i /></div>
            <div className="lbl">{label}</div>
          </div>
        );
      })}
    </div>
  );
}

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const timer = useRef();
  const toast = useCallback((m) => {
    setMsg(m);
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className={`toast ${show ? 'show' : ''}`} role="status" aria-live="polite">{msg}</div>
    </ToastCtx.Provider>
  );
}

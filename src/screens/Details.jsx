import { useState } from 'react';

const PRIVACY_URL = import.meta.env.VITE_PRIVACY_POLICY_URL || '';

export function validate(f) {
  const e = {};
  if (f.name.replace(/[^\p{L}]/gu, '').length < 2) e.name = 'Please enter your full name.';
  if (!/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = 'Enter a valid 10-digit mobile number.';
  if (!f.consent) e.consent = 'Please accept the Privacy Policy to continue.';
  return e;
}

export default function Details({ form, setForm, onSubmit, busy, error }) {
  const [errors, setErrors] = useState({});

  const update = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      Object.keys(patch).forEach((k) => delete next[k]);
      return next;
    });
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(Object.keys(e)[0])?.focus();
      return;
    }
    onSubmit();
  };

  const field = (id) => `field ${errors[id] ? 'invalid' : ''}`;

  return (
    <section className="screen">
      <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="content">
          <h2>Let&apos;s get started</h2>
          <p className="muted subtitle">Tell us a little about yourself</p>

          <div className={field('name')}>
            <label htmlFor="name">Full Name <span className="req">*</span></label>
            <input className="input" id="name" type="text" autoComplete="name" placeholder="e.g. Rahul Verma" maxLength={60}
              value={form.name} onChange={(e) => update({ name: e.target.value.replace(/[^\p{L}\p{M} .'-]/gu, '') })} />
            {errors.name && <div className="err-msg">{errors.name}</div>}
          </div>

          <div className={field('mobile')}>
            <label htmlFor="mobile">Mobile Number <span className="req">*</span></label>
            <div className="input-wrap">
              <span className="prefix">+91</span>
              <input className="input has-prefix" id="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" maxLength={10}
                value={form.mobile} onChange={(e) => update({ mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
            </div>
            {errors.mobile && <div className="err-msg">{errors.mobile}</div>}
          </div>

          <label className={`consent ${errors.consent ? 'invalid' : ''}`}>
            <input id="consent" type="checkbox" checked={form.consent} onChange={(e) => update({ consent: e.target.checked })} />
            <span>I agree to the{' '}
              {PRIVACY_URL ? <a href={PRIVACY_URL} target="_blank" rel="noreferrer">Privacy Policy</a> : 'Privacy Policy'}{' '}
              and consent to being contacted by Epson India regarding my query.</span>
          </label>
          {errors.consent && <div className="err-msg">{errors.consent}</div>}

          {error && <div className="alert alert-error">{error}</div>}
        </div>

        <div className="footer-cta">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? <span className="spinner" /> : 'Continue'}
          </button>
        </div>
      </form>
    </section>
  );
}

import { useMemo, useState } from 'react';
import { INTERESTS, STATES } from '../data/states.js';

const OTHER = '__other';
const PRIVACY_URL = import.meta.env.VITE_PRIVACY_POLICY_URL || '';

export function validate(f) {
  const e = {};
  if (f.name.replace(/[^\p{L}]/gu, '').length < 2) e.name = 'Please enter your name (min. 2 letters).';
  if (!/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = 'Enter a valid 10-digit Indian mobile number.';
  if (!f.state) e.state = 'Select your state.';
  if (!f.city) e.city = 'Select your city.';
  else if (f.city === OTHER && f.cityOther.trim().length < 2) e.cityOther = 'Please enter your city.';
  return e;
}

export const resolvedCity = (f) => (f.city === OTHER ? f.cityOther.trim() : f.city);

export default function Details({ form, setForm, onSubmit, busy, error }) {
  const [errors, setErrors] = useState({});
  const cities = useMemo(() => STATES[form.state] || [], [form.state]);

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

  const toggleInterest = (v) =>
    update({ interests: form.interests.includes(v) ? form.interests.filter((x) => x !== v) : [...form.interests, v] });

  const field = (id) => `field ${errors[id] ? 'invalid' : ''}`;

  return (
    <section className="screen">
      <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="content">
          <h2>Tell us about yourself</h2>
          <p className="muted" style={{ marginTop: 4 }}>So our expert can assist you better.</p>

          <div className={field('name')}>
            <label htmlFor="name">Full name <span className="req">*</span></label>
            <input className="input" id="name" type="text" autoComplete="name" placeholder="e.g. Rahul Verma" maxLength={60}
              value={form.name} onChange={(e) => update({ name: e.target.value.replace(/[^\p{L}\p{M} .'-]/gu, '') })} />
            {errors.name && <div className="err-msg">{errors.name}</div>}
          </div>

          <div className={field('mobile')}>
            <label htmlFor="mobile">Mobile number <span className="req">*</span></label>
            <div className="input-wrap">
              <span className="prefix">+91</span>
              <input className="input has-prefix" id="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" maxLength={10}
                value={form.mobile} onChange={(e) => update({ mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
            </div>
            {errors.mobile && <div className="err-msg">{errors.mobile}</div>}
          </div>

          <div className="row-2">
            <div className={field('state')}>
              <label htmlFor="state">State <span className="req">*</span></label>
              <select className="input" id="state" value={form.state} onChange={(e) => update({ state: e.target.value, city: '', cityOther: '' })}>
                <option value="">Select</option>
                {Object.keys(STATES).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <div className="err-msg">{errors.state}</div>}
            </div>
            <div className={field('city')}>
              <label htmlFor="city">City <span className="req">*</span></label>
              <select className="input" id="city" value={form.city} disabled={!form.state} onChange={(e) => update({ city: e.target.value })}>
                <option value="">Select</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                {form.state && <option value={OTHER}>Other</option>}
              </select>
              {errors.city && <div className="err-msg">{errors.city}</div>}
            </div>
          </div>

          {form.city === OTHER && (
            <div className={field('cityOther')}>
              <label htmlFor="cityOther">Enter your city <span className="req">*</span></label>
              <input className="input" id="cityOther" type="text" placeholder="City name" maxLength={40}
                value={form.cityOther} onChange={(e) => update({ cityOther: e.target.value })} />
              {errors.cityOther && <div className="err-msg">{errors.cityOther}</div>}
            </div>
          )}

          <div className="field">
            <span className="label">Looking for <span className="tiny" style={{ fontWeight: 400 }}>(optional)</span></span>
            <div className="chips">
              {INTERESTS.map((v) => (
                <button key={v} type="button" className={`chip ${form.interests.includes(v) ? 'on' : ''}`} aria-pressed={form.interests.includes(v)} onClick={() => toggleInterest(v)}>{v}</button>
              ))}
            </div>
          </div>

          <label className="consent">
            <input type="checkbox" checked={form.consent} onChange={(e) => update({ consent: e.target.checked })} />
            <span>I agree to be contacted by Epson India regarding my query and accept the{' '}
              {PRIVACY_URL ? <a href={PRIVACY_URL} target="_blank" rel="noreferrer">Privacy Policy</a> : 'Privacy Policy'}.</span>
          </label>

          {error && <div className="alert alert-error">{error}</div>}
        </div>

        <div className="footer-cta">
          <button className="btn btn-primary" type="submit" disabled={!form.consent || busy}>
            {busy ? <span className="spinner" /> : 'Continue'}
          </button>
        </div>
      </form>
    </section>
  );
}

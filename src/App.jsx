import { useEffect, useState } from 'react';
import { api } from './lib/api.js';
import { Header, Stepper } from './components/Layout.jsx';
import Welcome from './screens/Welcome.jsx';
import Details from './screens/Details.jsx';
import Connect from './screens/Connect.jsx';
import Call from './screens/Call.jsx';
import Thanks from './screens/Thanks.jsx';

// The QR code in each store points to:  https://<website>/?store=STORE_CODE&product=EcoTank%20L3250
const params = new URLSearchParams(window.location.search);
const STORE_CODE = params.get('store');
const PRODUCT_PARAM = params.get('product');

const EMPTY_FORM = { name: '', mobile: '', consent: false };
const STEP = { welcome: 0, details: 1, connect: 2, call: 3, thanks: 3 };

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [store, setStore] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [lead, setLead] = useState(null); // { id, signature, user }
  const [mode, setMode] = useState('video');
  const [call, setCall] = useState(null); // { id, token }
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!STORE_CODE) return;
    api(`/public/stores/${encodeURIComponent(STORE_CODE)}`).then((d) => setStore(d.store)).catch(() => {});
  }, []);

  const product = PRODUCT_PARAM || store?.default_product || null;

  const go = (name) => {
    setError('');
    setScreen(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitDetails = async () => {
    const payload = {
      name: form.name.trim(),
      mobile: form.mobile,
      storeCode: store?.code || STORE_CODE || null,
      product,
      consent: form.consent,
    };
    const signature = JSON.stringify(payload);
    if (lead?.signature === signature) return go('connect'); // unchanged, reuse lead
    setBusy(true);
    setError('');
    try {
      const { lead: created } = await api('/public/leads', { method: 'POST', body: payload });
      setLead({ id: created.id, signature, user: payload });
      go('connect');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const startCall = async () => {
    setBusy(true);
    setError('');
    try {
      const d = await api('/public/calls', { method: 'POST', body: { leadId: lead.id, mode } });
      setCall({ id: d.call.id, token: d.customerToken });
      setResult(null);
      setScreen('call');
    } catch (e) {
      setError(e.status === 404 ? 'Your session expired. Please fill in your details again.' : e.message);
      if (e.status === 404) { setLead(null); setScreen('details'); }
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setLead(null);
    setCall(null);
    setResult(null);
    go('welcome');
  };

  return (
    <div className="app">
      <Header />
      <Stepper step={STEP[screen]} />
      <main>
        {screen === 'welcome' && <Welcome store={store} onStart={() => go('details')} />}
        {screen === 'details' && <Details form={form} setForm={setForm} onSubmit={submitDetails} busy={busy} error={error} />}
        {screen === 'connect' && lead && (
          <Connect user={lead.user} mode={mode} setMode={setMode}
            onEdit={() => go('details')} onStart={startCall} busy={busy} error={error} />
        )}
        {screen === 'thanks' && call && result && (
          <Thanks call={call} result={result} user={lead.user} mode={mode} onRetry={() => go('connect')} onDone={reset} />
        )}
      </main>
      <div className="site-footer">© {new Date().getFullYear()} Epson India Pvt. Ltd.</div>

      {screen === 'call' && call && (
        <Call key={call.id} call={call} mode={mode} product={product}
          onEnd={(r) => { setResult(r); go('thanks'); }} />
      )}
    </div>
  );
}

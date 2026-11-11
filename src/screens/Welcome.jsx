import { ArrowIcon, ClockIcon, PinIcon, PrinterArt, ShieldIcon, VideoIcon } from '../components/Icons.jsx';

export default function Welcome({ store, product, onStart }) {
  return (
    <section className="screen">
      <div className="hero">
        <span className="store-chip">
          <PinIcon width="14" height="14" />
          <span>{store ? `${store.name}${store.city ? `, ${store.city}` : ''}` : 'Epson India'}</span>
        </span>
        <h1>Need help choosing a printer?</h1>
        <p>Talk to a certified Epson product expert instantly over video or voice call — right from this store.</p>
        <div className="tagline">Exceed Your Vision</div>
      </div>

      <div className="printer-card">
        <PrinterArt className="printer-art" />
        <div>
          <span className="badge">{product ? 'On display' : 'Epson range'}</span>
          <div className="model">{product || 'Printers, Scanners & Projectors'}</div>
          <div className="tiny">{product ? 'Ask our expert anything about this model' : 'EcoTank · WorkForce · SureColor · EpiqVision'}</div>
        </div>
      </div>

      <div className="content">
        <div className="features">
          <div className="feature"><VideoIcon /><b>Live demo</b><span>See it in action</span></div>
          <div className="feature"><ClockIcon /><b>&lt; 1 min</b><span>Avg. wait time</span></div>
          <div className="feature"><ShieldIcon /><b>Certified</b><span>Epson experts</span></div>
        </div>

        <div className="how">
          <h3>How it works</h3>
          <div className="how-step"><div className="n">1</div><p><b>Share basic details</b> — name, mobile number, state &amp; city.</p></div>
          <div className="how-step"><div className="n">2</div><p><b>Choose video or voice</b> — whatever you&apos;re comfortable with.</p></div>
          <div className="how-step"><div className="n">3</div><p><b>Get expert guidance</b> — features, pricing, offers &amp; doubts cleared.</p></div>
        </div>
      </div>

      <div className="footer-cta">
        <button className="btn btn-primary" type="button" onClick={onStart}>
          Get Started <ArrowIcon width="18" height="18" />
        </button>
        <p className="tiny center" style={{ marginTop: 10 }}>Free service · Available 9:00 AM – 9:00 PM, all days</p>
      </div>
    </section>
  );
}

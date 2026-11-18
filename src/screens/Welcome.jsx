import { useEffect, useRef, useState } from 'react';
import { ArrowIcon, PinIcon, PrinterArt, ProjectorArt, ScannerArt } from '../components/Icons.jsx';

const PRODUCTS = [
  { name: 'Printers', text: 'Ink tank, inkjet and photo printers for home and office.', Art: PrinterArt },
  { name: 'Projectors', text: 'Projectors for home entertainment, business and education.', Art: ProjectorArt },
  { name: 'Scanners', text: 'Document and photo scanners for fast, easy digitising.', Art: ScannerArt },
];

const STEPS = [
  'Enter your name and mobile number',
  'Choose between a voice or video call',
  'Connect with an Epson expert and get personalised product guidance',
];

/** Swipeable product carousel: scroll-snap + dots, auto-advances until the customer touches it. */
function ProductCarousel() {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const touched = useRef(false);

  const goTo = (i) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = track.current;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)));
    el.addEventListener('scroll', onScroll, { passive: true });
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = reduce ? null : setInterval(() => {
      if (touched.current) return;
      const next = (Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)) + 1) % PRODUCTS.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    }, 4000);
    return () => { el.removeEventListener('scroll', onScroll); clearInterval(timer); };
  }, []);

  const stop = () => { touched.current = true; };

  return (
    <div className="carousel" aria-roledescription="carousel" aria-label="Epson products">
      <div className="carousel-track" ref={track} onPointerDown={stop} onTouchStart={stop} onWheel={stop}>
        {PRODUCTS.map(({ name, text, Art }, i) => (
          <div className="product-slide" key={name} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${PRODUCTS.length}: ${name}`}>
            <div className="product-art"><Art /></div>
            <div><b>{name}</b><span>{text}</span></div>
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {PRODUCTS.map((p, i) => (
          <button key={p.name} type="button" className={i === index ? 'on' : ''} aria-label={`Show ${p.name}`} aria-current={i === index}
            onClick={() => { stop(); goTo(i); }} />
        ))}
      </div>
    </div>
  );
}

export default function Welcome({ store, onStart }) {
  return (
    <section className="screen">
      <div className="hero">
        <span className="store-chip">
          <PinIcon width="14" height="14" />
          <span>{store ? `${store.name}${store.city ? `, ${store.city}` : ''}` : 'Epson India'}</span>
        </span>
        <h1>Looking for the right Epson product?</h1>
        <p>Speak with an Epson product expert through a voice or video call. Get personalised advice to find the right product for your needs, right here in the store.</p>
      </div>

      <ProductCarousel />

      <div className="content">
        <div className="how">
          <h3>How it Works?</h3>
          <p className="muted">Getting expert assistance is easy.</p>
          {STEPS.map((text, i) => (
            <div className="how-step" key={text}><div className="n">{String(i + 1).padStart(2, '0')}</div><p>{text}</p></div>
          ))}
        </div>
      </div>

      <div className="footer-cta">
        <button className="btn btn-primary" type="button" onClick={onStart}>
          Get Started Now <ArrowIcon width="18" height="18" />
        </button>
        <p className="tiny center" style={{ marginTop: 10 }}>Available Monday to Saturday, 10:00 AM to 6:00 PM</p>
      </div>
    </section>
  );
}

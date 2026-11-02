import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import tinyGantryImage from '../assets/tiny/11.png';
import { faqs } from './content';
import { homeHash } from './paths';

// Keeps three.js out of the main bundle so the homepage doesn't download it.
const MachineScene = lazy(() => import('./MachineScene'));

const terrainImages = Object.entries(import.meta.glob<string>(
  '../assets/terrain/*.{png,jpg,jpeg}',
  { eager: true, query: '?url', import: 'default' },
))
  .map(([path, src]) => ({
    src,
    name: path.split(/[\\/]/).pop() ?? path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

const salientFeatures = [
  'Under chassis and wheel wash facility.',
  'Washes car up to 6.1 meters length.',
  'High water pressure, lower water usage.',
  'SS 304 grade stainless steel components in water prone areas.',
  'Appealing gantry design with no exposed service lines.',
  'Single arm delivers full available concentrated pressure.',
  'Reduced component counts. Reduced electricity consumption.',
  'More than a year of research and development results near-zero maintenance.',
  'Light weight compact gantry designed for crane-free erection.',
  'Advanced foaming technology.',
  '4-inch-high resolution touchscreen human machine interface.',
  'All hardware shall be SS 304 grade stainless steel.',
];

const equipment = [
  ['Structure', 'TATA steel'],
  ['High-pressure pump', 'Lubi'],
  ['Sensors', 'Pepperl+Fuchs'],
  ['Programmable controller', 'Siemens PLC'],
  ['Drive motor', 'Crompton'],
  ['Bearings', 'NTN Japan'],
  ['Gearbox', 'Rotomotive'],
  ['Variable frequency drive', 'Schneider'],
];

type ProductImage = {
  src: string;
  name: string;
};

function ImageCarousel({
  images,
  label,
  className,
}: {
  images: ProductImage[];
  label: string;
  className: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const activeImage = images[activeIndex];
  const showPrevious = () => setActiveIndex((index) => (index - 1 + images.length) % images.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % images.length);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setIsInView(entry.isIntersecting);
    });
    observer.observe(carousel);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isInView || images.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [images.length, isInView, isPlaying]);

  return (
    <div
      ref={carouselRef}
      className={`image-carousel ${className}`}
      role="region"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') showPrevious();
        if (event.key === 'ArrowRight') showNext();
      }}
    >
      <figure
        className="image-carousel-slide"
        onPointerDown={(event) => { pointerStart.current = event.clientX; }}
        onPointerUp={(event) => {
          if (pointerStart.current === null) return;
          const delta = event.clientX - pointerStart.current;
          pointerStart.current = null;
          if (Math.abs(delta) > 45) {
            if (delta > 0) showPrevious();
            else showNext();
          }
        }}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        <img
          src={activeImage.src}
          alt={`${label} ${activeIndex + 1}`}
          loading={activeIndex === 0 ? 'eager' : 'lazy'}
          draggable={false}
        />
      </figure>
      <div className="image-carousel-controls">
        <button type="button" className="image-carousel-arrow" aria-label="Previous image" onClick={showPrevious}>
          <span aria-hidden="true">←</span>
        </button>
        <span className="image-carousel-count" aria-live="off">
          {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
        <button type="button" className="image-carousel-arrow" aria-label="Next image" onClick={showNext}>
          <span aria-hidden="true">→</span>
        </button>
        
        
      </div>
    </div>
  );
}

function ProductContact() {
  return (
    <section className="section contact-section product-contact" id="contact">
      <div className="contact-shell">
        <div className="contact-copy">
          <p className="kicker">Let's talk.</p>
          <h2 className="t-h2">Bring Tank's tiny to your site.</h2>
          <p className="product-section-copy">Tell us about your location and we’ll help you explore the right setup.</p>
        </div>
        <div className="product-contact-card">
          <p>Want to see how Tank's tiny could work at your location?</p>
          <a className="button button--primary radius-full" href={homeHash('contact')}>Contact us</a>
        </div>
      </div>
    </section>
  );
}

function ProductFaq() {
  return (
    <section className="section faq-section" id="faq" aria-labelledby="tiny-faq-title">
      <div className="faq-shell">
        <div className="faq-intro">
          <p className="kicker">Good to know.</p>
          <h2 className="t-h2" id="tiny-faq-title">Tank's tiny, at a glance.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TinyProductPage() {
  const assemblyProgress = useRef(1);
  const storyProgress = useRef(0.5);

  return (
    <main className="page-shell product-page" id="top">
      <SiteNav page="tiny" />
      <section className="product-page-hero">
        <div className="product-page-hero-copy">
          <p className="kicker">Meet the machine</p>
          <h1 className="product-page-title">Small footprint.<br />A&nbsp;complete wash.</h1>
          <p className="product-page-lede">
            Contactless, automatic 360° washing with high-pressure water and foam—cleaning any car size in around three minutes.
          </p>
        </div>
        <div className="product-page-model" aria-label="Interactive 3D render of Tank's tiny">
          <Suspense fallback={<p className="model-loading">Loading 3D model…</p>}>
            <MachineScene
              assemblyProgress={assemblyProgress}
              storyProgress={storyProgress}
              isVisible
              interactive
            />
          </Suspense>

        </div>
      </section>

      <section className="product-introduction product-content-section">
        <div className="product-section-heading">
          <p className="kicker">Introduction</p>
          <h2>Who is Tank's tiny?</h2>
        </div>
        <div className="product-introduction-copy">
          <p>
            Tank's tiny is a contactless automatic single-arm washing machine. Its arm delivers a 360° high-pressure water and foam shower to clean vehicles rapidly and consistently.
          </p>
          <p>
            Compared with manual washing, automation helps deliver a more efficient and repeatable wash—without compromising the compact footprint.
          </p>
        </div>
      </section>

      <section className="product-name-section">
        <div className="product-name-image">
          <img
            src={tinyGantryImage}
            alt="Compact Tank's tiny gantry render"
            width={1311}
            height={1348}
            loading="lazy"
          />
          <span className="image-caption">Advanced compact-size gantry</span>
        </div>
        <div className="product-name-copy">
          <p className="kicker">Why the name tiny?</p>
          <h2>The world's smallest single&#8209;arm gantry.</h2>
          <p>
            A reduced component count gives Tank's tiny its compact form and lowers the floor space needed for installation.
          </p>
        </div>
      </section>

      <section className="product-content-section">
        <div className="product-section-heading">
          <p className="kicker">Salient features</p>
          <h2>Intense pressure.<br />Stubborn dirt doesn’t stand a chance.</h2>
        </div>
        <ul className="product-feature-grid">
          {salientFeatures.map((feature, index) => (
            <li className="product-feature" key={feature}>
              <span className="product-feature-number">{String(index + 1).padStart(2, '0')}</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="product-equipment-section">
        <div className="product-section-heading">
          <p className="kicker">Components and controls</p>
          <h2>Trusted names. Practical controls.</h2>
        </div>
        <div className="equipment-grid">
          {equipment.map(([system, make]) => (
            <div className="equipment-item" key={system}>
              <span>{system}</span>
              <strong>{make}</strong>
            </div>
          ))}
        </div>
      </section>

      <ProductFaq />
      <ProductContact />
      <SiteFooter />
    </main>
  );
}

export function TerrainProductPage() {
  return (
    <main className="page-shell terrain-page" id="top">
      <SiteNav page="terrain" />
      <section className="terrain-intro" aria-labelledby="terrain-heading">
        <div className="terrain-intro-copy">
          <p className="kicker">Tank's terrain</p>
          <h1 id="terrain-heading">Terrain</h1>
          <p className="terrain-intro-lede">
            Tank's Terrain is taking shape. Explore an early engineering preview and get in touch with our team to learn more.
          </p>
          <a className="button button--primary radius-full" href={homeHash('contact')}>
            Enquire about Terrain <span aria-hidden="true">→</span>
          </a>
        </div>
        <aside className="terrain-intro-aside" aria-label="Terrain product status">
          <span className="terrain-status-label">Product status</span>
          <span className="terrain-coming-soon">
            <span className="terrain-status-dot" aria-hidden="true" />
            Coming soon
          </span>
          <a className="terrain-preview-link" href="#terrain-preview">
            View the engineering preview <span aria-hidden="true">↓</span>
          </a>
        </aside>
      </section>
      <section
        className="terrain-preview-section"
        id="terrain-preview"
        aria-labelledby="terrain-preview-heading"
      >
        <div className="terrain-preview-heading">
          <div>
            <p className="kicker">Engineering preview</p>
            <h2 id="terrain-preview-heading">A first look at Terrain.</h2>
          </div>
          <p className="terrain-preview-copy">
            Browse early renderings of Tank's Terrain as the design takes shape.
          </p>
        </div>
        <div className="terrain-image-frame">
          <ImageCarousel
            images={terrainImages}
            label="Tank's Terrain engineering preview"
            className="terrain-image-carousel"
          />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

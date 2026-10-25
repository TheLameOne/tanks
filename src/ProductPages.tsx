import { useEffect, useRef, useState } from 'react';
import MachineScene from './MachineScene';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { storySteps } from './content';

const tinyImages = Object.entries(import.meta.glob<string>(
  '../assets/tiny/*.{png,jpg,jpeg}',
  { eager: true, query: '?url', import: 'default' },
))
  .map(([path, src]) => ({
    src,
    name: path.split(/[\\/]/).pop() ?? path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

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
  'Automatic car-length detection',
  'Under-chassis and wheel-wash facility',
  'Washes vehicles up to 6.1 metres long',
  'High water pressure with lower water usage',
  'SS304 components in water-prone areas',
  'Compact gantry with no exposed flexible pipes',
  'Single arm delivers the full available water pressure',
  '13 nozzles deliver up to 22 bar for the external wash',
  'Reinforced frame to handle high-pressure dynamic loads',
  'Improved structural stability',
];

const technicalFeatures = [
  'Compact, simple design for lower maintenance',
  'Sensitive components protected beneath the gantry cover',
  'High-pressure pump for manual washing',
  'No air compressor or pneumatic components',
  'No detergent pump, helping reduce power consumption',
  'Track stabilization designed for quieter operation and reduced wear',
  'Rubber-coated metal wheels for traction and long service life',
  'Lightweight structure designed for manual erection without a crane',
  'Advanced foaming technology',
  'More than one year of research and development',
];

const equipment = [
  ['Structure', 'TATA steel'],
  ['High-pressure pump', 'Lubi'],
  ['Sensors', 'Pepperl+Fuchs'],
  ['Programmable controller', 'Siemens PLC'],
  ['Drive motor', 'Crompton'],
  ['Bearings', 'NTN Japan'],
  ['Water-prone hardware', 'SS304 stainless steel'],
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
  const pointerStart = useRef<number | null>(null);
  const activeImage = images[activeIndex];
  const showPrevious = () => setActiveIndex((index) => (index - 1 + images.length) % images.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % images.length);

  useEffect(() => {
    if (!isPlaying || images.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [images.length, isPlaying]);

  return (
    <div
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
        <button
          type="button"
          className="image-carousel-toggle"
          aria-pressed={isPlaying}
          onClick={() => setIsPlaying((playing) => !playing)}
        >
          {isPlaying ? 'Pause' : 'Play'}
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
          <a className="button button--primary radius-full" href="/#contact">Enquire now</a>
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
          <details className="faq-item">
            <summary>How long does a wash take?</summary>
            <p>A complete wash cycle takes around three minutes.</p>
          </details>
          <details className="faq-item">
            <summary>What is the maximum vehicle size?</summary>
            <p>Tank's tiny can wash vehicles up to 6.1 metres long, with a maximum wash height of 2,225 mm.</p>
          </details>
          <details className="faq-item">
            <summary>Does installation require a crane?</summary>
            <p>The compact, lightweight gantry is designed for manual on-site erection without a crane.</p>
          </details>
          <details className="faq-item">
            <summary>What makes the wash contactless?</summary>
            <p>A single arm rotates around the vehicle and delivers high-pressure water and foam through 13 nozzles.</p>
          </details>
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
          <h1 className="product-page-title">Small footprint.<br />A complete wash.</h1>
          <p className="product-page-lede">
            Contactless, automatic 360° washing with high-pressure water and foam—cleaning any car size in around three minutes.
          </p>
          <a className="button button--primary radius-full" href="#contact">Enquire about tiny</a>
        </div>
        <div className="product-page-model" aria-label="Interactive 3D render of Tank's tiny">
          <MachineScene
            assemblyProgress={assemblyProgress}
            storyProgress={storyProgress}
            isVisible
            interactive
          />
          <span className="model-caption">Tank's tiny · 360° single-arm gantry</span>
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
          <img src={tinyImages.find((image) => image.name === '11.png')?.src} alt="Compact Tank's tiny gantry render" loading="lazy" />
          <span className="image-caption">Advanced compact-size gantry</span>
        </div>
        <div className="product-name-copy">
          <p className="kicker">Why the name tiny?</p>
          <h2>The world's smallest single-arm gantry.</h2>
          <p>
            A reduced component count gives Tank's tiny its compact form and lowers the floor space needed for installation.
          </p>
          <p>
            Its lighter structure is designed for manual erection, while a reinforced frame helps manage the dynamic loads of high-pressure washing.
          </p>
        </div>
      </section>

      <section className="product-content-section">
        <div className="product-section-heading">
          <p className="kicker">Salient features</p>
          <h2>Thoughtfully compact.<br />Ready for the wash bay.</h2>
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

      <section className="product-spec-section">
        <div className="product-section-heading">
          <p className="kicker">Technical features</p>
          <h2>Built for dependable operation.</h2>
        </div>
        <ul className="technical-feature-list">
          {technicalFeatures.map((feature) => <li key={feature}>{feature}</li>)}
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
        <div className="control-chips" aria-label="Control and operation features">
          <span>Cycle count mode</span>
          <span>4-inch touch display</span>
          <span>Individual cycle run</span>
          <span>Voltage and trip indicators</span>
          <span>Variable-frequency drive</span>
          <span>Vibrationless operation</span>
        </div>
      </section>

      <section className="product-gallery-section">
        <div className="product-gallery-heading">
          <div>
            <p className="kicker">In detail</p>
            <h2>Tank's tiny from every angle.</h2>
          </div>
          <span>{tinyImages.length} product renders</span>
        </div>
        <ImageCarousel images={tinyImages} label="Tank's tiny product render" className="product-image-carousel" />
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
      <section className="terrain-intro">
        <p className="kicker">Tank's terrain</p>
        <h1>Terrain</h1>
        <span className="terrain-coming-soon">Coming soon</span>
      </section>
      <ImageCarousel
        images={terrainImages}
        label="Tank's Terrain product photos"
        className="terrain-image-carousel"
      />
      <SiteFooter />
    </main>
  );
}

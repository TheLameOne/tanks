import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import featureLengthDetection from '../assets/homepage/web/feature-6.webp';
import featureStabilization from '../assets/homepage/web/feature-7.webp';
import featureReinforced from '../assets/homepage/web/feature-8.webp';
import featureFootprint from '../assets/homepage/web/feature-9.webp';
import featureSimplified from '../assets/homepage/web/feature-10.webp';
import patentTopView from '../assets/homepage/web/patent-top-view.webp';
import HeroSlider from './HeroSlider';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { TerrainProductPage, TinyProductPage } from './ProductPages';
import { companyAddressLines, faqs } from './content';
import { currentPage } from './paths';
import { updateSeoMetadata } from './seo';

const homeFeatures = [
  {
    title: 'Automatic car length detection system.',
    image: featureLengthDetection,
    width: 970,
    height: 994,
    alt: "Line drawing of a car parked beneath the Tank's tiny gantry",
  },
  {
    title: 'A compact gantry with advanced stabilization system on track for vibrationless movement.',
    image: featureStabilization,
    width: 861,
    height: 649,
    alt: "Render of the Tank's gantry carriage with its track stabilization wheels",
  },
  {
    title: 'Heavily reinforced structure designed to withstand high-pressure dynamic loads.',
    image: featureReinforced,
    width: 1112,
    height: 360,
    alt: "Render of the reinforced Tank's tiny gantry frame and name board",
  },
  {
    title: 'Minimal floor coverage, longer washing reach.',
    image: featureFootprint,
    width: 1166,
    height: 1164,
    alt: "Render of the compact Tank's tiny gantry and its extended washing arm",
  },
  {
    title: 'No air compressor required. No detergent pump required. Fewer components. Simplified architecture.',
    image: featureSimplified,
    width: 1600,
    height: 1086,
    alt: "Line drawing of a complete Tank's tiny wash bay with gantry, pump and control panel",
  },
];

function HomePage() {
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setContactStatus('submitting');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result: unknown = await response.json();
      if (
        !response.ok
        || typeof result !== 'object'
        || result === null
        || !('success' in result)
        || result.success !== true
      ) {
        throw new Error('Web3Forms rejected the contact enquiry');
      }

      form.reset();
      setContactStatus('success');
    } catch (error) {
      console.error('Unable to submit contact enquiry:', error);
      setContactStatus('error');
    }
  };

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    document.getElementById(targetId)?.scrollIntoView();
  }, []);

  return (
    <main className="page-shell" id="top">
      <SiteNav page="home" />

      <section className="home-hero" aria-labelledby="home-hero-heading">
        <div className="home-hero__copy">
          <p className="hero-eyebrow"><span />Tank’s company · Machine manufacturer</p>
          <h1 className="home-hero__title" id="home-hero-heading">
            <span>Meet Tank’s</span> <span>tiny.</span>
          </h1>
          <p className="subtitle">Automatic car wash machine</p>
          <div className="hero-specs" aria-label="Tank's tiny at a glance">
            <div className="hero-spec">
              <strong>~3 <span>min</span></strong>
              <span>per wash</span>
            </div>
            <div className="hero-spec">
              <strong>360°</strong>
              <span>washing coverage</span>
            </div>
            <div className="hero-spec">
              <strong>22 <span>bar</span></strong>
              <span>pressure from each of thirteen nozzles</span>
            </div>
          </div>
          <div className="cta-row">
            <a className="hero-primary-link" href="#features">Explore the machine <span aria-hidden="true">↓</span></a>
            <a className="hero-secondary-link" href="#contact">Talk to our team <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <HeroSlider caption="The major evolution in vehicle wash industry" />
      </section>

      <section className="section about-section" id="about" aria-labelledby="about-heading">
        <div className="about-copy">
          <div className="about-heading">
            <p className="kicker">About Tank’s company</p>
            <h2 className="t-h2" id="about-heading">An idea to make everyday life a little easier.</h2>
          </div>
          <div className="about-story">
            <p>
              Tank’s company was founded on a single idea – a vision dedicated to people and driven by
              a strong desire to change the world by making everyday life easier for everyone. We
              manufacture machines for the machines that have become our second homes – our vehicles.
            </p>
            <p>
              As vehicle numbers grow, dust, airborne pollution, road particles, moisture and other
              contaminants settle on the vehicles we rely on everyday. Tank’s company gives those
              intruders a gentle, mechanical nudge away, helping our second homes stay clean and
              attractive. We build automatic vehicle washing machines with advanced technology and a
              commitment to world-class standards.
            </p>
          </div>
        </div>
      </section>

      <section className="home-features" id="features" aria-labelledby="features-heading">
        <h2 className="kicker home-features__label" id="features-heading">Key features</h2>
        {homeFeatures.map((feature, index) => (
          <article className="home-feature" key={feature.title}>
            <div className="home-feature__copy">
              <span className="home-feature__index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{feature.title}</h3>
            </div>
            <figure className="home-feature__media">
              <img
                src={feature.image}
                alt={feature.alt}
                width={feature.width}
                height={feature.height}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </article>
        ))}
      </section>

      <section className="home-patent" aria-labelledby="patent-heading">
        <figure className="home-patent__media">
          <img
            src={patentTopView}
            alt="Top view of the Tank's tiny gantry with its washing arm and cable carrier"
            width={1600}
            height={939}
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="home-patent__copy">
          <h2 className="kicker" id="patent-heading">Intellectual property</h2>
          <dl className="home-patent__list">
            <div>
              <dt>Patent filed</dt>
              <dd>202621084880</dd>
            </div>
            <div>
              <dt>Design registration</dt>
              <dd>508904-001</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section faq-section" id="faq" aria-labelledby="faq-heading">
        <div className="faq-shell">
          <div className="faq-intro">
            <p className="kicker">Good to know.</p>
            <h2 className="t-h2" id="faq-heading">Frequently asked questions.</h2>
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

      <section className="section contact-section" id="contact">
        <div className="contact-shell">
          <div className="contact-copy">
            <p className="kicker">Plan your wash bay</p>
            <h2 className="t-h2">Find the right wash solution for your <em>site</em>.</h2>
            <p className="contact-intro">
              Tell us about your location and vehicle-washing needs. We'll help you explore the right
              Tank's automatic wash setup for your site.
            </p>
            <p className="contact-intro contact-email">
              Prefer email? <a href="mailto:connect@tankscompany.com">connect@tankscompany.com</a>
            </p>
            <div className="contact-address">
              <span>Visit us</span>
              <address>
                Tank’s company
                {companyAddressLines.map((line) => <span key={line}>{line}</span>)}
              </address>
            </div>
          </div>
          <form
            className="contact-card"
            onSubmit={handleContactSubmit}
            aria-busy={contactStatus === 'submitting'}
          >
            <input type="hidden" name="access_key" value="9feaac2f-4447-4df3-b749-48798847a915" />
            <div className="form-row"><label htmlFor="enquiry-name">Full name *</label><input id="enquiry-name" name="name" type="text" autoComplete="name" placeholder="Your name" required /></div>
            <div className="form-row"><label htmlFor="enquiry-email">Email address *</label><input id="enquiry-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></div>
            <div className="form-row form-row--message"><label htmlFor="enquiry-message">Your message *</label><textarea id="enquiry-message" name="message" placeholder="Tell us about your site, requirements, and plans..." rows={4} required></textarea></div>
            <div className="action-row">
              <button
                type="submit"
                className="button button--primary contact-submit"
                disabled={contactStatus === 'submitting'}
              >
                {contactStatus === 'submitting' ? 'Sending...' : 'Send enquiry'}
                <span aria-hidden="true">↗</span>
              </button>
            </div>
            {contactStatus === 'success' && (
              <p className="contact-status" role="status">Thanks for reaching out. We'll be in touch soon.</p>
            )}
            {contactStatus === 'error' && (
              <p className="contact-status" role="alert">We couldn't send your enquiry. Please try again.</p>
            )}
          </form>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export default function App() {
  const page = currentPage();
  useEffect(() => {
    updateSeoMetadata(page);
  }, [page]);

  if (page === 'tiny') return <TinyProductPage />;
  if (page === 'terrain') return <TerrainProductPage />;
  return <HomePage />;
}

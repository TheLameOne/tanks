import { Fragment, useEffect, useRef, useState } from 'react';
import MachineScene from './MachineScene';
import LightRays from './LightRaysBackground';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { TerrainProductPage, TinyProductPage } from './ProductPages';
import { storySteps } from './content';

function StoryHeading({ activeIndex }: { activeIndex: number }) {
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (activeIndex === displayIndex) return;

    setIsExiting(true);
    const timeout = window.setTimeout(() => {
      setDisplayIndex(activeIndex);
      setIsExiting(false);
    }, 240);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, displayIndex]);

  const step = storySteps[displayIndex];
  let characterIndex = 0;

  return (
    <h2
      className={`product-heading ${isExiting ? 'is-exiting' : ''}`}
      key={step.index}
      aria-label={step.title}
    >
      {step.title.split(' ').map((word, wordIndex, words) => (
        <Fragment key={`${step.index}-${wordIndex}`}>
          <span className="product-heading__word" aria-hidden="true">
            {Array.from(word).map((character) => {
              const delay = characterIndex * 6;
              characterIndex += 1;
              return (
                <span
                  className="product-heading__character"
                  key={`${step.index}-${characterIndex}`}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {character}
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h2>
  );
}

function HomePage() {
  const experienceRef = useRef<HTMLElement | null>(null);
  const storySectionRef = useRef<HTMLElement | null>(null);
  const aboutSectionRef = useRef<HTMLElement | null>(null);
  const [activeStory, setActiveStory] = useState(0);
  const [sceneVisible, setSceneVisible] = useState(true);
  const assemblyProgress = useRef(1);
  const storyProgress = useRef(0);
  const heroProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight || 1;
      const experienceRect = experienceRef.current?.getBoundingClientRect();
      const aboutRect = aboutSectionRef.current?.getBoundingClientRect();
      const isTourVisible = experienceRect
        ? experienceRect.bottom > 0
          && experienceRect.top < viewportHeight
          && (!aboutRect || aboutRect.top > viewportHeight * 0.85)
        : false;
      setSceneVisible(isTourVisible);

      const storyRect = storySectionRef.current?.getBoundingClientRect();
      if (!storyRect) return;

      heroProgress.current = Math.min(
        1,
        Math.max(0, 1 - storyRect.top / viewportHeight),
      );
      const progress = Math.min(1, Math.max(0, -storyRect.top / Math.max(storyRect.height, 1)));
      storyProgress.current = progress;
      const nextIndex = Math.min(storySteps.length - 1, Math.floor(progress * storySteps.length));
      setActiveStory((current) => current === nextIndex ? current : nextIndex);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <main className="page-shell" id="top">
      <SiteNav page="home" />

      <section className="assembly-experience" ref={experienceRef}>
        <div className="assembly-stage" aria-hidden="true">
          <LightRays
            active
            raysOrigin="top-center"
            raysColor="#b57950"
            raysSpeed={0.12}
            lightSpread={0.82}
            rayLength={1.6}
            intensity={0.8}
            opacity={0.85}
          />
          <MachineScene
            assemblyProgress={assemblyProgress}
            storyProgress={storyProgress}
            heroProgress={heroProgress}
            isVisible={sceneVisible}
            alignRight
          />
        </div>
        <div className="hero section">
          <div className="hero__copy">
            <p className="hero-eyebrow"><span />Automatic vehicle care, rethought</p>
            <h1 className="display-xl">
              <span>Meet Tank's</span>
              <span>tiny.</span>
            </h1>
            <p className="subtitle">
              A compact, contactless 360° gantry wash that cleans consistently in around three minutes.
            </p>
            <div className="hero-specs" aria-label="Tank's tiny at a glance">
              <div className="hero-spec">
                <strong>~3 <span>min</span></strong>
                <span>per wash</span>
              </div>
              <div className="hero-spec">
                <strong>360°</strong>
                <span>contactless wash</span>
              </div>
              <div className="hero-spec">
                <strong>6.1 <span>m</span></strong>
                <span>maximum vehicle length</span>
              </div>
            </div>
            <div className="cta-row">
              <a className="hero-primary-link" href="#product">Explore the machine <span aria-hidden="true">↓</span></a>
              <a className="hero-secondary-link" href="#contact">Talk to our team <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="assembly-hint desktop-scroll-cue" aria-hidden="true">
            <span className="assembly-hint-line" />
            Scroll to explore
            <span className="assembly-hint-arrow">↓</span>
          </div>
        </div>
        <div className="mobile-scroll-cue" aria-hidden="true">
          <span className="assembly-hint-line" />
          <span>Scroll to explore</span>
          <span className="assembly-hint-arrow">↓</span>
        </div>

        <section
          className={`product-story${sceneVisible ? '' : ' is-complete'}`}
          id="product"
          ref={storySectionRef}
          aria-label="Explore the machine"
        >
          <div className="product-overlay" aria-live="polite">
            <StoryHeading activeIndex={activeStory} />
          </div>
          {storySteps.map((step) => (
            <article className="product-beat" key={step.index} aria-hidden="true" />
          ))}
        </section>
      </section>

      <section className="section about-section" id="about" ref={aboutSectionRef} aria-labelledby="about-heading">
        <div className="about-copy">
          <div className="about-heading">
            <p className="kicker">About Tank's</p>
            <h2 className="t-h2" id="about-heading">An idea to make everyday life a little easier.</h2>
          </div>
          <div className="about-story">
            <p>
              Tank's was founded with one idea: to create thoughtful machines that make life easier
              for people and the communities around them. We manufacture machines for the machines
              that have become our second homes—our vehicles.
            </p>
            <p>
              As vehicle numbers grow, dust, airborne pollution, road particles, moisture, bird
              droppings and other contaminants settle on the vehicles we rely on every day. Tank's
              gives those intruders a gentle, mechanical nudge away, helping vehicles stay clean and
              attractive.
            </p>
            <p>
              We build automatic vehicle-washing machines with advanced technology and a commitment
              to world-class standards.
            </p>
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq" aria-labelledby="faq-heading">
        <div className="faq-shell">
          <div className="faq-intro">
            <p className="kicker">Good to know.</p>
            <h2 className="t-h2" id="faq-heading">Frequently asked questions.</h2>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary>How long does a wash take?</summary>
              <p>A complete wash cycle takes around three minutes.</p>
            </details>
            <details className="faq-item">
              <summary>Does installation require a crane?</summary>
              <p>The lightweight gantry is designed for manual on-site erection, so installation does not require a crane.</p>
            </details>
            <details className="faq-item">
              <summary>What vehicles can the machine wash?</summary>
              <p>The system accommodates vehicles up to 6.1 metres long, with a 2,225 mm wash height and 6,922 mm wash length.</p>
            </details>
            <details className="faq-item">
              <summary>How does the machine cover the vehicle?</summary>
              <p>A single rotating arm with 13 nozzles provides 360° water and foam coverage at up to 22 bar.</p>
            </details>
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
          </div>
          <div className="contact-card">
            <div className="form-row"><label htmlFor="enquiry-name">Full name *</label><input id="enquiry-name" type="text" placeholder="Your name" /></div>
            <div className="form-row"><label htmlFor="enquiry-email">Email address *</label><input id="enquiry-email" type="email" placeholder="you@example.com" /></div>
            <div className="form-row form-row--message"><label htmlFor="enquiry-message">Your message *</label><textarea id="enquiry-message" placeholder="Tell us about your site, requirements, and plans..." rows={4}></textarea></div>
            <div className="action-row">
              <button className="button button--primary contact-submit">Send enquiry <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/tiny') return <TinyProductPage />;
  if (path === '/terrain') return <TerrainProductPage />;
  return <HomePage />;
}

import logoUrl from '../assets/logo.svg';
import { homeHash, pagePath } from './paths';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <section className="footer-cta" aria-labelledby="footer-cta-heading">
        <h2 id="footer-cta-heading">Ready to make vehicle care <em>easier?</em></h2>
        <p>Let’s talk about a smarter wash solution for your site.</p>
        <a className="footer-cta-button" href={homeHash('contact')}>Start a conversation</a>
      </section>
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <div className="site-footer-about">
            <a className="site-footer-brand" href={pagePath()} aria-label="Tank's home">
              <img src={logoUrl} alt="Tank's" />
            </a>
            <p>
              We build automatic vehicle-washing machines with thoughtful design, advanced
              technology and a commitment to world-class standards.
            </p>
          </div>
          <nav className="site-footer-links" aria-label="Products">
            <h3>Products</h3>
            <a href={pagePath('tiny')}>Tiny</a>
            <a href={pagePath('terrain')}>Terrain</a>
          </nav>
          <nav className="site-footer-links" aria-label="Company">
            <h3>Company</h3>
            <a href={homeHash('about')}>About us</a>
            <a href={homeHash('faq')}>FAQ</a>
          </nav>
          <nav className="site-footer-links" aria-label="Connect">
            <h3>Connect</h3>
            <a href={homeHash('contact')}>Contact us</a>
            <a href="mailto:connect@tankscompany.com">connect@tankscompany.com</a>
          </nav>
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} Tank's. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

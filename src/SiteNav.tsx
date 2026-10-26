import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import logoUrl from '../assets/logo.svg';

type SiteNavProps = {
  page: 'home' | 'tiny' | 'terrain';
};

const base = import.meta.env.BASE_URL;

export default function SiteNav({ page }: SiteNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contactHref = page === 'terrain' ? `${base}#contact` : `#contact`;
  const faqHref = page === 'terrain' ? `${base}#faq` : `#faq`;
  const aboutHref = page === 'home' ? `#about` : `${base}#about`;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <button
          className="nav-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}
      <header className={`nav-pill ${isOpen ? 'is-open' : ''}`}>
        <a className="brand-link" href="/" aria-label="Tank's home" onClick={closeMenu}>
          <img className="brand-logo" src={logoUrl} alt="Tank's" />
        </a>
        <div className="nav-content" id="primary-navigation">
          <nav className="nav-links" aria-label="Main navigation">
            <span className="nav-section-label">Machines</span>
            <a href="/tiny" aria-current={page === 'tiny' ? 'page' : undefined} onClick={closeMenu}>
              <span className="nav-link-label">tiny</span>
              <span className="nav-link-title-mobile">Tank's Tiny</span>
              <span className="nav-link-tag">360° wash</span>
            </a>
            <a href="/terrain" aria-current={page === 'terrain' ? 'page' : undefined} onClick={closeMenu}>
              <span className="nav-link-label">terrain</span>
              <span className="nav-link-title-mobile">Tank's Terrain</span>
              <span className="nav-link-tag">All-terrain</span>
            </a>
            <span className="nav-divider" aria-hidden="true" />
            <span className="nav-section-label nav-section-label--secondary">Explore</span>
            <a href={aboutHref} onClick={closeMenu}>About us</a>
            <a href={faqHref} onClick={closeMenu}>FAQ</a>
            <a href={contactHref} onClick={closeMenu}>Contact</a>
          </nav>
          <a
            className="button button--primary radius-full nav-cta"
            href={contactHref}
            onClick={closeMenu}
          >
            Enquire now <span aria-hidden="true">→</span>
          </a>
        </div>
        <button
          className="nav-menu-toggle"
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>
    </>
  );
}

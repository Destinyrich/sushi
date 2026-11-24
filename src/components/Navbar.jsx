'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

// Pages whose top edge is dark (hero image / dark banner) keep light nav text until scrolled.
const DARK_TOP = new Set(['/', '/services', '/book']);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() ?? '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const darkText = scrolled || !DARK_TOP.has(pathname);
  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <style>{`
        .nav-link {
          font-size: 11px;
          letter-spacing: 0.22em;
          font-weight: 300;
          transition: color 0.25s;
          padding-bottom: 3px;
          position: relative;
          text-decoration: none;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--gold);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after,
        .nav-link.active::after { width: 100%; }

        .book-btn {
          font-size: 11px;
          letter-spacing: 0.25em;
          padding: 10px 24px;
          background: var(--gold);
          color: #0a0a0a !important;
          font-weight: 400;
          transition: background 0.25s, transform 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .book-btn:hover { background: #b8934a; transform: translateY(-1px); }

        /* Hamburger lines */
        .ham-line {
          display: block;
          width: 24px;
          height: 1.5px;
          background: currentColor;
          transition: transform 0.35s ease, opacity 0.25s ease, width 0.3s ease;
          transform-origin: center;
        }

        /* Mobile overlay menu */
        .mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 90;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        .mobile-link {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 9vw, 60px);
          font-weight: 300;
          font-style: italic;
          color: #faf8f5;
          text-decoration: none;
          letter-spacing: 0.04em;
          line-height: 1.3;
          padding: 10px 0;
          transition: color 0.25s, transform 0.25s;
          display: block;
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
        }
        .mobile-menu.open .mobile-link {
          opacity: 1;
          transform: translateY(0);
        }
        .mobile-link:hover { color: var(--gold); }
        .mobile-book-link {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.35em;
          color: var(--gold) !important;
          margin-top: 20px;
          border-bottom: 1px solid var(--gold);
          padding-bottom: 3px;
        }

        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      {/* ── Navbar bar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '14px 48px' : '24px 48px',
        background: menuOpen
          ? '#0a0a0a'
          : scrolled
            ? 'rgba(250,248,245,0.97)'
            : 'transparent',
        backdropFilter: scrolled && !menuOpen ? 'blur(16px)' : 'none',
        borderBottom: scrolled && !menuOpen
          ? '1px solid rgba(201,169,110,0.18)'
          : menuOpen
            ? '1px solid rgba(201,169,110,0.12)'
            : 'none',
        transition: 'padding 0.4s ease, background 0.4s ease, border 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', zIndex: 110, flexShrink: 0 }}>
          <div style={{ lineHeight: 1 }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '22px', fontWeight: 300, letterSpacing: '0.14em',
              color: menuOpen ? '#faf8f5' : darkText ? '#0a0a0a' : '#faf8f5',
              transition: 'color 0.3s',
            }}>SUSHI</div>
            <div style={{
              fontSize: '9px', letterSpacing: '0.42em',
              color: 'var(--gold)', marginTop: '1px',
            }}>PHOTOGRAPHY</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="desktop-links" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              style={{ color: darkText ? '#0a0a0a' : '#faf8f5' }}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
          <Link href="/book" className="book-btn">BOOK NOW</Link>
        </div>

        {/* Hamburger button */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          style={{
            display: 'none', flexDirection: 'column', gap: '5px',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', zIndex: 110,
            color: menuOpen ? '#faf8f5' : darkText ? '#0a0a0a' : '#faf8f5',
          }}
        >
          <span className="ham-line" style={{
            transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
          }} />
          <span className="ham-line" style={{
            opacity: menuOpen ? 0 : 1,
            width: menuOpen ? '0' : '24px',
          }} />
          <span className="ham-line" style={{
            transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </nav>

      {/* ── Mobile fullscreen menu ── */}
      <div
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        style={{
          background: '#0a0a0a',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Decorative gold line */}
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, transparent, var(--gold))', marginBottom: '32px' }} />

        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className="mobile-link"
            style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/book"
          className="mobile-link mobile-book-link"
          style={{ transitionDelay: menuOpen ? `${links.length * 60}ms` : '0ms' }}
        >
          BOOK A SESSION
        </Link>

        {/* Bottom info */}
        <div style={{
          position: 'absolute', bottom: '40px', left: 0, right: 0,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(250,248,245,0.3)' }}>
            LAGOS · NIGERIA
          </div>
        </div>
      </div>
    </>
  );
}

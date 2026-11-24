import Link from 'next/link';

const NAV_LINKS = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/book', label: 'Book Now' },
  { href: '/contact', label: 'Contact' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', icon: 'IG' },
  { label: 'Facebook', href: '#', icon: 'FB' },
  { label: 'WhatsApp', href: '#', icon: 'WA' },
];

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-link {
          font-size: 11px;
          letter-spacing: 0.22em;
          color: rgba(250,248,245,0.45);
          text-decoration: none;
          transition: color 0.25s;
          display: inline-block;
        }
        .footer-link:hover { color: var(--gold); }

        .social-dot {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(201,169,110,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          letter-spacing: 0.05em;
          color: rgba(250,248,245,0.4);
          text-decoration: none;
          transition: border-color 0.25s, color 0.25s, background 0.25s;
        }
        .social-dot:hover {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(201,169,110,0.07);
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,169,110,0.25), transparent);
          margin: 0 0 48px;
        }

        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; text-align: center; gap: 40px !important; }
          .footer-links-row { justify-content: center !important; flex-wrap: wrap !important; gap: 20px !important; }
          .social-row { justify-content: center !important; }
          .footer-bottom { flex-direction: column !important; align-items: center !important; gap: 12px !important; text-align: center; }
          .footer-brand { align-items: center !important; }
        }
        @media (max-width: 480px) {
          .footer-root { padding: 56px 24px 36px !important; }
        }
      `}</style>

      <footer className="footer-root" style={{
        background: '#0a0a0a',
        padding: '80px 48px 40px',
        borderTop: '1px solid rgba(201,169,110,0.12)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Top grid */}
          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr',
            gap: '64px',
            marginBottom: '64px',
          }}>

            {/* Brand column */}
            <div className="footer-brand" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '28px', fontWeight: 300,
                  color: '#faf8f5', letterSpacing: '0.1em',
                  lineHeight: 1,
                }}>SUSHI</div>
                <div style={{
                  fontSize: '9px', letterSpacing: '0.45em',
                  color: 'var(--gold)', marginTop: '3px',
                }}>PHOTOGRAPHY</div>
              </div>
              <p style={{
                fontSize: '13px', lineHeight: '1.85',
                color: 'rgba(250,248,245,0.4)',
                maxWidth: '280px', letterSpacing: '0.03em',
              }}>
                Capturing life's most precious moments with artistry and intention.
                Based in Lagos, Nigeria.
              </p>
              {/* Social icons */}
              <div className="social-row" style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                {SOCIAL_LINKS.map(s => (
                  <a key={s.label} href={s.href} className="social-dot" aria-label={s.label}>{s.icon}</a>
                ))}
              </div>
            </div>

            {/* Navigation column */}
            <div>
              <div style={{
                fontSize: '10px', letterSpacing: '0.38em',
                color: 'var(--gold)', marginBottom: '24px', fontWeight: 400,
              }}>NAVIGATE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[{ href: '/', label: 'Home' }, ...NAV_LINKS].map(link => (
                  <Link key={link.href} href={link.href} className="footer-link">
                    {link.label.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact column */}
            <div>
              <div style={{
                fontSize: '10px', letterSpacing: '0.38em',
                color: 'var(--gold)', marginBottom: '24px', fontWeight: 400,
              }}>GET IN TOUCH</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: '✉', value: 'lucky@sushiphotography.ng' },
                  { icon: '✆', value: '+234 800 SUSHI PHOTO' },
                  { icon: '◎', value: 'Lagos, Nigeria' },
                ].map(({ icon, value }) => (
                  <div key={value} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--gold)', marginTop: '1px', flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(250,248,245,0.5)', letterSpacing: '0.04em', lineHeight: 1.5 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Book CTA */}
              <Link href="/book" className="cta-gold" style={{
                display: 'inline-block', marginTop: '32px',
                padding: '12px 28px',
                background: 'var(--gold)', color: '#0a0a0a',
                fontSize: '11px', letterSpacing: '0.28em',
                fontWeight: 400, textDecoration: 'none',
              }}>
                BOOK NOW
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider" />

          {/* Bottom bar */}
          <div className="footer-bottom" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(250,248,245,0.25)', letterSpacing: '0.08em' }}>
              © {new Date().getFullYear()} Sushi Photography · Lucky Titity. All rights reserved.
            </div>
            <div className="footer-links-row" style={{ display: 'flex', gap: '28px' }}>
              {['Privacy Policy', 'Terms of Service'].map(label => (
                <a key={label} href="#" className="footer-link" style={{ fontSize: '10px', color: 'rgba(250,248,245,0.2)' }}>
                  {label.toUpperCase()}
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

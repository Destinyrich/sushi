import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import { listGallerySpots, listHeroSlides, listServices, listTestimonials } from '@/lib/queries';
import { formatNaira } from '@/lib/format';

export const dynamic = 'force-dynamic';

const FALLBACK_HERO = [
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1600&q=80',
];

const FALLBACK_GALLERY = [
  { id: 1, src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80', span: 'tall' },
  { id: 2, src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80', span: 'normal' },
  { id: 3, src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', span: 'normal' },
  { id: 4, src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', span: 'wide' },
  { id: 5, src: 'https://images.unsplash.com/photo-1620682595039-d8af4dbf5439?w=800&q=80', span: 'normal' },
  { id: 6, src: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=800&q=80', span: 'tall' },
];

export default async function Home() {
  const [heroRows, spotRows, services, testimonials] = await Promise.all([
    listHeroSlides(),
    listGallerySpots(),
    listServices(),
    listTestimonials({ featured: true }),
  ]);

  // Use DB content when present, otherwise the demo imagery.
  const slides = heroRows.length
    ? heroRows.map(s => ({ src: s.image, caption: s.caption }))
    : FALLBACK_HERO.map(src => ({ src, caption: '' }));

  const gallery = spotRows.length
    ? spotRows.map(s => ({ id: s.id, src: s.image, span: s.span, title: s.title }))
    : FALLBACK_GALLERY;

  return (
    <div>
      <HeroSlider slides={slides} />

      {/* ── Intro ── */}
      <section style={{ padding: '120px 48px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '24px' }}>ABOUT LUCKY</p>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.1, marginBottom: '32px', color: '#0a0a0a' }}>
          Documenting life&apos;s most<br /><em style={{ fontStyle: 'italic' }}>precious moments</em>
        </h2>
        <p style={{ fontSize: '14px', letterSpacing: '0.05em', lineHeight: '1.9', color: 'var(--muted)', maxWidth: '560px', margin: '0 auto 48px' }}>
          Based in Lagos, Lucky Titity is a visual storyteller with a passion for capturing the raw emotion and timeless beauty of every occasion — from intimate weddings to grand celebrations.
        </p>
        <Link href="/portfolio" style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--ink)', borderBottom: '1px solid var(--gold)', paddingBottom: '3px' }}>EXPLORE THE WORK</Link>
      </section>

      {/* ── Gallery Grid ── */}
      <section style={{ padding: '0 48px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 320px)', gap: '12px', maxWidth: '1200px', margin: '0 auto' }}>
          {gallery.slice(0, 6).map((img) => (
            <div key={img.id} className="zoom" style={{
              overflow: 'hidden',
              gridRow: img.span === 'tall' ? 'span 2' : undefined,
              gridColumn: img.span === 'wide' ? 'span 2' : undefined,
            }}>
              <img src={img.src} alt={img.title || ''} style={{ height: '100%', width: '100%', objectFit: 'cover', cursor: 'pointer' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section style={{ padding: '100px 48px', background: 'var(--ink)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '16px' }}>WHAT WE OFFER</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, color: '#faf8f5' }}>Photography <em style={{ fontStyle: 'italic' }}>Services</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px' }}>
            {services.map(service => (
              <div key={service.id} className="tile" style={{ padding: '48px 36px', borderBottom: '1px solid rgba(201,169,110,0.1)', position: 'relative', overflow: 'hidden' }}>
                {service.cover_image && (
                  <div className="zoom" style={{ height: '180px', overflow: 'hidden', margin: '-48px -36px 24px' }}>
                    <img src={service.cover_image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '16px' }}>{formatNaira(service.price_from)}+</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: '#faf8f5', marginBottom: '12px' }}>{service.name}</h3>
                <p style={{ fontSize: '12px', color: 'rgba(250,248,245,0.4)', letterSpacing: '0.1em' }}>{service.duration}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/services" style={{ padding: '14px 48px', border: '1px solid rgba(201,169,110,0.5)', color: 'var(--gold)', fontSize: '11px', letterSpacing: '0.25em' }}>VIEW ALL SERVICES</Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section style={{ padding: '120px 48px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '72px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '16px' }}>KIND WORDS</p>
              <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300 }}>Client <em style={{ fontStyle: 'italic' }}>Stories</em></h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
              {testimonials.map(t => (
                <div key={t.id} style={{ padding: '40px', background: '#fff', borderTop: '2px solid var(--gold)' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                    {Array.from({ length: t.rating }, (_, i) => <span key={i} style={{ color: 'var(--gold)', fontSize: '14px' }}>★</span>)}
                  </div>
                  <p style={{ lineHeight: 1.8, color: 'var(--muted)', fontStyle: 'italic', marginBottom: '28px', fontFamily: 'Cormorant Garamond, serif', fontSize: '18px' }}>&ldquo;{t.message}&rdquo;</p>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 400, letterSpacing: '0.1em' }}>{t.client_name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.2em', marginTop: '4px' }}>{t.event_type.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding: '120px 48px', background: 'var(--bone)', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '24px' }}>YOUR STORY AWAITS</p>
        <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300, marginBottom: '20px' }}>
          Let&apos;s create something<br /><em style={{ fontStyle: 'italic' }}>beautiful together</em>
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '400px', margin: '0 auto 52px', lineHeight: 1.8 }}>Every love story, every celebration deserves to be told with beauty and intention.</p>
        <Link href="/book" style={{ padding: '18px 64px', background: 'var(--ink)', color: '#faf8f5', fontSize: '11px', letterSpacing: '0.3em', display: 'inline-block' }}>BEGIN YOUR JOURNEY</Link>
      </section>
    </div>
  );
}

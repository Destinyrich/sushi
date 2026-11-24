import Link from 'next/link';
import { listServices } from '@/lib/queries';
import { formatNaira } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Services' };

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
];

export default async function Services() {
  const services = await listServices();
  const getCoverImage = (service, index) => service.cover_image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '180px 48px 100px', background: 'var(--ink)' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '20px' }}>WHAT WE OFFER</p>
        <h1 style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 300, color: '#faf8f5' }}>
          Our <em style={{ fontStyle: 'italic' }}>Services</em>
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(250,248,245,0.5)', maxWidth: '480px', margin: '24px auto 0', lineHeight: 1.8 }}>
          Each package is crafted to capture the essence of your most meaningful moments.
        </p>
      </div>

      <div style={{ padding: '80px 48px', maxWidth: '1100px', margin: '0 auto' }}>
        {services.map((service, i) => (
          <div key={service.id} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
            padding: '80px 0',
            borderBottom: i < services.length - 1 ? '1px solid rgba(10,10,10,0.1)' : 'none',
          }}>
            {/* Text */}
            <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '20px' }}>0{i + 1}</p>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 300, marginBottom: '20px', lineHeight: 1.1 }}>
                {service.name}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '32px' }}>
                {service.description}
              </p>

              {/* Inclusions */}
              {service.includes && (
                <div style={{ marginBottom: '36px' }}>
                  {service.includes.split(',').map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: 'var(--muted)', letterSpacing: '0.05em' }}>{item.trim()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price + duration */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: '4px' }}>STARTING FROM</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: 'var(--gold)' }}>
                    {formatNaira(service.price_from)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: '4px' }}>DURATION</div>
                  <div style={{ fontSize: '14px' }}>{service.duration}</div>
                </div>
              </div>

              <Link href="/book" style={{
                display: 'inline-block', marginTop: '36px',
                padding: '14px 40px', background: 'var(--ink)',
                color: '#faf8f5', fontSize: '11px', letterSpacing: '0.25em',
                textDecoration: 'none',
              }}>BOOK NOW</Link>
            </div>

            {/* Image */}
            <div className="zoom-soft" style={{ order: i % 2 === 0 ? 1 : 0, aspectRatio: '4/5', overflow: 'hidden' }}>
              <img
                src={getCoverImage(service, i)}
                alt={service.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)', fontSize: '14px' }}>
            No services available yet.
          </div>
        )}
      </div>
    </div>
  );
}

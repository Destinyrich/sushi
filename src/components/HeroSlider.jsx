'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSlider({ slides }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {slides.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${s.src})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === idx ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
        <p style={{ fontFamily: 'Josefin Sans', fontSize: '11px', letterSpacing: '0.4em', color: 'var(--gold)', marginBottom: '24px' }}>LAGOS · NIGERIA</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(52px, 10vw, 110px)', fontWeight: 300, color: '#faf8f5', lineHeight: 0.9, marginBottom: '12px' }}>
          Lucky<br /><em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>Titity</em>
        </h1>
        <p style={{ fontFamily: 'Josefin Sans', fontSize: '11px', letterSpacing: '0.5em', color: 'rgba(250,248,245,0.7)', marginBottom: '52px' }}>SUSHI PHOTOGRAPHY</p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/portfolio" style={{ padding: '14px 40px', border: '1px solid rgba(250,248,245,0.6)', color: '#faf8f5', fontSize: '11px', letterSpacing: '0.25em' }}>VIEW PORTFOLIO</Link>
          <Link href="/book" style={{ padding: '14px 40px', background: 'var(--gold)', color: '#0a0a0a', fontSize: '11px', letterSpacing: '0.25em', fontWeight: 400 }}>BOOK A SESSION</Link>
        </div>
      </div>
      {/* Slide dots */}
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
        {slides.map((_, i) => (
          <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setIdx(i)} style={{ width: i === idx ? '24px' : '6px', height: '6px', borderRadius: '3px', background: i === idx ? 'var(--gold)' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
      {slides[idx]?.caption && (
        <div style={{ position: 'absolute', bottom: '70px', right: '48px', fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(250,248,245,0.5)' }}>
          {slides[idx].caption}
        </div>
      )}
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function PortfolioGallery({ photos, tabs }) {
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = active === 'All' ? photos : photos.filter(p => p.category_name === active);
  const idx = selected ? filtered.findIndex(p => p.id === selected.id) : -1;

  // Keyboard controls for the lightbox
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(null);
      if (e.key === 'ArrowLeft' && idx > 0) setSelected(filtered[idx - 1]);
      if (e.key === 'ArrowRight' && idx < filtered.length - 1) setSelected(filtered[idx + 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, idx, filtered]);

  return (
    <>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginBottom: '64px', flexWrap: 'wrap', padding: '0 48px' }}>
        {['All', ...tabs].map(tab => (
          <button key={tab} onClick={() => setActive(tab)} style={{
            fontSize: '11px', letterSpacing: '0.25em',
            color: active === tab ? 'var(--ink)' : 'var(--muted)',
            paddingBottom: '4px', transition: 'all 0.2s', background: 'none', border: 'none',
            borderBottom: active === tab ? '1px solid var(--gold)' : '1px solid transparent',
            cursor: 'pointer',
          }}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div style={{ padding: '0 48px 120px', columns: '4 280px', gap: '12px', maxWidth: '1400px', margin: '0 auto' }}>
        {filtered.map(photo => (
          <div key={photo.id} className="photo-card zoom" onClick={() => setSelected(photo)}
            style={{ breakInside: 'avoid', marginBottom: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
            <img src={photo.image} alt={photo.title} loading="lazy" style={{ display: 'block', width: '100%' }} />
            <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.45)', display: 'flex', alignItems: 'flex-end', padding: '20px' }}>
              <div>
                <div style={{ fontSize: '16px', fontFamily: 'Cormorant Garamond, serif', color: '#faf8f5', fontWeight: 300 }}>{photo.title}</div>
                {photo.category_name && (
                  <div style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold-light)', marginTop: '4px' }}>{photo.category_name.toUpperCase()}</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px', letterSpacing: '0.15em' }}>
            No photos in this category yet.
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.96)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px',
        }}>
          <button onClick={() => setSelected(null)} aria-label="Close"
            style={{ position: 'fixed', top: '32px', right: '48px', color: '#faf8f5', fontSize: '32px', opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>×</button>

          {idx > 0 && (
            <button onClick={e => { e.stopPropagation(); setSelected(filtered[idx - 1]); }} aria-label="Previous"
              style={{ position: 'fixed', left: '32px', top: '50%', transform: 'translateY(-50%)', color: '#faf8f5', fontSize: '28px', opacity: 0.5, background: 'none', border: 'none', cursor: 'pointer' }}>‹</button>
          )}
          {idx < filtered.length - 1 && (
            <button onClick={e => { e.stopPropagation(); setSelected(filtered[idx + 1]); }} aria-label="Next"
              style={{ position: 'fixed', right: '32px', top: '50%', transform: 'translateY(-50%)', color: '#faf8f5', fontSize: '28px', opacity: 0.5, background: 'none', border: 'none', cursor: 'pointer' }}>›</button>
          )}

          <img src={selected.image} alt={selected.title}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', width: 'auto' }}
            onClick={e => e.stopPropagation()} />
          <div style={{ position: 'fixed', bottom: '40px', textAlign: 'center', color: '#faf8f5', left: 0, right: 0 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 300 }}>{selected.title}</div>
            {selected.category_name && (
              <div style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold)', marginTop: '6px' }}>{selected.category_name.toUpperCase()}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

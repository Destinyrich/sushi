'use client';

import { useState, useEffect, useRef } from 'react';
import { portfolioAPI } from '@/lib/api-client';
import toast from 'react-hot-toast';

const imgSrc = (url) => url || null;

function UploadZone({ onFile, label }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  return (
    <div
      onClick={() => ref.current.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
      style={{
        border: `1px dashed ${drag ? 'var(--gold)' : 'rgba(201,169,110,0.3)'}`,
        borderRadius: '2px', padding: '32px 20px', textAlign: 'center',
        cursor: 'pointer', background: drag ? 'rgba(201,169,110,0.05)' : 'transparent',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '10px', opacity: 0.4 }}>↑</div>
      <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(250,248,245,0.4)' }}>
        {label || 'DROP IMAGE OR CLICK TO BROWSE'}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => onFile(e.target.files[0])} />
    </div>
  );
}

// ── Hero Slides Section ──────────────────────────────────────────────────────
function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  const load = () => portfolioAPI.getAdminHeroSlides().then(setSlides).catch(err => toast.error(err.message));
  useEffect(() => { load(); }, []);

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleAdd = async () => {
    if (!file) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('caption', caption);
      fd.append('order', order);
      fd.append('is_active', true);
      await portfolioAPI.createHeroSlide(fd);
      toast.success('Hero slide added!');
      setFile(null); setCaption(''); setOrder(0); setPreview(null);
      load();
    } catch (err) { toast.error(err.message || 'Failed to upload'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (slide) => {
    try {
      await portfolioAPI.updateHeroSlide(slide.id, { is_active: !slide.is_active });
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this slide?')) return;
    try {
      await portfolioAPI.deleteHeroSlide(id);
      toast.success('Deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleReorder = async (slide, newOrder) => {
    if (String(newOrder) === String(slide.order)) return;
    try {
      await portfolioAPI.updateHeroSlide(slide.id, { order: newOrder });
      load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div style={{ marginBottom: '64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(201,169,110,0.15)' }} />
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 300, whiteSpace: 'nowrap' }}>
          Hero Slideshow
        </h2>
        <div style={{ flex: 1, height: '1px', background: 'rgba(201,169,110,0.15)' }} />
      </div>
      <p style={{ fontSize: '12px', color: 'rgba(250,248,245,0.4)', marginBottom: '28px', letterSpacing: '0.05em' }}>
        These images appear in the full-screen homepage hero. Add multiple slides — they auto-rotate every 5 seconds.
      </p>

      {/* Current slides */}
      {slides.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {slides.map(slide => (
            <div key={slide.id} style={{ position: 'relative', background: '#161616', border: `1px solid ${slide.is_active ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.05)'}`, overflow: 'hidden' }}>
              <div style={{ height: '130px', overflow: 'hidden' }}>
                <img src={imgSrc(slide.image)} alt={slide.caption || 'Slide'} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: slide.is_active ? 1 : 0.4 }} />
              </div>
              <div style={{ padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: slide.is_active ? '#10b981' : 'rgba(250,248,245,0.3)' }}>
                    {slide.is_active ? 'ACTIVE' : 'HIDDEN'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'rgba(250,248,245,0.3)' }}>ORDER</span>
                    <input
                      type="number"
                      defaultValue={slide.order}
                      onBlur={e => handleReorder(slide, e.target.value)}
                      style={{ width: '36px', background: 'transparent', border: '1px solid rgba(201,169,110,0.2)', color: 'var(--gold)', fontSize: '11px', padding: '2px 4px', textAlign: 'center', outline: 'none' }}
                    />
                  </div>
                </div>
                {slide.caption && <div style={{ fontSize: '11px', color: 'rgba(250,248,245,0.5)', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.caption}</div>}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleToggle(slide)} style={{ flex: 1, padding: '6px', border: '1px solid rgba(201,169,110,0.2)', color: 'rgba(250,248,245,0.5)', background: 'transparent', fontSize: '9px', letterSpacing: '0.15em', cursor: 'pointer' }}>
                    {slide.is_active ? 'HIDE' : 'SHOW'}
                  </button>
                  <button onClick={() => handleDelete(slide.id)} style={{ padding: '6px 10px', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', background: 'transparent', fontSize: '9px', cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new slide */}
      <div style={{ background: '#161616', border: '1px solid rgba(201,169,110,0.1)', padding: '28px', display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: '24px' }}>
        <div>
          {preview ? (
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden', marginBottom: '12px' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => { setFile(null); setPreview(null); }}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(10,10,10,0.7)', border: 'none', color: '#faf8f5', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px' }}>×</button>
            </div>
          ) : (
            <UploadZone onFile={handleFile} label="DROP HERO IMAGE OR CLICK TO BROWSE" />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold)', display: 'block', marginBottom: '8px' }}>CAPTION (OPTIONAL)</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Adaeze & Emeka Wedding"
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '10px 0', color: '#faf8f5', fontSize: '13px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold)', display: 'block', marginBottom: '8px' }}>DISPLAY ORDER</label>
            <input type="number" value={order} onChange={e => setOrder(e.target.value)}
              style={{ width: '80px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '10px 0', color: '#faf8f5', fontSize: '13px', outline: 'none' }} />
          </div>
          <button onClick={handleAdd} disabled={saving || !file}
            style={{ padding: '12px 28px', background: file ? 'var(--gold)' : 'rgba(201,169,110,0.2)', color: '#0a0a0a', fontSize: '11px', letterSpacing: '0.25em', border: 'none', cursor: file ? 'pointer' : 'not-allowed', marginTop: 'auto', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'UPLOADING...' : '+ ADD SLIDE'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Gallery Spots Section ────────────────────────────────────────────────────
function GallerySection() {
  const [spots, setSpots] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [span, setSpan] = useState('normal');
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  const load = () => portfolioAPI.getAdminGallerySpots().then(setSpots).catch(err => toast.error(err.message));
  useEffect(() => { load(); }, []);

  const handleFile = (f) => { setFile(f); setPreview(URL.createObjectURL(f)); };

  const handleAdd = async () => {
    if (!file) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('title', title);
      fd.append('span', span);
      fd.append('order', order);
      fd.append('is_active', true);
      await portfolioAPI.createGallerySpot(fd);
      toast.success('Gallery spot added!');
      setFile(null); setTitle(''); setSpan('normal'); setOrder(0); setPreview(null);
      load();
    } catch (err) { toast.error(err.message || 'Failed to upload'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this gallery spot?')) return;
    try {
      await portfolioAPI.deleteGallerySpot(id);
      toast.success('Deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleUpdate = async (spot, data) => {
    try {
      await portfolioAPI.updateGallerySpot(spot.id, data);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const SPAN_LABELS = { normal: 'Normal 1×1', tall: 'Tall 1×2', wide: 'Wide 2×1' };

  return (
    <div style={{ marginBottom: '64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(201,169,110,0.15)' }} />
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 300, whiteSpace: 'nowrap' }}>
          Homepage Gallery Grid
        </h2>
        <div style={{ flex: 1, height: '1px', background: 'rgba(201,169,110,0.15)' }} />
      </div>
      <p style={{ fontSize: '12px', color: 'rgba(250,248,245,0.4)', marginBottom: '28px', letterSpacing: '0.05em' }}>
        The 6-image grid shown below the intro section. Use span types to create visual variety — recommended: 2 tall, 1 wide, 3 normal.
      </p>

      {/* Current spots */}
      {spots.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {spots.map(spot => (
            <div key={spot.id} style={{ background: '#161616', border: '1px solid rgba(201,169,110,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '120px', overflow: 'hidden' }}>
                <img src={imgSrc(spot.image)} alt={spot.title || 'Gallery'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.1em', color: 'var(--gold)', background: 'rgba(201,169,110,0.1)', padding: '2px 6px' }}>
                    {SPAN_LABELS[spot.span]}
                  </span>
                  <input type="number" defaultValue={spot.order} onBlur={e => String(e.target.value) !== String(spot.order) && handleUpdate(spot, { order: e.target.value })}
                    style={{ width: '32px', background: 'transparent', border: '1px solid rgba(201,169,110,0.2)', color: 'var(--gold)', fontSize: '10px', padding: '2px 4px', textAlign: 'center', outline: 'none' }} />
                </div>
                <select value={spot.span} onChange={e => handleUpdate(spot, { span: e.target.value })}
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid rgba(201,169,110,0.15)', color: 'rgba(250,248,245,0.6)', fontSize: '10px', padding: '4px 6px', marginBottom: '8px', outline: 'none' }}>
                  <option value="normal">Normal</option>
                  <option value="tall">Tall</option>
                  <option value="wide">Wide</option>
                </select>
                <button onClick={() => handleDelete(spot.id)}
                  style={{ width: '100%', padding: '6px', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', background: 'transparent', fontSize: '9px', letterSpacing: '0.15em', cursor: 'pointer' }}>
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid preview hint */}
      {spots.length > 0 && (
        <div style={{ padding: '12px 16px', background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.1)', marginBottom: '24px', fontSize: '12px', color: 'rgba(250,248,245,0.4)', letterSpacing: '0.05em' }}>
          ℹ  Currently {spots.length} active spot{spots.length !== 1 ? 's' : ''}. The homepage shows the first 6.
        </div>
      )}

      {/* Add new spot */}
      <div style={{ background: '#161616', border: '1px solid rgba(201,169,110,0.1)', padding: '28px', display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: '24px' }}>
        <div>
          {preview ? (
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden', marginBottom: '12px' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => { setFile(null); setPreview(null); }}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(10,10,10,0.7)', border: 'none', color: '#faf8f5', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px' }}>×</button>
            </div>
          ) : (
            <UploadZone onFile={handleFile} label="DROP GALLERY IMAGE OR CLICK TO BROWSE" />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold)', display: 'block', marginBottom: '8px' }}>TITLE (OPTIONAL)</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Garden Wedding"
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '10px 0', color: '#faf8f5', fontSize: '13px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold)', display: 'block', marginBottom: '8px' }}>GRID SPAN</label>
            <select value={span} onChange={e => setSpan(e.target.value)}
              style={{ width: '100%', background: '#161616', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '10px 0', color: '#faf8f5', fontSize: '13px', outline: 'none' }}>
              <option value="normal">Normal (1×1) — standard square</option>
              <option value="tall">Tall (1×2) — double height</option>
              <option value="wide">Wide (2×1) — double width</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold)', display: 'block', marginBottom: '8px' }}>DISPLAY ORDER</label>
            <input type="number" value={order} onChange={e => setOrder(e.target.value)}
              style={{ width: '80px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '10px 0', color: '#faf8f5', fontSize: '13px', outline: 'none' }} />
          </div>
          <button onClick={handleAdd} disabled={saving || !file}
            style={{ padding: '12px 28px', background: file ? 'var(--gold)' : 'rgba(201,169,110,0.2)', color: '#0a0a0a', fontSize: '11px', letterSpacing: '0.25em', border: 'none', cursor: file ? 'pointer' : 'not-allowed', marginTop: 'auto', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'UPLOADING...' : '+ ADD TO GALLERY'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function SiteImagesManager() {
  return (
    <div style={{ padding: '48px', color: '#faf8f5', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '52px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '8px' }}>MANAGE</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300 }}>Site Images</h1>
        <p style={{ fontSize: '13px', color: 'rgba(250,248,245,0.4)', marginTop: '10px', letterSpacing: '0.04em' }}>
          Control all dynamic images across the public website — hero slideshow, homepage gallery, and service covers.
        </p>
      </div>

      <HeroSection />
      <GallerySection />
    </div>
  );
}

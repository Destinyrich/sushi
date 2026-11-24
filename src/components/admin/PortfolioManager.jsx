'use client';

import { useState, useEffect } from 'react';
import { portfolioAPI } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function PortfolioManager() {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', description: '', featured: false, order: 0 });
  const [imageFile, setImageFile] = useState(null);

  const [newCategory, setNewCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    portfolioAPI.getPhotos().then(setPhotos).catch(err => toast.error(err.message));
    portfolioAPI.getCategories().then(setCategories).catch(err => toast.error(err.message));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!imageFile) return toast.error('Please choose an image');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('image', imageFile);
      await portfolioAPI.createPhoto(fd);
      toast.success('Photo added!');
      setShowForm(false);
      setImageFile(null);
      setForm({ title: '', category: '', description: '', featured: false, order: 0 });
      load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const toggleFeatured = async (photo) => {
    try {
      await portfolioAPI.updatePhoto(photo.id, { featured: !photo.featured });
      load();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this photo?')) return;
    try {
      await portfolioAPI.deletePhoto(id);
      toast.success('Deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await portfolioAPI.createCategory({ name: newCategory.trim() });
      toast.success('Category added');
      setNewCategory('');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const removeCategory = async (c) => {
    if (!confirm(`Delete the "${c.name}" category?`)) return;
    try {
      await portfolioAPI.deleteCategory(c.id);
      toast.success('Category deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div style={{ padding: '48px', color: '#faf8f5' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '8px' }}>MANAGE</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300 }}>Portfolio</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '12px 28px', background: showForm ? 'transparent' : 'var(--gold)', border: '1px solid var(--gold)', color: showForm ? 'var(--gold)' : '#0a0a0a', fontSize: '11px', letterSpacing: '0.2em', cursor: 'pointer' }}>
          {showForm ? 'CANCEL' : '+ ADD PHOTO'}
        </button>
      </div>

      {/* Categories */}
      <div style={{ background: '#161616', border: '1px solid rgba(201,169,110,0.1)', padding: '24px 28px', marginBottom: '36px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '16px' }}>CATEGORIES</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {categories.map(c => (
            <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '6px 12px', border: '1px solid rgba(201,169,110,0.25)', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(250,248,245,0.7)' }}>
              {c.name.toUpperCase()} <span style={{ color: 'rgba(250,248,245,0.3)' }}>{c.photo_count}</span>
              <button onClick={() => removeCategory(c)} aria-label={`Delete ${c.name}`} style={{ color: 'rgba(239,68,68,0.7)', fontSize: '14px', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </span>
          ))}
          <input value={newCategory} onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()} placeholder="New category…"
            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '6px 0', color: '#faf8f5', fontSize: '12px', outline: 'none', width: '160px' }} />
          <button onClick={addCategory} style={{ padding: '6px 14px', border: '1px solid var(--gold)', color: 'var(--gold)', background: 'transparent', fontSize: '10px', letterSpacing: '0.2em', cursor: 'pointer' }}>+ ADD</button>
        </div>
      </div>

      {showForm && (
        <div style={{ background: '#161616', border: '1px solid rgba(201,169,110,0.15)', padding: '36px', marginBottom: '36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 300, gridColumn: '1/-1', marginBottom: '8px' }}>New Photo</h3>
          {[['title', 'Title', 'text'], ['description', 'Description', 'text'], ['order', 'Display Order', 'number']].map(([f, l, t]) => (
            <div key={f}>
              <label style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(250,248,245,0.4)', display: 'block', marginBottom: '8px' }}>{l.toUpperCase()}</label>
              <input type={t} value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '10px 0', color: '#faf8f5', fontSize: '13px', outline: 'none' }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(250,248,245,0.4)', display: 'block', marginBottom: '8px' }}>CATEGORY</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              style={{ width: '100%', background: '#161616', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '10px 0', color: '#faf8f5', fontSize: '13px', outline: 'none' }}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(250,248,245,0.4)', display: 'block', marginBottom: '8px' }}>IMAGE FILE</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
              style={{ width: '100%', padding: '10px 0', color: 'rgba(250,248,245,0.6)', fontSize: '13px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
            <label htmlFor="featured" style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(250,248,245,0.6)', cursor: 'pointer' }}>FEATURE THIS PHOTO</label>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <button onClick={handleCreate} disabled={saving} style={{ padding: '14px 40px', background: 'var(--gold)', color: '#0a0a0a', fontSize: '11px', letterSpacing: '0.25em', cursor: 'pointer', border: 'none', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'UPLOADING...' : 'UPLOAD PHOTO'}
            </button>
          </div>
        </div>
      )}

      {/* Photo grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {photos.map(photo => (
          <div key={photo.id} className="admin-card" style={{ position: 'relative', background: '#161616', border: '1px solid rgba(201,169,110,0.08)', overflow: 'hidden' }}>
            {photo.image && <img src={photo.image} alt={photo.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />}
            {!photo.image && <div style={{ height: '160px', background: 'rgba(201,169,110,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(250,248,245,0.2)', fontSize: '12px' }}>No Image</div>}
            <div style={{ padding: '14px' }}>
              <div style={{ fontSize: '13px', marginBottom: '4px' }}>{photo.title}</div>
              <div style={{ fontSize: '10px', color: photo.featured ? 'var(--gold)' : 'rgba(250,248,245,0.3)', letterSpacing: '0.1em' }}>{photo.featured ? '★ FEATURED' : 'Standard'}</div>
            </div>
            <div className="actions" style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <button onClick={() => toggleFeatured(photo)} style={{ padding: '8px 16px', border: '1px solid var(--gold)', color: 'var(--gold)', background: 'transparent', fontSize: '10px', letterSpacing: '0.2em', cursor: 'pointer' }}>
                {photo.featured ? 'UNFEATURE' : 'FEATURE'}
              </button>
              <button onClick={() => handleDelete(photo.id)} style={{ padding: '8px 16px', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', fontSize: '10px', letterSpacing: '0.2em', cursor: 'pointer' }}>
                DELETE
              </button>
            </div>
          </div>
        ))}
        {photos.length === 0 && <div style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center', color: 'rgba(250,248,245,0.3)', fontSize: '13px' }}>No photos yet. Add your first photo above.</div>}
      </div>
    </div>
  );
}

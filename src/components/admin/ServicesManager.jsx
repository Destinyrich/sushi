'use client';

import { useState, useEffect, useRef } from 'react';
import { bookingAPI } from '@/lib/api-client';
import { formatNaira } from '@/lib/format';
import toast from 'react-hot-toast';

const imgSrc = (url) => url || null;

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', price_from: '', duration: '', includes: '', is_active: true });
  const fileRef = useRef();

  const load = () => bookingAPI.getServices().then(setServices).catch(err => toast.error(err.message));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', price_from: '', duration: '', includes: '', is_active: true });
    setEditing(null); setShowForm(false); setImageFile(null); setPreview(null);
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v)); // slug is generated server-side when blank
      if (imageFile) fd.append('cover_image', imageFile);

      if (editing) {
        await bookingAPI.updateService(editing.id, fd);
        toast.success('Service updated!');
      } else {
        await bookingAPI.createService(fd);
        toast.success('Service created!');
      }
      resetForm(); load();
    } catch (err) { toast.error(err.message || 'Error saving service'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      await bookingAPI.deleteService(id);
      toast.success('Deleted'); load();
    } catch (err) { toast.error(err.message); }
  };

  const startEdit = (s) => {
    setForm({ name: s.name, slug: s.slug, description: s.description, price_from: s.price_from, duration: s.duration, includes: s.includes, is_active: s.is_active });
    setPreview(imgSrc(s.cover_image));
    setEditing(s); setShowForm(true);
  };

  const handleFileChange = (f) => { setImageFile(f); setPreview(URL.createObjectURL(f)); };

  const inputStyle = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '10px 0', color: '#faf8f5', fontSize: '13px', outline: 'none' };
  const labelStyle = { fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(250,248,245,0.4)', display: 'block', marginBottom: '8px' };

  return (
    <div style={{ padding: '48px', color: '#faf8f5' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '8px' }}>MANAGE</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300 }}>Services</h1>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          style={{ padding: '12px 28px', background: showForm && !editing ? 'transparent' : 'var(--gold)', border: '1px solid var(--gold)', color: showForm && !editing ? 'var(--gold)' : '#0a0a0a', fontSize: '11px', letterSpacing: '0.2em', cursor: 'pointer' }}>
          {showForm && !editing ? 'CANCEL' : '+ ADD SERVICE'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#161616', border: '1px solid rgba(201,169,110,0.15)', padding: '36px', marginBottom: '36px' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 300, marginBottom: '28px' }}>{editing ? 'Edit Service' : 'New Service'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[['name','Service Name','text'],['price_from','Starting Price (₦)','number'],['duration','Duration (e.g. 4-6 hours)','text'],['description','Description','text']].map(([f,l,t]) => (
              <div key={f} style={{ gridColumn: f === 'description' ? '1/-1' : undefined }}>
                <label style={labelStyle}>{l.toUpperCase()}</label>
                <input type={t} value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>INCLUSIONS (COMMA SEPARATED)</label>
              <textarea value={form.includes} onChange={e => setForm(p => ({ ...p, includes: e.target.value }))}
                placeholder="Full day coverage,500+ edited photos,Online gallery"
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', paddingTop: '10px' }} />
            </div>

            {/* Cover image */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>COVER IMAGE</label>
              <div style={{ display: 'grid', gridTemplateColumns: preview ? '180px 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
                {preview && (
                  <div style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
                    <img src={preview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => { setImageFile(null); setPreview(null); }}
                      style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(10,10,10,0.7)', border: 'none', color: '#faf8f5', width: '22px', height: '22px', cursor: 'pointer', fontSize: '13px' }}>×</button>
                  </div>
                )}
                <div
                  onClick={() => fileRef.current.click()}
                  style={{ border: '1px dashed rgba(201,169,110,0.3)', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'}
                >
                  <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(250,248,245,0.35)' }}>
                    {preview ? 'CLICK TO CHANGE IMAGE' : 'CLICK TO UPLOAD COVER IMAGE'}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileChange(e.target.files[0])} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} />
              <label htmlFor="is_active" style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(250,248,245,0.6)', cursor: 'pointer' }}>ACTIVE (VISIBLE ON SITE)</label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '28px' }}>
            <button onClick={handleSave} style={{ padding: '14px 40px', background: 'var(--gold)', color: '#0a0a0a', fontSize: '11px', letterSpacing: '0.25em', cursor: 'pointer', border: 'none' }}>
              {editing ? 'UPDATE SERVICE' : 'CREATE SERVICE'}
            </button>
            {editing && <button onClick={resetForm} style={{ padding: '14px 28px', border: '1px solid rgba(201,169,110,0.3)', color: 'rgba(250,248,245,0.5)', background: 'transparent', fontSize: '11px', letterSpacing: '0.2em', cursor: 'pointer' }}>CANCEL</button>}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '2px' }}>
        {services.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#161616', border: '1px solid rgba(201,169,110,0.06)', overflow: 'hidden' }}>
            {s.cover_image && (
              <div style={{ width: '80px', height: '72px', flexShrink: 0 }}>
                <img src={imgSrc(s.cover_image)} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ flex: 1, padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <span style={{ fontSize: '15px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>{s.name}</span>
                <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: s.is_active ? '#10b981' : '#ef4444', background: s.is_active ? '#10b98115' : '#ef444415', padding: '3px 8px' }}>
                  {s.is_active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <span style={{ fontSize: '12px', color: 'var(--gold)' }}>{formatNaira(s.price_from)}+</span>
                <span style={{ fontSize: '12px', color: 'rgba(250,248,245,0.4)' }}>{s.duration}</span>
                {!s.cover_image && <span style={{ fontSize: '11px', color: 'rgba(239,68,68,0.6)', letterSpacing: '0.1em' }}>NO COVER IMAGE</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '0 24px', flexShrink: 0 }}>
              <button onClick={() => startEdit(s)} style={{ padding: '8px 20px', border: '1px solid rgba(201,169,110,0.3)', color: 'var(--gold)', background: 'transparent', fontSize: '10px', letterSpacing: '0.2em', cursor: 'pointer' }}>EDIT</button>
              <button onClick={() => handleDelete(s.id)} style={{ padding: '8px 20px', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', background: 'transparent', fontSize: '10px', letterSpacing: '0.2em', cursor: 'pointer' }}>DELETE</button>
            </div>
          </div>
        ))}
        {services.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(250,248,245,0.3)', fontSize: '13px' }}>No services yet.</div>}
      </div>
    </div>
  );
}

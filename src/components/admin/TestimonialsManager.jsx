'use client';

import { useState, useEffect } from 'react';
import { portfolioAPI } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ client_name: '', event_type: '', message: '', rating: 5, is_featured: false });

  const load = () => portfolioAPI.getTestimonials().then(setTestimonials).catch(err => toast.error(err.message));
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ client_name: '', event_type: '', message: '', rating: 5, is_featured: false }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    try {
      if (editing) {
        await portfolioAPI.updateTestimonial(editing.id, form);
        toast.success('Testimonial updated!');
      } else {
        await portfolioAPI.createTestimonial(form);
        toast.success('Testimonial added!');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.message || 'Error saving testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await portfolioAPI.deleteTestimonial(id);
      toast.success('Deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const toggleFeatured = async (t) => {
    try {
      await portfolioAPI.updateTestimonial(t.id, { is_featured: !t.is_featured });
      load();
    } catch (err) { toast.error(err.message); }
  };

  const startEdit = (t) => { setForm({ client_name: t.client_name, event_type: t.event_type, message: t.message, rating: t.rating, is_featured: t.is_featured }); setEditing(t); setShowForm(true); };

  const inputStyle = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '10px 0', color: '#faf8f5', fontSize: '13px', outline: 'none' };
  const labelStyle = { fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(250,248,245,0.4)', display: 'block', marginBottom: '8px' };

  return (
    <div style={{ padding: '48px', color: '#faf8f5' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '8px' }}>MANAGE</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300 }}>Testimonials</h1>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          style={{ padding: '12px 28px', background: showForm && !editing ? 'transparent' : 'var(--gold)', border: '1px solid var(--gold)', color: showForm && !editing ? 'var(--gold)' : '#0a0a0a', fontSize: '11px', letterSpacing: '0.2em', cursor: 'pointer' }}>
          {showForm && !editing ? 'CANCEL' : '+ ADD TESTIMONIAL'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#161616', border: '1px solid rgba(201,169,110,0.15)', padding: '36px', marginBottom: '36px' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 300, marginBottom: '28px' }}>{editing ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={labelStyle}>CLIENT NAME</label>
              <input value={form.client_name} onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))} style={inputStyle} placeholder="e.g. Adaeze & Chukwuemeka" />
            </div>
            <div>
              <label style={labelStyle}>EVENT TYPE</label>
              <input value={form.event_type} onChange={e => setForm(p => ({ ...p, event_type: e.target.value }))} style={inputStyle} placeholder="e.g. Wedding, Birthday" />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>MESSAGE</label>
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px', paddingTop: '10px' }} placeholder="Client's words..." />
            </div>
            <div>
              <label style={labelStyle}>RATING</label>
              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px' }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setForm(p => ({ ...p, rating: n }))}
                    style={{ fontSize: '20px', color: n <= form.rating ? 'var(--gold)' : 'rgba(250,248,245,0.2)', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}>★</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '18px' }}>
              <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} />
              <label htmlFor="is_featured" style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(250,248,245,0.6)', cursor: 'pointer' }}>FEATURE ON HOMEPAGE</label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '28px' }}>
            <button onClick={handleSave} style={{ padding: '14px 40px', background: 'var(--gold)', color: '#0a0a0a', fontSize: '11px', letterSpacing: '0.25em', cursor: 'pointer', border: 'none' }}>
              {editing ? 'UPDATE' : 'ADD TESTIMONIAL'}
            </button>
            {editing && <button onClick={resetForm} style={{ padding: '14px 28px', border: '1px solid rgba(201,169,110,0.3)', color: 'rgba(250,248,245,0.5)', background: 'transparent', fontSize: '11px', letterSpacing: '0.2em', cursor: 'pointer' }}>CANCEL</button>}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {testimonials.map(t => (
          <div key={t.id} style={{ padding: '28px 32px', background: '#161616', border: '1px solid rgba(201,169,110,0.06)', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px' }}>{t.client_name}</span>
                <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(250,248,245,0.4)' }}>{t.event_type.toUpperCase()}</span>
                {t.is_featured && <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'var(--gold)', background: 'rgba(201,169,110,0.1)', padding: '3px 8px' }}>★ FEATURED</span>}
              </div>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ color: i < t.rating ? 'var(--gold)' : 'rgba(250,248,245,0.15)', fontSize: '14px' }}>★</span>)}
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(250,248,245,0.55)', lineHeight: 1.7, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', fontSize: '16px' }}>"{t.message}"</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
              <button onClick={() => toggleFeatured(t)} style={{ padding: '8px 16px', border: `1px solid ${t.is_featured ? 'var(--gold)' : 'rgba(201,169,110,0.3)'}`, color: t.is_featured ? 'var(--gold)' : 'rgba(250,248,245,0.4)', background: 'transparent', fontSize: '10px', letterSpacing: '0.15em', cursor: 'pointer' }}>
                {t.is_featured ? 'UNFEATURE' : 'FEATURE'}
              </button>
              <button onClick={() => startEdit(t)} style={{ padding: '8px 16px', border: '1px solid rgba(201,169,110,0.3)', color: 'rgba(250,248,245,0.6)', background: 'transparent', fontSize: '10px', letterSpacing: '0.15em', cursor: 'pointer' }}>EDIT</button>
              <button onClick={() => handleDelete(t.id)} style={{ padding: '8px 16px', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', background: 'transparent', fontSize: '10px', letterSpacing: '0.15em', cursor: 'pointer' }}>DELETE</button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(250,248,245,0.3)', fontSize: '13px' }}>No testimonials yet.</div>}
      </div>
    </div>
  );
}

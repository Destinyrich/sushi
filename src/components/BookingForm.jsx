'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { formatNaira } from '@/lib/format';

const EVENT_TYPES = ['Wedding', 'Engagement Session', 'Birthday Celebration', 'Corporate Event', 'Portrait Session', 'Family Gathering', 'Baby Shower', 'Anniversary', 'Other'];

// Which wizard step each API field lives on (to jump back to a failing field).
const FIELD_STEP = {
  client_name: 1, client_email: 1, client_phone: 1,
  service: 2, event_type: 2, event_date: 2, event_time: 2, event_location: 2, guest_count: 2,
  special_requests: 3,
};

const REQUIRED = {
  1: [['client_name', 'your full name'], ['client_email', 'your email address'], ['client_phone', 'your phone number']],
  2: [['event_type', 'the event type'], ['event_date', 'the event date'], ['event_location', 'the venue / location']],
};

export default function BookingForm({ services }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    client_name: '', client_email: '', client_phone: '',
    service: '', event_type: '', event_date: '', event_time: '',
    event_location: '', guest_count: '', special_requests: '',
    website: '', // honeypot — real visitors never see or fill this
  });

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const next = () => {
    const missing = (REQUIRED[step] || []).find(([k]) => !String(form[k]).trim());
    if (missing) return toast.error(`Please enter ${missing[1]}.`);
    if (step === 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.client_email.trim())) {
      return toast.error('Please enter a valid email address.');
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const field = data?.details && Object.keys(data.details)[0];
        if (field && FIELD_STEP[field]) setStep(FIELD_STEP[field]);
        toast.error(data?.details ? Object.values(data.details)[0] : 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '14px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(10,10,10,0.2)', fontSize: '14px', letterSpacing: '0.05em', color: 'var(--ink)', outline: 'none', transition: 'border-color 0.2s' };
  const labelStyle = { fontSize: '10px', letterSpacing: '0.3em', color: 'var(--muted)', display: 'block', marginBottom: '6px' };

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', textAlign: 'center' }}>
      <div>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bone)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px', fontSize: '32px' }}>✓</div>
        <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '20px' }}>BOOKING RECEIVED</p>
        <h2 style={{ fontSize: '48px', fontWeight: 300, marginBottom: '20px' }}>Thank you,<br /><em style={{ fontStyle: 'italic' }}>{form.client_name.split(' ')[0]}</em></h2>
        <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '400px', margin: '0 auto 48px' }}>
          Your booking request has been received. Lucky will be in touch within 24 hours to discuss your vision and confirm the details.
        </p>
        <Link href="/" style={{ fontSize: '11px', letterSpacing: '0.3em', borderBottom: '1px solid var(--gold)', paddingBottom: '3px' }}>RETURN HOME</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center', background: 'var(--ink)' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '20px' }}>LET'S CONNECT</p>
        <h1 style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 300, color: '#faf8f5' }}>Book a <em style={{ fontStyle: 'italic' }}>Session</em></h1>
      </div>

      {/* Steps indicator */}
      <div style={{ padding: '48px 48px 0', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '0', marginBottom: '60px' }}>
          {['Your Details', 'Event Info', 'Final Notes'].map((label, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${step > i ? 'var(--gold)' : 'rgba(10,10,10,0.2)'}`, background: step > i ? 'var(--gold)' : 'transparent', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: step > i ? '#0a0a0a' : 'var(--muted)', fontWeight: 400 }}>{i + 1}</div>
              <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: step === i + 1 ? 'var(--ink)' : 'var(--muted)' }}>{label.toUpperCase()}</div>
              {i < 2 && <div style={{ position: 'absolute', top: '16px', left: '50%', right: '-50%', height: '1px', background: step > i + 1 ? 'var(--gold)' : 'rgba(10,10,10,0.1)', zIndex: -1 }} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ display: 'grid', gap: '36px' }}>
            <div><label style={labelStyle}>FULL NAME *</label><input style={inputStyle} value={form.client_name} onChange={e => update('client_name', e.target.value)} placeholder="Your full name" /></div>
            <div><label style={labelStyle}>EMAIL ADDRESS *</label><input style={inputStyle} type="email" value={form.client_email} onChange={e => update('client_email', e.target.value)} placeholder="your@email.com" /></div>
            <div><label style={labelStyle}>PHONE NUMBER *</label><input style={inputStyle} value={form.client_phone} onChange={e => update('client_phone', e.target.value)} placeholder="+234 xxx xxxx xxxx" /></div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ display: 'grid', gap: '36px' }}>
            <div>
              <label style={labelStyle}>SERVICE TYPE</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.service} onChange={e => update('service', e.target.value)}>
                <option value="">Select a service</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name} — {formatNaira(s.price_from)}+</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>EVENT TYPE</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.event_type} onChange={e => update('event_type', e.target.value)}>
                <option value="">Select event type</option>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div><label style={labelStyle}>EVENT DATE *</label><input style={inputStyle} type="date" value={form.event_date} onChange={e => update('event_date', e.target.value)} /></div>
              <div><label style={labelStyle}>EVENT TIME</label><input style={inputStyle} type="time" value={form.event_time} onChange={e => update('event_time', e.target.value)} /></div>
            </div>
            <div><label style={labelStyle}>VENUE / LOCATION *</label><input style={inputStyle} value={form.event_location} onChange={e => update('event_location', e.target.value)} placeholder="Event venue and city" /></div>
            <div><label style={labelStyle}>EXPECTED GUESTS</label><input style={inputStyle} type="number" value={form.guest_count} onChange={e => update('guest_count', e.target.value)} placeholder="Approximate number" /></div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{ display: 'grid', gap: '36px' }}>
            <div>
              <label style={labelStyle}>SPECIAL REQUESTS OR VISION</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '150px', paddingTop: '12px' }} value={form.special_requests} onChange={e => update('special_requests', e.target.value)} placeholder="Tell Lucky about your vision, must-have shots, or anything special you'd like to share..." />
            </div>
            {/* Summary */}
            <div style={{ padding: '32px', background: 'var(--bone)', borderLeft: '2px solid var(--gold)' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '20px' }}>BOOKING SUMMARY</p>
              {[
                ['Client', form.client_name],
                ['Email', form.client_email],
                ['Phone', form.client_phone],
                ['Event', form.event_type],
                ['Date', form.event_date],
                ['Location', form.event_location],
              ].map(([k, v]) => v && (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--muted)', letterSpacing: '0.1em' }}>{k}</span>
                  <span style={{ fontWeight: 300 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Honeypot (hidden from people, tempting to bots) */}
        <input type="text" name="website" value={form.website} onChange={e => update('website', e.target.value)}
          tabIndex={-1} autoComplete="off" aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '52px', paddingBottom: '80px' }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ fontSize: '11px', letterSpacing: '0.25em', color: 'var(--muted)', borderBottom: '1px solid transparent', paddingBottom: '2px' }}>← BACK</button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={next} style={{ padding: '14px 48px', background: 'var(--ink)', color: '#faf8f5', fontSize: '11px', letterSpacing: '0.3em' }}>CONTINUE →</button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ padding: '14px 48px', background: 'var(--gold)', color: '#0a0a0a', fontSize: '11px', letterSpacing: '0.3em', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'SENDING...' : 'CONFIRM BOOKING'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

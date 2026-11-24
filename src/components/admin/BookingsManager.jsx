'use client';

import { useState, useEffect } from 'react';
import { bookingAPI } from '@/lib/api-client';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#10b981', in_progress: '#3b82f6', completed: 'var(--gold)', cancelled: '#ef4444' };
const STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export default function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = () =>
    bookingAPI.getBookings()
      .then(setBookings)
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await bookingAPI.updateBooking(id, { status });
      toast.success('Status updated');
      if (selected?.id === id) setSelected(b => ({ ...b, status }));
      load();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div style={{ display: 'flex', height: '100vh', color: '#faf8f5' }}>
      {/* List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '48px' }}>
        <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '8px' }}>MANAGE</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300 }}>Bookings</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['all', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ fontSize: '10px', letterSpacing: '0.2em', padding: '6px 14px', border: `1px solid ${filter === s ? 'var(--gold)' : 'rgba(201,169,110,0.2)'}`, color: filter === s ? 'var(--gold)' : 'rgba(250,248,245,0.4)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                {s.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '2px' }}>
          {filtered.map(b => (
            <div key={b.id} onClick={() => setSelected(b)}
              style={{ padding: '20px 28px', background: selected?.id === b.id ? 'rgba(201,169,110,0.08)' : '#161616', border: `1px solid ${selected?.id === b.id ? 'rgba(201,169,110,0.3)' : 'rgba(201,169,110,0.06)'}`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 300, marginBottom: '4px' }}>{b.client_name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(250,248,245,0.4)', letterSpacing: '0.08em' }}>{b.event_type} · {b.event_date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(250,248,245,0.4)', textAlign: 'right' }}>
                  <div>{b.event_location}</div>
                </div>
                <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: STATUS_COLORS[b.status], background: b.status === 'completed' ? 'rgba(201,169,110,0.12)' : `${STATUS_COLORS[b.status]}18`, padding: '4px 10px' }}>
                  {b.status?.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(250,248,245,0.3)', fontSize: '13px' }}>No bookings found</div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ width: '400px', background: '#111', borderLeft: '1px solid rgba(201,169,110,0.1)', padding: '48px 36px', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 300 }}>Details</h2>
            <button onClick={() => setSelected(null)} aria-label="Close" style={{ color: 'rgba(250,248,245,0.3)', fontSize: '20px' }}>×</button>
          </div>

          {[
            ['CLIENT', selected.client_name],
            ['EMAIL', selected.client_email],
            ['PHONE', selected.client_phone],
            ['EVENT TYPE', selected.event_type],
            ['DATE', selected.event_date],
            ['TIME', selected.event_time],
            ['LOCATION', selected.event_location],
            ['GUESTS', selected.guest_count],
          ].map(([k, v]) => v && (
            <div key={k} style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '6px' }}>{k}</div>
              <div style={{ fontSize: '13px', color: 'rgba(250,248,245,0.8)', lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}

          {selected.special_requests && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '8px' }}>SPECIAL REQUESTS</div>
              <p style={{ fontSize: '13px', color: 'rgba(250,248,245,0.6)', lineHeight: 1.7 }}>{selected.special_requests}</p>
            </div>
          )}

          <div style={{ borderTop: '1px solid rgba(201,169,110,0.1)', paddingTop: '28px', marginTop: '8px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '16px' }}>UPDATE STATUS</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)}
                  style={{ padding: '10px 16px', border: `1px solid ${selected.status === s ? STATUS_COLORS[s] : 'rgba(201,169,110,0.15)'}`, color: selected.status === s ? STATUS_COLORS[s] : 'rgba(250,248,245,0.4)', background: selected.status === s ? (s === 'completed' ? 'rgba(201,169,110,0.12)' : `${STATUS_COLORS[s]}15`) : 'transparent', fontSize: '11px', letterSpacing: '0.2em', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {s.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

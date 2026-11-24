import Link from 'next/link';
import { getBookingStats, listBookings } from '@/lib/queries';

const statCard = (label, value, sub, color = 'var(--gold)') => (
  <div style={{ padding: '32px', background: '#161616', border: '1px solid rgba(201,169,110,0.1)' }}>
    <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(250,248,245,0.4)', marginBottom: '16px' }}>{label}</div>
    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '52px', fontWeight: 300, color, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: 'rgba(250,248,245,0.3)', marginTop: '10px', letterSpacing: '0.1em' }}>{sub}</div>}
  </div>
);

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#10b981', in_progress: '#3b82f6', completed: 'var(--gold)', cancelled: '#ef4444' };

export default async function Dashboard() {
  const [bookings, stats] = await Promise.all([listBookings({ limit: 6 }), getBookingStats()]);

  return (
    <div style={{ padding: '48px', color: '#faf8f5' }}>
      <div style={{ marginBottom: '48px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '10px' }}>OVERVIEW</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '40px', fontWeight: 300 }}>Studio Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '48px' }}>
        {statCard('TOTAL BOOKINGS', stats.total)}
        {statCard('PENDING', stats.by_status.pending, 'Awaiting review', '#f59e0b')}
        {statCard('CONFIRMED', stats.by_status.confirmed, 'This month', '#10b981')}
        {statCard('COMPLETED', stats.by_status.completed, 'All time', '#faf8f5')}
      </div>

      {/* Recent Bookings */}
      <div style={{ background: '#161616', border: '1px solid rgba(201,169,110,0.1)' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(201,169,110,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 300 }}>Recent Bookings</h3>
          <Link href="/admin/bookings" style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold)', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>VIEW ALL</Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.08)' }}>
              {['Client', 'Event', 'Date', 'Status', 'Location'].map(h => (
                <th key={h} style={{ padding: '16px 32px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(250,248,245,0.35)', fontWeight: 300 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="row-hover" style={{ borderBottom: '1px solid rgba(201,169,110,0.05)' }}>
                <td style={{ padding: '20px 32px', fontSize: '13px' }}>
                  <div>{b.client_name}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(250,248,245,0.35)', marginTop: '3px' }}>{b.client_email}</div>
                </td>
                <td style={{ padding: '20px 32px', fontSize: '13px', color: 'rgba(250,248,245,0.7)' }}>{b.event_type}</td>
                <td style={{ padding: '20px 32px', fontSize: '12px', color: 'rgba(250,248,245,0.5)', fontVariantNumeric: 'tabular-nums' }}>{b.event_date}</td>
                <td style={{ padding: '20px 32px' }}>
                  <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: STATUS_COLORS[b.status] || 'var(--gold)', background: b.status === 'completed' ? 'rgba(201,169,110,0.12)' : `${STATUS_COLORS[b.status]}15`, padding: '4px 10px', borderRadius: '2px' }}>
                    {b.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '20px 32px', fontSize: '12px', color: 'rgba(250,248,245,0.4)' }}>{b.event_location}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: 'rgba(250,248,245,0.3)', fontSize: '13px' }}>No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

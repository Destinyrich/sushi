'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api-client';

const navItems = [
  { path: '/admin', icon: '◈', label: 'Dashboard' },
  { path: '/admin/bookings', icon: '◷', label: 'Bookings' },
  { path: '/admin/portfolio', icon: '◫', label: 'Portfolio' },
  { path: '/admin/site-images', icon: '⬚', label: 'Site Images' },
  { path: '/admin/services', icon: '◉', label: 'Services' },
  { path: '/admin/testimonials', icon: '❝', label: 'Testimonials' },
];

export default function AdminShell({ username, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const logout = async () => {
    await authAPI.logout().catch(() => {});
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d0d', fontFamily: 'Josefin Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '72px' : '240px',
        background: '#111',
        borderRight: '1px solid rgba(201,169,110,0.1)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s', overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '28px 20px' : '28px 28px', borderBottom: '1px solid rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: '#faf8f5', fontWeight: 300 }}>SUSHI</div>
              <div style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold)' }}>ADMIN STUDIO</div>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{ color: 'var(--muted)', fontSize: '18px', flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer' }}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: collapsed ? '14px 24px' : '13px 28px',
                color: active ? 'var(--gold)' : 'rgba(250,248,245,0.4)',
                background: active ? 'rgba(201,169,110,0.07)' : 'transparent',
                borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                fontSize: '11px', letterSpacing: '0.18em',
                transition: 'all 0.2s', whiteSpace: 'nowrap', textDecoration: 'none',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(250,248,245,0.75)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(250,248,245,0.4)'; }}
              >
                <span style={{ fontSize: '15px', flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                {!collapsed && item.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(201,169,110,0.1)' }}>
          {!collapsed && (
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px', letterSpacing: '0.08em' }}>
              {username || 'Lucky Titity'}
            </div>
          )}
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            color: 'rgba(250,248,245,0.25)', fontSize: '11px', letterSpacing: '0.18em',
            transition: 'color 0.2s', background: 'none', border: 'none', cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,248,245,0.25)'}
          >
            <span style={{ fontSize: '14px' }}>⏻</span>
            {!collapsed && 'LOGOUT'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', background: '#0d0d0d' }}>
        {children}
      </main>
    </div>
  );
}

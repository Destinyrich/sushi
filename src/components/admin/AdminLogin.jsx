'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api-client';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.login(form);
      router.replace('/admin');
      router.refresh();
    } catch (err) {
      toast.error(err.status === 429 ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0d0d0d' }}>
      {/* Left visual */}
      <div style={{ flex: 1, backgroundImage: 'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.6)' }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '60px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '42px', fontWeight: 300, color: '#faf8f5' }}>SUSHI</div>
          <div style={{ fontSize: '11px', letterSpacing: '0.4em', color: 'var(--gold)' }}>PHOTOGRAPHY STUDIO</div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ width: '460px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 60px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '16px' }}>STUDIO ACCESS</p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300, color: '#faf8f5', marginBottom: '52px' }}>Admin <em>Login</em></h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '32px' }}>
          {[
            { label: 'USERNAME', field: 'username', type: 'text' },
            { label: 'PASSWORD', field: 'password', type: 'password' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>{label}</label>
              <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,169,110,0.3)', padding: '12px 0', color: '#faf8f5', fontSize: '14px', outline: 'none' }} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ padding: '16px', background: 'var(--gold)', color: '#0a0a0a', fontSize: '11px', letterSpacing: '0.3em', marginTop: '12px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}

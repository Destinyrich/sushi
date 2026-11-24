export const metadata = { title: 'Contact' };

export default function Contact() {
  return (
    <div style={{ paddingTop: '140px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'var(--gold)', marginBottom: '20px' }}>GET IN TOUCH</p>
        <h1 style={{ fontSize: '64px', fontWeight: 300, marginBottom: '32px' }}>Say <em style={{ fontStyle: 'italic' }}>Hello</em></h1>
        <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '8px' }}>lucky@sushiphotography.ng</p>
        <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8 }}>+234 800 SUSHI PHOTO</p>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '20px' }}>Lagos, Nigeria</p>
      </div>
    </div>
  );
}

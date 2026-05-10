'use client';

export default function HelloPage() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#011126', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '72px', marginBottom: '24px' }}>🚀 Conexión Exitosa</h1>
        <p style={{ fontSize: '24px', opacity: 0.6 }}>Si estás viendo esto, el sistema de rutas de Next.js está funcionando correctamente.</p>
        <button 
          onClick={() => window.location.assign('/hub')}
          style={{ marginTop: '40px', padding: '16px 32px', background: '#FF8C00', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Volver al Hub
        </button>
      </div>
    </div>
  );
}

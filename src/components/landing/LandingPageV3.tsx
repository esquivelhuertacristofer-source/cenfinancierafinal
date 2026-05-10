'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './LandingV3.css';
import { TIERS, ALLIES, VALUES, DEMO_VIDEO_URL } from './LandingData';

// Custom hook for counting animation
const useCounter = (target: number, durationMs = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (target - start) + start));
      if (progress < 1) {
        animationId = requestAnimationFrame(step);
      }
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [target, durationMs, start]);
  return count;
};

export default function LandingPageV3() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'path'>('grid');
  const [showDemo, setShowDemo] = useState(false);
  const [activeTab, setActiveTab] = useState('primaria');

  // Counters for LiveBand
  const countKids = useCounter(12480, 2500, 11000);
  const countSchools = useCounter(284, 2000, 200);
  const countLessons = useCounter(946, 2200, 800);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="landing-v3-root" style={{ background: '#F4F1EA', minHeight: '100vh' }} />;

  return (
    <div className="landing-v3">
      {/* MODAL VIDEO */}
      {showDemo && (
        <div className="video-modal-overlay" onClick={() => setShowDemo(false)}>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowDemo(false)}>&times;</button>
            <div className="video-aspect">
              <iframe 
                src={`${DEMO_VIDEO_URL}?autoplay=1`} 
                title="CEN Academy Presentation" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                referrerPolicy="no-referrer"
              ></iframe>
            </div>
            <div className="video-modal-footer" style={{ padding: '40px', background: '#011C40', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#FF8C00', textTransform: 'uppercase', letterSpacing: '0.4em' }}>Presentación Oficial</span>
                <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></div>
              </div>
              <h4 style={{ fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '8px', fontFamily: 'Epilogue' }}>Academia CEN</h4>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
                Bienvenido a la Campaña de Educación Nacional. Nuestra plataforma ofrece una experiencia de aprendizaje financiero de vanguardia para niños y jóvenes, integrando misiones, retos y simuladores de última generación.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="v3-content">
        <div className="bg-decor"></div>
        
        <main className="main-scroll">
          <nav className="nav">
            <div className="brand">
              <img src="/assets/landing-v3/LOGOCEN.png" alt="CEN Logo" style={{ height: '64px', width: 'auto', objectFit: 'contain' }} loading="lazy" />
            </div>
            <div className="nav-links">
              <a href="#inicio" className="active">Inicio</a>
              <a href="#impacto">Impacto</a>
              <a href="#niveles">Niveles</a>
              <a href="#metodologia">Metodología</a>
            </div>
            <div className="nav-right">
              <Link href="/hub" className="px-6 py-3 font-bold text-[#64748B] hover:text-[#FF8C00] transition-colors">Portal Académico</Link>
              <Link href="/log-in" className="nav-btn-primary">Iniciar Sesión</Link>
            </div>
          </nav>

          {/* HERO */}
          <div id="inicio" className="hero-wrap">
            <header className="hero">
              <div className="hero-bg">
                <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none" preserveAspectRatio="none">
                  <path d="M0 200C200 100 400 300 600 200C800 100 1000 200 1000 200V1000H0V200Z" fill="white" fillOpacity="0.03"/>
                </svg>
              </div>

              <div className="hero-left">
                <h1 className="hero-title">
                  Educación <br/>
                  <span style={{ color: 'var(--cen-orange)' }}>financiera</span><br/>
                  <span className="underlined">para su futuro.</span>
                </h1>
                <p className="hero-sub">
                  La plataforma de educación financiera de CEN es la primera plataforma latina pensada para que niños y jóvenes de 6 a 15 años descubran cómo funciona el dinero — con misiones, juegos, videos y retos imprimibles diseñados por edades y para distintos entornos educativos.
                </p>
                <div className="hero-cta-row">
                  <Link href="/log-in" className="btn-cta">
                    Comenzar ahora <i className="fas fa-rocket"></i>
                  </Link>
                  <button className="btn-cta-demo" onClick={() => setShowDemo(true)}>
                    <i className="fas fa-play-circle"></i> Descubre tu plataforma
                  </button>
                </div>
              </div>

                <div className="hero-right">
                  <div className="hero-circle"></div>
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b1" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b2" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b3" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b4" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b5" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b6" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b7" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b8" alt="Decoración" loading="lazy" />
                  {/* New bills on the left */}
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b9" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b10" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b11" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b12" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b13" alt="Decoración" loading="lazy" />
                  <img src="/assets/landing-v3/money.png" className="deco-img bill b14" alt="Decoración" loading="lazy" />
                  
                  <div className="hero-portrait">
                  <img 
                    src="/assets/landing-v3/landing.png" 
                    alt="CEN Academy Hero Illustration" 
                    style={{ 
                      width: '165%', 
                      height: 'auto', 
                      maxHeight: '175%',
                      objectFit: 'contain', 
                      position: 'absolute',
                      top: '50%',
                      left: '52%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                      filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.3))'
                    }}
                    loading="lazy"
                  />
                </div>
                
                <div className="floater f1">
                  <img src="/assets/landing-v3/money.png" className="ic-img" alt="Dinero" loading="lazy" />
                  <div>
                    <div className="lbl">Mi Primer Ahorro</div>
                    <div className="val">+ 50 Monedas</div>
                  </div>
                </div>

                <div className="floater f2">
                  <img src="/assets/landing-v3/player.png" className="ic-img" alt="Estudiante" loading="lazy" />
                  <div>
                    <div className="lbl">Meta Alcanzada</div>
                    <div className="val">Bici Nueva</div>
                  </div>
                </div>

                <div className="floater f3">
                  <img src="/assets/landing-v3/helper.png" className="ic-img" alt="Asesor" loading="lazy" />
                  <div>
                    <div className="lbl">Rango Actual</div>
                    <div className="val">Ahorrador Jr.</div>
                  </div>
                </div>

                {/* DECORATIVE PNGs FOR DEPTH */}
                <img src="/assets/landing-v3/client.png" className="deco-img client" alt="Decoración" loading="lazy" />
                <img src="/assets/landing-v3/crate.png" className="deco-img crate" alt="Decoración" loading="lazy" />
                <img src="/assets/landing-v3/helper.png" className="deco-img helper-float" alt="Decoración" loading="lazy" />
                <img src="/assets/landing-v3/money.png" className="deco-img money-float" alt="Decoración" loading="lazy" />
                <img src="/assets/landing-v3/player.png" className="deco-img player-float" alt="Decoración" loading="lazy" />
                <img src="/assets/landing-v3/stand.png" className="deco-img stand" alt="Decoración" loading="lazy" />
              </div>
            </header>
          </div>

          {/* MARQUEE */}
          <div className="allies">
            <div className="allies-eyebrow">Nuestra Red de Confianza</div>
            <h2>Impulsado por los <em>mejores</em></h2>
            <div className="allies-divider"></div>
            <div className="marquee">
              <div className="marquee-track">
                {[...ALLIES, ...ALLIES].map((ally, i) => (
                  <React.Fragment key={i}>
                    <span className="ally-name">{ally}</span>
                    <span className="ally-dot"></span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* TIERS SECTION */}
          <section id="niveles" className="section">
            <div className="section-head center">
              <span className="sh-eyebrow">Programas por Edad</span>
              <h2>Un camino diseñado para <em>cada etapa</em> de su vida</h2>
              <p className="sh-sub">
                Desde los primeros ahorros hasta la gestión de portafolios complejos. Nuestro currículo se adapta al crecimiento cognitivo de los estudiantes.
              </p>
            </div>

            <div className="tiers">
              {TIERS.map((tier) => (
                <Link key={tier.id} href="/log-in" className={`tier ${tier.color}`}>
                  <div className="age-tag">{tier.age}</div>
                  <div className="tier-tags">
                    {tier.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <h3>{tier.name}</h3>
                  <p className="tier-blurb">{tier.blurb}</p>
                  
                  <div className="tier-photo" style={{ background: 'transparent', border: 'none' }}>
                    <img 
                      src={tier.photo} 
                      alt={tier.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      loading="lazy"
                    />
                    <div className="ph-label" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      PROGRAMA {tier.id.toUpperCase()}
                    </div>
                  </div>

                  <div className="read-more-btn">
                    <div className="read-more-pill">Explorar Grados</div>
                    <div className="read-more-arrow"><i className="fas fa-arrow-right"></i></div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* PRIMARIA SECTION (Grid Only) */}
          <section className="primaria">
            <div className="pri-head">
              <div>
                <div className="ph-eyebrow"><span className="pip"></span> Educación Básica</div>
                <h2>Academia <em>Primaria</em></h2>
              </div>
            </div>

            <div className="primaria-grid">
              {[
                { n: 1, t: 'Conociendo el Dinero', d: 'Identifica billetes y monedas, comprende de dónde viene el dinero y su función básica en el intercambio de bienes cotidianos.' },
                { n: 2, t: 'El Valor de las Cosas', d: 'Diferencia entre deseos y necesidades, y aprende cómo el ahorro constante ayuda a alcanzar metas personales y familiares.' },
                { n: 3, t: 'Mi Primer Presupuesto', d: 'Introducción a ingresos y egresos. Aprende a crear un presupuesto sencillo para administrar tus domingos o mesadas inteligentemente.' },
                { n: 4, t: 'El Mundo de los Bancos', d: 'Descubre qué es un banco, para qué sirven las cuentas de ahorro, el uso de cajeros automáticos y el concepto básico de inflación.' },
                { n: 5, t: 'Finanzas Cotidianas', d: 'Entiende los créditos, la diferencia entre tarjetas de débito y crédito, y el impacto real de los intereses al comprar.' },
                { n: 6, t: 'Mi Futuro Financiero', d: 'Conceptos avanzados explicados simple: qué es una AFORE, cómo funcionan las inversiones básicas y el origen de las criptomonedas.' }
              ].map((item) => (
                <Link 
                  key={item.n} 
                  href="/log-in"
                  className="pcard navy"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--cen-blue) 0%, rgba(1, 28, 64, 0.9) 35%, transparent 80%), url('/assets/landing-v3/Primaria${item.n}.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: 'none',
                    borderTop: '4px solid var(--cen-orange)',
                    overflow: 'hidden',
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    padding: '32px'
                  }}
                >
                  <div className="pc-top" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', marginBottom: '24px' }}>
                    <span className="pc-tag" style={{ margin: 0, background: 'var(--cen-orange)', color: 'white' }}>GRADO {item.n}</span>
                    <span className="pc-num" style={{ fontSize: '48px', marginTop: 0, lineHeight: 1 }}>{item.n}º</span>
                  </div>
                  
                  <div style={{ maxWidth: '50%' }}>
                    <h3 className="pc-title" style={{ fontSize: '28px', lineHeight: '1.1', marginBottom: '12px', textWrap: 'balance' }}>{item.t}</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 16px 0' }}>{item.d}</p>
                    <div className="pc-meta" style={{ fontSize: '12px', opacity: 0.6 }}>20 Unidades • 20 Retos</div>
                  </div>

                  <div className="pc-feat-stats" style={{ maxWidth: '60%', marginTop: '12px' }}>
                    <div><div className="v">20</div><div className="s">Videos</div></div>
                    <div><div className="v">20</div><div className="s">Actividades</div></div>
                  </div>

                  <div className="pc-cta" style={{ background: 'var(--cen-orange)', color: '#fff', padding: '10px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content', marginTop: 'auto', alignSelf: 'flex-start' }}>
                    Acceder <i className="fas fa-arrow-right"></i>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECUNDARIA SECTION */}
          <section className="secundaria">
            <div className="sec-head">
              <div>
                <div className="sh-eyebrow"><span className="pip"></span> ETAPA 02 · SECUNDARIA</div>
                <h2>Academia <em>Secundaria</em></h2>
                <p className="sh-sub">Para los que ya están tomando decisiones.</p>
              </div>
            </div>

            <div className="primaria-grid">
              {[
                { n: 1, t: 'Pensamiento Sistémico', age: '12-13 AÑOS', d: 'Historia económica de México, mercado laboral y seguridad social (IMSS e ISSSTE). Entiende cómo funciona el mundo real y el poder del interés compuesto.', topics: ['Interés Compuesto', 'AFORE', 'Lean Startup'] },
                { n: 2, t: 'Análisis Macro y Riesgo', age: '13-14 AÑOS', d: 'Macroeconomía para jóvenes, política monetaria (Banxico) e introducción a la Bolsa Mexicana de Valores (BMV). Diseña tu primer portafolio y modelo Canvas.', topics: ['Banxico', 'Bolsa', 'Canvas'] },
                { n: 3, t: 'Planeación Vida Adulta', age: '14-15 AÑOS', d: 'Elabora un plan financiero de los 15 a los 65 años. Ahorro para la universidad, declaración fiscal (SAT) y levantamiento de capital para emprendimientos.', topics: ['Plan Vida', 'SAT', 'Emprendimiento'] }
              ].map((item) => (
                <Link 
                  key={item.n} 
                  href="/log-in"
                  className="pcard navy"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--cen-blue) 0%, rgba(1, 28, 64, 0.9) 35%, transparent 80%), url('/assets/landing-v3/Secundaria${item.n}.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: 'none',
                    borderTop: '4px solid var(--cen-orange)',
                    overflow: 'hidden',
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    padding: '32px'
                  }}
                >
                  <div className="pc-top" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', marginBottom: '24px' }}>
                    <span className="pc-tag" style={{ margin: 0, background: 'var(--cen-orange)', color: 'white' }}>{item.n}º SEC</span>
                    <span className="pc-num" style={{ fontSize: '48px', marginTop: 0, lineHeight: 1 }}>{item.n}º</span>
                  </div>
                  
                  <div style={{ maxWidth: '50%' }}>
                    <h3 className="pc-title" style={{ fontSize: '28px', lineHeight: '1.1', marginBottom: '12px', textWrap: 'balance' }}>{item.t}</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 16px 0' }}>{item.d}</p>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {item.topics.map(topic => (
                        <span key={topic} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold', color: 'white' }}>{topic}</span>
                      ))}
                    </div>
                  </div>

                  <div className="pc-feat-stats" style={{ maxWidth: '60%', marginTop: 'auto', marginBottom: '20px' }}>
                    <div><div className="v">20</div><div className="s">Unidades</div></div>
                    <div><div className="v">20</div><div className="s">Retos</div></div>
                  </div>

                  <div className="pc-cta" style={{ background: 'var(--cen-orange)', color: '#fff', padding: '10px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content', alignSelf: 'flex-start' }}>
                    Acceder <i className="fas fa-arrow-right"></i>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* LIVE BAND (Mexico Map + Metrics) */}
          <section id="impacto" className="live-band">
            <div>
              <div className="lb-eyebrow"><span className="pulse"></span>Tiempo real · México</div>
              <h2>Mientras lees esto, <em>{countKids.toLocaleString()}+</em> niños están aprendiendo en CEN.</h2>
              <p>Una red viva en {countSchools} escuelas a lo largo de la república. El cambio empieza con cada lección completada.</p>
              
              <div className="live-stats">
                <div className="live-stat">
                  <h4>{countKids.toLocaleString()}<span>+</span></h4>
                  <div className="lbl">Niños activos</div>
                  <div className="sub"><i className="fas fa-trending-up"></i> +217 esta semana</div>
                </div>
                <div className="live-stat">
                  <h4>{countSchools}</h4>
                  <div className="lbl">Escuelas</div>
                  <div className="sub"><i className="fas fa-map-marker-alt"></i> 12 estados</div>
                </div>
                <div className="live-stat">
                  <h4>{countLessons}k</h4>
                  <div className="lbl">Lecciones hoy</div>
                  <div className="sub"><i className="fas fa-bolt"></i> en este momento</div>
                </div>
              </div>
            </div>
            
            <div className="mexico-map">
              <img src="/assets/landing-v3/mapa-mexico.png" alt="Mapa de México" style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
            </div>
          </section>

          {/* CTA BAND */}
          <section className="cta-band" style={{ overflow: 'visible', marginTop: '64px', marginBottom: '64px' }}>
            <div style={{ zIndex: 2, position: 'relative' }}>
              <h3 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '24px' }}>¿Listo para dar el <br/><em>primer paso</em>?</h3>
              <p style={{ fontSize: '18px', maxWidth: '480px', marginBottom: '32px' }}>Únete a la red de academias y comienza a construir el futuro financiero de tus hijos hoy mismo.</p>
              <div className="cta-actions">
                <Link href="/log-in" className="btn-cta" style={{ background: 'var(--cen-orange)', padding: '16px 32px', fontSize: '16px', borderRadius: '999px' }}>Inicia Sesion</Link>
              </div>
            </div>
            <div className="right-art" style={{ position: 'relative', height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <img 
                src="/assets/landing-v3/helper.png" 
                alt="CEN Helper" 
                style={{ 
                  height: '420px', 
                  objectFit: 'contain', 
                  position: 'absolute',
                  right: '0',
                  bottom: '-80px',
                  filter: 'drop-shadow(0 30px 40px rgba(1, 28, 64, 0.4))',
                  zIndex: 1
                }} 
                loading="lazy"
              />
            </div>
          </section>

          {/* FOOTER */}
          <footer className="footer">
            <div className="footer-brand">
              <img src="/assets/landing-v3/LOGOCEN.png" alt="CEN Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain', marginBottom: '24px' }} loading="lazy" />
              <h4>Campaña de<br />Educación Nacional</h4>
              <div className="fc-block" style={{marginTop: '32px'}}>
                <div className="fc-label">Correo electrónico</div>
                <div className="fc-value" style={{fontSize: '13px'}}>gerencia@campanaeducativanacional.com.mx</div>
              </div>
            </div>
            <div className="footer-links" style={{paddingTop: '0'}}>
              <a href="#" rel="noopener noreferrer">Nosotros</a>
              <a href="#" rel="noopener noreferrer">Productos</a>
              <a href="#" rel="noopener noreferrer">Programa de Educación Nacional</a>
              <a href="#" rel="noopener noreferrer">Valores</a>
            </div>
            <div className="footer-contact" style={{paddingTop: '0'}}>
              <div className="fc-block" style={{marginBottom: '24px'}}>
                <div className="fc-label">Dirección</div>
                <div className="fc-value">Mariano Matamoros #208<br/>Casa Blanca, Metepec,<br/>Estado de México.</div>
              </div>
              <div className="fc-block">
                <div className="fc-label">Teléfonos</div>
                <div className="fc-value">722 537 9594<br/>729 178 9196</div>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 Campaña de Educación Nacional. Todos los derechos reservados.</span>
              <div className="fb-legal" style={{display: 'flex', gap: '20px'}}>
                <a href="#" rel="noopener noreferrer">Privacidad</a>
                <a href="#" rel="noopener noreferrer">Términos</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

import Link from 'next/link';
import FooterLegal from '../../components/FooterLegal';

export const metadata = { title: 'Aviso de Privacidad — CEN' };

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] font-epilogue">
      <header className="w-full border-b border-[#E2E8F0] bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#011C40] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl tracking-tighter">C</span>
            </div>
            <span className="text-[#011C40] font-black tracking-widest text-lg">CEN</span>
          </Link>
          <Link href="/log-in" className="text-sm font-bold text-[#FF8C00] hover:underline">Iniciar Sesión</Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 md:p-12 space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#FF8C00]">Documento Legal</p>
            <h1 className="text-4xl font-black text-[#011C40] tracking-tight">Aviso de Privacidad</h1>
            <p className="text-[#64748B] font-medium">Última actualización: mayo 2026</p>
          </div>

          <section className="space-y-4 text-[#334155] leading-relaxed">
            <h2 className="text-xl font-black text-[#011C40]">1. Responsable del tratamiento</h2>
            <p>
              CEN — Centro de Educación Financiera (en adelante "CEN") es el responsable del tratamiento de los datos personales que usted proporciona al utilizar esta plataforma educativa. Para cualquier consulta relacionada con el tratamiento de sus datos, puede contactarnos a través de los canales institucionales habilitados.
            </p>
          </section>

          <section className="space-y-4 text-[#334155] leading-relaxed">
            <h2 className="text-xl font-black text-[#011C40]">2. Datos que recopilamos</h2>
            <p>Recopilamos únicamente los datos necesarios para la prestación del servicio educativo:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nombre completo y correo electrónico institucional</li>
              <li>Datos de progreso académico (actividades completadas, puntuaciones, tiempo de estudio)</li>
              <li>Información de sesión (inicio y cierre de sesión, dispositivos utilizados)</li>
            </ul>
          </section>

          <section className="space-y-4 text-[#334155] leading-relaxed">
            <h2 className="text-xl font-black text-[#011C40]">3. Finalidad del tratamiento</h2>
            <p>Los datos recopilados se utilizan exclusivamente para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proveer acceso a los contenidos y actividades de la plataforma</li>
              <li>Generar reportes de progreso académico para docentes y administradores</li>
              <li>Mejorar la experiencia educativa y el contenido de la plataforma</li>
              <li>Cumplir con obligaciones institucionales y normativas aplicables</li>
            </ul>
          </section>

          <section className="space-y-4 text-[#334155] leading-relaxed">
            <h2 className="text-xl font-black text-[#011C40]">4. Almacenamiento y seguridad</h2>
            <p>
              Los datos se almacenan en servidores seguros mediante Supabase (infraestructura en la nube con cifrado en tránsito y en reposo). CEN implementa medidas técnicas y organizativas para proteger sus datos contra acceso no autorizado, pérdida o divulgación indebida.
            </p>
          </section>

          <section className="space-y-4 text-[#334155] leading-relaxed">
            <h2 className="text-xl font-black text-[#011C40]">5. Derechos del titular</h2>
            <p>
              Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales (derechos ARCO), así como a revocar el consentimiento otorgado. Para ejercer estos derechos, contacte a su institución educativa o al administrador de la plataforma.
            </p>
          </section>

          <section className="space-y-4 text-[#334155] leading-relaxed">
            <h2 className="text-xl font-black text-[#011C40]">6. Menores de edad</h2>
            <p>
              Esta plataforma está dirigida a estudiantes en contexto educativo supervisado. El tratamiento de datos de menores de edad se realiza bajo la responsabilidad y consentimiento de la institución educativa contratante, conforme a la normativa aplicable.
            </p>
          </section>

          <section className="space-y-4 text-[#334155] leading-relaxed">
            <h2 className="text-xl font-black text-[#011C40]">7. Cambios a este aviso</h2>
            <p>
              CEN se reserva el derecho de modificar este aviso de privacidad en cualquier momento. Las modificaciones serán publicadas en esta página con indicación de la fecha de actualización.
            </p>
          </section>
        </div>
      </main>

      <FooterLegal />
    </div>
  );
}

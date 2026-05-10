'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';
import { notFound, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getActivityData, calculateXP } from '@/lib/activities';
import { getCurrentProfile, markActivityComplete } from '@/lib/hub';
import { Loader2, ArrowLeft, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Carga dinámica de componentes
const SimulatorActivity = dynamic(() => import('@/components/activities/SimulatorActivity'), { loading: () => <ActivityLoader /> });
const QuizActivity = dynamic(() => import('@/components/activities/QuizActivity'), { loading: () => <ActivityLoader /> });
const StoryActivity = dynamic(() => import('@/components/activities/StoryActivity'), { loading: () => <ActivityLoader /> });
const BuilderActivity = dynamic(() => import('@/components/activities/BuilderActivity'), { loading: () => <ActivityLoader /> });
const TriviaActivity = dynamic(() => import('@/components/activities/TriviaActivity'), { loading: () => <ActivityLoader /> });
const DragDropActivity = dynamic(() => import('@/components/activities/DragDropActivity'), { loading: () => <ActivityLoader /> });
const FillBlanksActivity = dynamic(() => import('@/components/activities/FillBlanksActivity'), { loading: () => <ActivityLoader /> });
const RouletteActivity = dynamic(() => import('@/components/activities/RouletteActivity'), { loading: () => <ActivityLoader /> });
const MatchingActivity = dynamic(() => import('@/components/activities/MatchingActivity'), { loading: () => <ActivityLoader /> });
const GameActivity = dynamic(() => import('@/components/activities/GameActivity'), { loading: () => <ActivityLoader /> });
const BalanceActivity = dynamic(() => import('@/components/activities/BalanceActivity'), { loading: () => <ActivityLoader /> });
const RadarActivity = dynamic(() => import('@/components/activities/RadarActivity'), { loading: () => <ActivityLoader /> });
const GrowthActivity = dynamic(() => import('@/components/activities/GrowthActivity'), { loading: () => <ActivityLoader /> });
const ServiceControlActivity = dynamic(() => import('@/components/activities/ServiceControlActivity'), { loading: () => <ActivityLoader /> });

const AdventureBackground = memo(({ color }: { color: string }) => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-[#0F0225] via-[#0A0118] to-[#120526]">
    <div className={`absolute -top-[20%] -right-[10%] w-[100%] h-[100%] ${color} blur-[150px] rounded-full opacity-20 animate-pulse`} />
    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4F46E5] blur-[150px] rounded-full animate-pulse delay-700" />
  </div>
));
AdventureBackground.displayName = 'AdventureBackground';

function ActivityLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0225] via-[#0A0118] to-[#160331] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF8C00] blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4F46E5] blur-[150px] rounded-full animate-pulse delay-700" />
       </div>
       <div className="relative z-10">
          <Loader2 className="w-16 h-16 text-[#FF8C00] animate-spin" />
          <div className="absolute inset-0 bg-[#FF8C00]/20 blur-2xl animate-pulse" />
       </div>
       <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] relative z-10">Iniciando Misión Diamond</div>
    </div>
  );
}

export default function ActivityPage({ params }: { params: Promise<{ activityId: string }> }) {
  const { activityId } = React.use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const result = await getActivityData(activityId);
      if (!result) {
        setLoading(false);
        return;
      }
      
      // Normalización de seguridad para evitar cuelgues en el renderizado
      const normalized = {
        ...result,
        items: result.items || result.elementos || result.preguntas || result.cards || [],
        tipo: result.tipo || result.type || 'SIMULADOR'
      };

      setData(normalized);
      setLoading(false);
    }
    load();
  }, [activityId]);

  const handleComplete = useCallback(async (score: number = 0) => {
    const profile = await getCurrentProfile();
    if (profile?.id && profile.id !== 'guest_user') {
      await markActivityComplete(profile.id, activityId);
      const xpEarned = calculateXP(score, data?.xp ?? 0);
      const xpKey = `cen_xp_${profile.id}`;
      const current = parseInt(localStorage.getItem(xpKey) ?? '0', 10);
      localStorage.setItem(xpKey, String(current + xpEarned));
    }
    router.back();
  }, [activityId, data, router]);

  if (loading) return <ActivityLoader />;
  if (!data) return notFound();

  const renderActivity = () => {
    const commonProps = { data, onClose: () => router.back(), onComplete: handleComplete };
    
    switch (data.tipo?.toUpperCase()) {
      case 'SIMULADOR': return <SimulatorActivity {...commonProps} />;
      case 'QUIZ': return <QuizActivity {...commonProps} />;
      case 'DECIDE': 
      case 'STORY': return <StoryActivity {...commonProps} />;
      case 'CONSTRUCTOR':
      case 'BUILDER': return <BuilderActivity {...commonProps} />;
      case 'TRIVIA': return <TriviaActivity {...commonProps} />;
      case 'ARRASTRA':
      case 'DRAG_DROP': return <DragDropActivity {...commonProps} />;
      case 'RELLENA':
      case 'FILL_BLANKS': return <FillBlanksActivity {...commonProps} />;
      case 'RULETA':
      case 'ROULETTE': return <RouletteActivity {...commonProps} />;
      case 'MEMORIA':
      case 'MATCHING': return <MatchingActivity {...commonProps} />;
      case 'JUEGO':
      case 'GAME': return <GameActivity {...commonProps} />;
      case 'BALANCE': return <BalanceActivity {...commonProps} />;
      case 'RADAR': return <RadarActivity {...commonProps} />;
      case 'CRECIMIENTO': return <GrowthActivity {...commonProps} />;
      case 'CONTROL': return <ServiceControlActivity {...commonProps} />;
      default:
        return (
          <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="max-w-md text-center space-y-6">
               <h2 className="text-3xl font-black italic">Misión en Construcción</h2>
               <p className="text-white/40 leading-relaxed">
                  Estamos preparando el componente para la actividad tipo <span className="text-[#FF8C00] font-black">{data.tipo}</span>.
               </p>
               <button onClick={() => router.back()} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                  Volver al Hub
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden animate-in fade-in duration-1000">
       <AdventureBackground color="bg-[#FF8C00]" />
       
       <div className="relative z-10 flex flex-col h-screen">
        <header className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/10">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => router.back()}
                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-[#FF8C00] uppercase tracking-[0.4em] mb-1 italic">Operación Diamond</span>
                 <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">{data.titulo}</h1>
              </div>
           </div>
           
           <div className="hidden md:flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full border border-white/10">
              <Zap size={16} className="text-[#FF8C00]" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{data.xp} XP EN JUEGO</span>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           {renderActivity()}
        </main>
      </div>
    </div>
  );
}

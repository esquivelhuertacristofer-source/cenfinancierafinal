'use client';

import { useState, useEffect } from 'react';
import { X, Trophy, BookOpen, Clock, CheckCircle2, Star, Zap, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProgressItem {
  id: string;
  activity_id: string;
  created_at: string;
}

export default function StudentRecordModal({ studentId, studentName, onClose, isDark = true }: { studentId: string; studentName: string; onClose: () => void; isDark?: boolean }) {
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecord() {
      setLoading(true);
      const { data } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', studentId)
        .order('created_at', { ascending: false });
      
      setProgress(data || []);
      setLoading(false);
    }
    fetchRecord();
  }, [studentId]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[#0A0118]/90 backdrop-blur-3xl" onClick={onClose} />
      
      <div className={`relative z-10 w-full max-w-3xl rounded-[60px] border p-12 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] ${
        isDark ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'
      }`}>
        {/* Header Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8C00]/10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="flex justify-between items-start mb-12 relative z-10">
          <div className="flex items-center gap-8">
            <div className={`w-24 h-24 rounded-[30px] flex items-center justify-center text-4xl font-black ${
              isDark ? 'bg-[#FF8C00]/20 text-[#FF8C00]' : 'bg-[#FF8C00] text-white'
            }`}>
              {studentName[0]}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF8C00] mb-2">Expediente Académico</div>
              <h2 className="text-4xl font-black tracking-tighter italic uppercase">{studentName}</h2>
              <div className="flex items-center gap-4 mt-4 opacity-50 font-bold text-xs uppercase tracking-widest">
                <ShieldCheck size={16} className="text-[#42E8E0]" /> Estudiante Certificado
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 rounded-full hover:bg-red-500 transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12 relative z-10">
          <div className="p-8 bg-white/5 rounded-[30px] border border-white/5">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Puntos XP</div>
            <div className="text-3xl font-black flex items-center gap-3">
               <Zap className="text-[#FF8C00]" /> {progress.length * 50}
            </div>
          </div>
          <div className="p-8 bg-white/5 rounded-[30px] border border-white/5">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Misiones</div>
            <div className="text-3xl font-black flex items-center gap-3 text-[#42E8E0]">
               <CheckCircle2 /> {progress.length}
            </div>
          </div>
          <div className="p-8 bg-white/5 rounded-[30px] border border-white/5">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Estatus</div>
            <div className="text-3xl font-black text-emerald-400">Activo</div>
          </div>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
          <h3 className="text-xs font-black uppercase tracking-[0.5em] opacity-30 mb-8 px-4">Historial de Logros</h3>
          
          {loading ? (
             <div className="flex justify-center py-20">
               <div className="w-8 h-8 border-2 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
             </div>
          ) : progress.length === 0 ? (
            <div className="text-center py-20 opacity-30 font-black uppercase tracking-widest">Sin registros aún</div>
          ) : progress.map((item) => (
            <div key={item.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#FF8C00]">
                  <Trophy size={20} />
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-widest mb-1">{item.activity_id.replace('ACT-', '')}</div>
                  <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                Verificado
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

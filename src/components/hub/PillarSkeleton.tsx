'use client';

export default function PillarSkeleton() {
  return (
    <div className="min-h-screen bg-[#011C40] p-20 animate-pulse">
      <div className="max-w-6xl mx-auto">
        {/* NAV SKELETON */}
        <div className="flex justify-between items-center mb-20">
          <div className="w-32 h-10 bg-white/5 rounded-xl" />
          <div className="w-48 h-10 bg-white/5 rounded-xl" />
        </div>

        {/* HERO SKELETON */}
        <div className="w-full h-[500px] bg-white/5 rounded-[40px] mb-20 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>

        {/* TIMELINE SKELETON */}
        <div className="space-y-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-10">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex-shrink-0" />
              <div className="flex-1 h-32 bg-white/5 rounded-[32px]" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

'use client';

import React from 'react';

export default function HubSkeleton() {
  return (
    <div className="min-h-screen font-['Epilogue'] bg-[#F4F1EA] flex flex-col animate-pulse">
      {/* NAV SKELETON */}
      <nav className="h-[90px] border-b border-[#011C40]/5 px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-[1.5rem] bg-[#011C40]/5" />
          <div className="space-y-2">
            <div className="h-6 w-32 bg-[#011C40]/5 rounded" />
            <div className="h-3 w-24 bg-[#011C40]/5 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="h-10 w-32 bg-[#011C40]/5 rounded-2xl" />
          <div className="h-14 w-40 bg-[#011C40]/10 rounded-2xl" />
        </div>
      </nav>

      <main className="p-10 lg:p-20 max-w-[1800px] mx-auto w-full space-y-20">
        {/* HERO SKELETON */}
        <div className="h-[500px] rounded-[4.5rem] bg-[#011C40]/5 border border-[#011C40]/5 p-20 flex flex-col justify-center space-y-10">
          <div className="h-20 w-1/2 bg-[#011C40]/5 rounded-3xl" />
          <div className="h-6 w-1/3 bg-[#011C40]/5 rounded" />
          <div className="flex gap-10">
            <div className="h-20 w-32 bg-[#011C40]/5 rounded-2xl" />
            <div className="h-20 w-32 bg-[#011C40]/5 rounded-2xl" />
            <div className="h-20 w-32 bg-[#011C40]/5 rounded-2xl" />
          </div>
        </div>

        {/* SECTION TITLE SKELETON */}
        <div className="space-y-4">
          <div className="h-4 w-40 bg-[#FF8C00]/10 rounded-full" />
          <div className="h-16 w-96 bg-[#011C40]/5 rounded-3xl" />
        </div>

        {/* BENTO GRID SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 rounded-[4rem] bg-white border border-[#011C40]/5 p-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="h-20 w-20 rounded-[2rem] bg-[#011C40]/5" />
                <div className="h-10 w-full bg-[#011C40]/5 rounded-xl" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-[#011C40]/5 rounded-full" />
                <div className="h-12 w-full bg-[#011C40]/5 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

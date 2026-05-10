"use client";

import PillarCard from './PillarCard';
import { getPillarProgress } from '../../lib/hub';
import type { PillarMeta } from '../../lib/hub';

interface PillarGridProps {
  pillars: PillarMeta[];
  completed: Set<string>;
}

export default function PillarGrid({ pillars, completed }: PillarGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {pillars.map((pillar) => {
        const { done, total, pct } = getPillarProgress(pillar, completed);
        return (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            done={done}
            total={total}
            pct={pct}
          />
        );
      })}
    </div>
  );
}

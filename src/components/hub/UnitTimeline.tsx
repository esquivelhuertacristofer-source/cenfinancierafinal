"use client";

import { useState } from 'react';
import UnitCard from './UnitCard';
import ContentModal from './ContentModal';
import { getUnitStatus } from '../../lib/hub';
import type { PillarMeta, Unit } from '../../lib/hub';

interface UnitTimelineProps {
  pillar: PillarMeta;
  completed: Set<string>;
  userId: string | null;
  onComplete: (activityId: string) => void;
  globalOffset: number; // For sequential images across pillars
}

export default function UnitTimeline({ pillar, completed, userId, onComplete, globalOffset }: UnitTimelineProps) {
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);

  return (
    <>
      <div className="flex flex-col">
        {pillar.units.map((unit, i) => (
          <UnitCard
            key={unit.code}
            unit={unit}
            status={getUnitStatus(unit, pillar, completed) as 'locked' | 'available' | 'completed'}
            isLast={i === pillar.units.length - 1}
            onClick={() => setActiveUnit(unit)}
            unitIndex={globalOffset + i}
          />
        ))}
      </div>

      {activeUnit && (
        <ContentModal
          unit={activeUnit}
          pillar={pillar}
          completed={completed}
          userId={userId}
          onComplete={(id) => { onComplete(id); }}
          onClose={() => setActiveUnit(null)}
          onNextUnit={(() => {
            const idx = pillar.units.findIndex(u => u.code === activeUnit.code);
            const next = pillar.units[idx + 1];
            return next ? () => setActiveUnit(next) : undefined;
          })()}
        />
      )}
    </>
  );
}

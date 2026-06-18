import React, { useEffect, useState } from 'react';
import { Html, Float, Torus } from '@react-three/drei';
import { useMuseum } from '@/context/MuseumContext';
import { START_DATE } from '@/lib/constants';

type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getTimeSinceStart = (): TimeParts => {
  const diff = Math.max(Date.now() - START_DATE, 0);

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

const CounterBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex min-w-[66px] flex-col items-center justify-center rounded-lg border border-primary/20 bg-[#10040c]/80 px-2 py-2 shadow-[0_0_14px_rgba(255,182,193,0.12)] backdrop-blur-md sm:min-w-[78px]">
    <span className="font-mono text-2xl leading-none text-primary tabular-nums drop-shadow-[0_0_10px_rgba(255,182,193,0.55)] sm:text-3xl">
      {String(value).padStart(2, '0')}
    </span>
    <span className="mt-1 text-[10px] leading-none text-primary/55 sm:text-xs">
      {label}
    </span>
  </div>
);

export const Room4 = ({ position }: { position: [number, number, number] }) => {
  const { currentRoom } = useMuseum();
  const isActive = currentRoom === 4;
  const [time, setTime] = useState<TimeParts>(() => getTimeSinceStart());

  useEffect(() => {
    if (!isActive) return;

    setTime(getTimeSinceStart());
    const id = window.setInterval(() => {
      setTime(getTimeSinceStart());
    }, 1000);

    return () => window.clearInterval(id);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <group position={position}>
      <Float speed={1} rotationIntensity={0.35} floatIntensity={0.35}>
        <Torus args={[3.2, 0.035, 16, 96]}>
          <meshBasicMaterial color="#FFB6C1" transparent opacity={0.22} />
        </Torus>
        <Torus args={[2.55, 0.025, 16, 96]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#FFB6C1" transparent opacity={0.14} />
        </Torus>
      </Float>

      <Html center transform zIndexRange={[100, 0]} distanceFactor={11}>
        <div
          dir="rtl"
          className="flex w-[90vw] max-w-[520px] flex-col items-center justify-center rounded-xl border border-primary/25 bg-[#090005]/88 p-4 text-center font-serif shadow-[0_0_28px_rgba(255,182,193,0.18)] backdrop-blur-xl"
        >
          <h2 className="text-xl text-primary drop-shadow-[0_0_10px_rgba(255,182,193,0.55)] sm:text-2xl">
            العد التنازلي
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-primary/55 sm:text-sm">
            عرفتك من {time.days} يوم و {time.hours} ساعة
          </p>

          <div className="mt-4 grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
            <CounterBox value={time.days} label="يوم" />
            <CounterBox value={time.hours} label="ساعة" />
            <CounterBox value={time.minutes} label="دقيقة" />
            <CounterBox value={time.seconds} label="ثانية" />
          </div>

          <p className="mt-4 border-t border-primary/15 px-4 pt-3 text-xs leading-relaxed text-primary/45">
            بدأت من 2/27/2026 - 9:33 PM
          </p>
        </div>
      </Html>
    </group>
  );
};

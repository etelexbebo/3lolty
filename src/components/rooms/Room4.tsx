import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

const CounterBox = ({ value, label, delay }: { value: number; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 14, scale: 0.92 }}
    animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
    transition={{
      opacity: { delay, duration: 0.45 },
      scale: { delay, type: 'spring', stiffness: 220, damping: 18 },
      y: { delay, duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
    }}
    className="flex min-w-[70px] flex-1 flex-col items-center justify-center rounded-xl border border-primary/25 bg-[#10040c]/80 px-2 py-3 shadow-[0_0_20px_rgba(255,182,193,0.16)] backdrop-blur-md sm:min-w-[84px]"
  >
    <span className="block h-[1.15em] overflow-hidden text-2xl sm:text-[1.9rem]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '55%', opacity: 0, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: '-55%', opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="block font-mono leading-[1.15] text-primary tabular-nums drop-shadow-[0_0_12px_rgba(255,182,193,0.6)]"
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </span>
    <span className="mt-1.5 text-[10px] leading-none text-primary/55 sm:text-xs">
      {label}
    </span>
  </motion.div>
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

      <Html center zIndexRange={[100, 0]}>
        <div
          dir="rtl"
          className="flex max-h-[74vh] w-[88vw] max-w-[440px] flex-col items-center justify-center overflow-y-auto rounded-2xl border border-primary/25 bg-[#090005]/88 p-4 text-center font-serif shadow-[0_0_28px_rgba(255,182,193,0.18)] backdrop-blur-xl"
        >
          <h2 className="text-xl text-primary drop-shadow-[0_0_10px_rgba(255,182,193,0.55)] sm:text-2xl">
            عداد الحب
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-primary/55 sm:text-sm">
            عرفتك من {time.days} يوم و {time.hours} ساعة
          </p>

          <div className="mt-4 flex w-full flex-wrap justify-center gap-2">
            <CounterBox value={time.days} label="يوم" delay={0.05} />
            <CounterBox value={time.hours} label="ساعة" delay={0.15} />
            <CounterBox value={time.minutes} label="دقيقة" delay={0.25} />
            <CounterBox value={time.seconds} label="ثانية" delay={0.35} />
          </div>

          <motion.div
            animate={{ scale: [1, 1.22, 1, 1.14, 1], opacity: [0.75, 1, 0.8, 0.95, 0.75] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-3 text-xl text-primary/80"
          >
            ❤
          </motion.div>

          <p className="mt-3 border-t border-primary/15 px-4 pt-3 text-xs leading-relaxed text-primary/45">
            بدأت من 2/27/2026 - 9:33 PM
          </p>
        </div>
      </Html>
    </group>
  );
};

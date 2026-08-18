import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Html, Float, Torus } from '@react-three/drei';
import { useMuseum } from '@/context/MuseumContext';
import { GIFT } from '@/lib/constants';

export const Room7 = ({ position }: { position: [number, number, number] }) => {
  const { currentRoom } = useMuseum();
  const isActive = currentRoom === 7;
  const [photoOk, setPhotoOk] = useState(true);

  if (!isActive) return null;

  return (
    <group position={position}>
      <pointLight color="#FFB6C1" distance={40} intensity={1.4} position={[0, 0, 3]} />

      <Float speed={1} rotationIntensity={0.25} floatIntensity={0.3}>
        <Torus args={[3.4, 0.03, 16, 96]}>
          <meshBasicMaterial color="#FFB6C1" transparent opacity={0.18} />
        </Torus>
      </Float>

      <Html center transform zIndexRange={[100, 0]} distanceFactor={11}>
        <div
          dir="rtl"
          className="flex w-[88vw] max-w-[440px] flex-col items-center gap-3 rounded-2xl border border-primary/25 bg-[#090005]/88 p-4 text-center font-serif shadow-[0_0_28px_rgba(255,182,193,0.18)] backdrop-blur-xl"
        >
          <h2 className="text-xl text-primary drop-shadow-[0_0_10px_rgba(255,182,193,0.55)] sm:text-2xl">
            {GIFT.title}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs leading-loose text-primary/90 sm:text-sm"
          >
            {GIFT.note}
          </motion.p>

          <motion.figure
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="m-0 flex w-full flex-col items-center gap-2"
          >
            <span className="text-[10px] text-primary/50 sm:text-xs">{GIFT.photoTitle}</span>

            <div className="relative flex h-[clamp(150px,26vh,240px)] w-full items-center justify-center overflow-hidden rounded-2xl border border-primary/35 bg-gradient-to-br from-[#1f0a18] to-[#0d0008] shadow-[0_0_26px_rgba(255,182,193,0.18)]">
              {photoOk ? (
                <img
                  src={GIFT.photo}
                  alt={GIFT.photoTitle}
                  onError={() => setPhotoOk(false)}
                  className="h-full w-full rounded-xl object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 text-primary/45">
                  <span className="text-3xl">🖼️</span>
                  <span className="text-[10px] sm:text-xs">{GIFT.placeholder}</span>
                </div>
              )}
            </div>

            <figcaption className="rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-[11px] leading-loose text-primary/80 sm:text-xs">
              {GIFT.caption}
            </figcaption>
          </motion.figure>
        </div>
      </Html>
    </group>
  );
};

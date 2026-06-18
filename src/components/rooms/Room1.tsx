import React from 'react';
import { Html, Float } from '@react-three/drei';
import { useMuseum } from '@/context/MuseumContext';

export const Room1 = ({ position }: { position: [number, number, number] }) => {
  const { currentRoom } = useMuseum();
  const isActive = currentRoom === 1;

  if (!isActive) return null;

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Html center transform zIndexRange={[100, 0]}>
          <div dir="rtl" className="grid w-[88vw] max-w-[420px] grid-cols-1 gap-3 rounded-[20px] border border-primary/25 bg-[#0a0207]/88 p-3 shadow-[0_0_18px_rgba(255,182,193,0.16)] backdrop-blur-xl pointer-events-none sm:grid-cols-[140px_minmax(0,1fr)]">
            <div className="order-2 flex min-h-[112px] items-center justify-center rounded-[18px] border border-primary/20 bg-[#120712]/85 p-3 sm:order-1">
              <div className="relative h-20 w-28 rounded-xl border border-primary/25 bg-[#08030a] shadow-[0_0_16px_rgba(255,182,193,0.12)]">
                <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
                  <span className="h-2 w-2 rounded-full bg-primary/70 shadow-[0_0_8px_rgba(255,182,193,0.8)]" />
                  <span className="text-[9px] text-primary/50">night shift</span>
                </div>
                <div className="absolute bottom-5 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border border-primary/35 bg-primary/15 text-center text-lg leading-8 text-primary">
                  O
                </div>
                <div className="absolute bottom-2 left-5 h-1 w-6 rounded-full bg-primary/25" />
                <div className="absolute bottom-2 right-5 h-1 w-6 rounded-full bg-primary/25" />
              </div>
            </div>
            <div className="order-1 min-w-0 space-y-1 text-right font-serif text-[11px] leading-snug text-foreground drop-shadow-[0_0_4px_rgba(255,255,255,0.3)] sm:order-2 sm:text-[12px]">
              <h2 className="mb-2 text-base text-primary">أول مرة</h2>
              <p className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 fill-mode-both">
                أول مره شفتها كانت دخلت سيرفر كنا بنلعب لعبة امبوستر.
              </p>
              <p className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-1000 fill-mode-both">
                وبعدها تاني مره شتمتها وكنت ساعتها مدايق، ومكنتش اعرف انها هتبقى كل حياتي.
              </p>
              <p className="text-primary text-base mt-2 animate-in fade-in slide-in-from-right-8 duration-1000 delay-1500 fill-mode-both">
                ده أول يوم في متحف حبنا.
              </p>
            </div>
          </div>
        </Html>
      </Float>
    </group>
  );
};

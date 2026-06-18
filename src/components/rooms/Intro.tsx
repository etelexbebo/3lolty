import React from 'react';
import { Html } from '@react-three/drei';
import { useMuseum } from '@/context/MuseumContext';

export const Intro = ({ position }: { position: [number, number, number] }) => {
  const { currentRoom, setCurrentRoom } = useMuseum();
  const isActive = currentRoom === 0;

  return (
    <group position={position}>
      {isActive && (
        <Html center transform zIndexRange={[100, 0]}>
          <div dir="rtl" className="flex w-[82vw] max-w-[340px] flex-col items-center justify-center rounded-[20px] border border-primary/30 bg-[#090005]/88 p-4 text-center shadow-[0_0_30px_rgba(255,182,193,0.2)] backdrop-blur-xl pointer-events-auto">
            <div className="mb-2 h-10 w-10 rounded-full border border-primary/45 bg-primary/15 shadow-[0_0_18px_rgba(255,182,193,0.3)]" />
            <h1 className="text-2xl font-serif text-primary drop-shadow-[0_0_8px_rgba(255,182,193,0.45)] animate-in fade-in zoom-in duration-1000 leading-tight">
              <span className="font-sans">Ola</span>
            </h1>
            <p className="mt-1 text-sm text-primary/75 font-serif animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both leading-snug">
              جمه علا
            </p>
            <p className="mt-3 text-[13px] text-primary/80 font-serif animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1200 fill-mode-both leading-relaxed">
              في ناس كتير دخلوا حياتي.. بس انتي حياتي كلها.
            </p>
            <button
              onClick={() => setCurrentRoom(1)}
              className="mt-4 rounded-full border border-primary/45 bg-primary/90 px-5 py-1.5 text-[12px] font-serif text-[#12030b] shadow-[0_0_14px_rgba(255,182,193,0.55)] transition-all duration-300 hover:scale-105 hover:bg-primary animate-in fade-in duration-1000 delay-2000 fill-mode-both"
            >
              ادخل
            </button>
          </div>
        </Html>
      )}
    </group>
  );
};

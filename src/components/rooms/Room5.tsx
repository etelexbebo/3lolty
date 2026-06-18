import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import { useMuseum } from '@/context/MuseumContext';
import { LOVE_REASONS } from '@/lib/constants';

const ClickableStar = ({ position, reason, index }: { position: [number, number, number]; reason: string; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const meshRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const pulse = Math.sin(clock.getElapsedTime() * 2.7 + index) * 0.16;
    meshRef.current.scale.setScalar(1 + pulse + (hovered || clicked ? 0.55 : 0));
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e: any) => {
          e.stopPropagation();
          setClicked(!clicked);
        }}
      >
        <sphereGeometry args={[hovered || clicked ? 0.24 : 0.13, 16, 16]} />
        <meshBasicMaterial color={hovered || clicked ? '#ffffff' : '#FFB6C1'} />
      </mesh>

      {clicked && (
        <Html center zIndexRange={[100, 0]} distanceFactor={18}>
          <div
            dir="rtl"
            className="pointer-events-none mt-7 w-52 rounded-lg border border-primary/40 bg-black/82 p-3 text-center font-serif shadow-[0_0_18px_rgba(255,182,193,0.24)] backdrop-blur-md animate-in zoom-in fade-in duration-300"
          >
            <div className="mb-1 text-[10px] text-primary/45">
              نجمة {index + 1}
            </div>
            <p className="text-xs leading-relaxed text-primary">
              {reason}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
};

export const Room5 = ({ position }: { position: [number, number, number] }) => {
  const { currentRoom } = useMuseum();
  const isActive = currentRoom === 5;

  const starPositions = useMemo(() => {
    return LOVE_REASONS.map((_, i) => {
      const radius = 7.5 + (i % 5) * 1.7;
      const theta = i * 2.399963229728653;
      const y = ((i % 9) - 4) * 0.85;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      return [x, y, z] as [number, number, number];
    });
  }, []);

  if (!isActive) return null;

  return (
    <group position={position}>
      {LOVE_REASONS.map((reason, i) => (
        <ClickableStar key={reason} position={starPositions[i]} reason={reason} index={i} />
      ))}

      <Float speed={1} floatIntensity={0.2}>
        <Html center transform zIndexRange={[70, 0]}>
          <div
            dir="rtl"
            className="pointer-events-none flex w-[84vw] max-w-[360px] flex-col items-center text-center font-serif"
          >
            <h2 className="text-xl text-primary/80 drop-shadow-[0_0_10px_rgba(255,182,193,0.55)]">
              النجوم
            </h2>
            <p className="mt-2 border-t border-primary/15 px-4 pt-2 text-xs leading-relaxed text-primary/50">
              كل نجمة عليها سبب من أسباب حبي ليكي
            </p>
          </div>
        </Html>
      </Float>
    </group>
  );
};

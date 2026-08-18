import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import { useMuseum } from '@/context/MuseumContext';
import { LOVE_REASONS } from '@/lib/constants';

const ClickableStar = ({
  position,
  index,
  selected,
  onSelect,
  onBack,
}: {
  position: [number, number, number];
  index: number;
  selected: boolean;
  onSelect: () => void;
  onBack: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<any>(null);
  const hitRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const pulse = Math.sin(clock.getElapsedTime() * 2.7 + index) * 0.16;
    meshRef.current.scale.setScalar(1 + pulse + (hovered || selected ? 0.55 : 0));
  });

  const activate = (e: any) => {
    e.stopPropagation();
    // stars overlap on screen: only the frontmost one reacts
    if (e.intersections?.[0]?.object !== hitRef.current) return;
    if (selected) onBack();
    else onSelect();
  };

  return (
    <group position={position}>
      {/* generous invisible hit area so stars are tappable on phones */}
      <mesh
        ref={hitRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={activate}
      >
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={meshRef} raycast={() => null}>
        <sphereGeometry args={[hovered || selected ? 0.24 : 0.13, 16, 16]} />
        <meshBasicMaterial color={hovered || selected ? '#ffffff' : '#FFB6C1'} />
      </mesh>
    </group>
  );
};

export const Room5 = ({ position }: { position: [number, number, number] }) => {
  const { currentRoom, setFocusTarget } = useMuseum();
  const isActive = currentRoom === 5;
  const [selected, setSelected] = useState<number | null>(null);

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

  const select = (i: number | null) => {
    setSelected(i);
    setFocusTarget(
      i === null
        ? null
        : [
            position[0] + starPositions[i][0],
            position[1] + starPositions[i][1],
            position[2] + starPositions[i][2],
          ]
    );
  };

  // leaving the room releases the camera
  useEffect(() => {
    if (!isActive) {
      setSelected(null);
      setFocusTarget(null);
    }
  }, [isActive, setFocusTarget]);

  if (!isActive) return null;

  return (
    <group position={position}>
      {LOVE_REASONS.map((reason, i) => (
        <ClickableStar
          key={reason}
          position={starPositions[i]}
          index={i}
          selected={selected === i}
          onSelect={() => select(i)}
          onBack={() => select(null)}
        />
      ))}

      {selected !== null && (
        <Html
          center
          position={starPositions[selected]}
          zIndexRange={[100, 0]}
          onOcclude={() => {}}
        >
          <div
            dir="rtl"
            className="mt-28 w-[86vw] max-w-[340px] rounded-xl border border-primary/40 bg-black/85 p-4 text-center font-serif shadow-[0_0_24px_rgba(255,182,193,0.26)] backdrop-blur-md animate-in fade-in zoom-in duration-500"
          >
            <div className="mb-1 text-[10px] text-primary/45">
              نجمة {selected + 1}
            </div>
            <p className="text-sm leading-relaxed text-primary">
              {LOVE_REASONS[selected]}
            </p>
            <button
              onClick={() => select(null)}
              className="mt-3 rounded-full border border-primary/45 bg-primary/10 px-4 py-2 text-xs text-primary transition-colors hover:bg-primary/20"
            >
              ↶ ارجع واختار نجمة تانية
            </button>
          </div>
        </Html>
      )}

      {selected === null && (
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
      )}
    </group>
  );
};

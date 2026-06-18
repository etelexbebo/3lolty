import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, Sphere } from '@react-three/drei';
import { useMuseum } from '@/context/MuseumContext';
import { MEMORIES } from '@/lib/constants';

const MemoryObject = ({ memory, index, total }: { memory: any; index: number; total: number }) => {
  const { setModalContent, setActiveModal } = useMuseum();
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<any>(null);
  
  const angle = (index / total) * Math.PI * 2;
  const radius = 6;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * (hovered ? 0.1 : 0.3) + angle;
      groupRef.current.position.x = Math.cos(t) * radius;
      groupRef.current.position.z = Math.sin(t) * radius;
      groupRef.current.rotation.y = -t;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh 
          onClick={(e: any) => {
            e.stopPropagation();
            setActiveModal('memory');
            setModalContent({ ...memory, index: index + 1, total });
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[2.4, 3.2]} />
          <meshBasicMaterial color={hovered ? '#FFC0CB' : '#1a0a12'} transparent opacity={0.92} />
          
          <Html center transform zIndexRange={[100, 0]} distanceFactor={15}>
            <div className={`transition-all duration-300 pointer-events-none flex h-[112px] w-[116px] flex-col items-center justify-center rounded-lg border bg-black/60 p-2 text-center backdrop-blur-md ${hovered ? 'scale-110 border-primary shadow-[0_0_12px_rgba(255,182,193,0.4)]' : 'border-primary/20'}`}>
              <div className="text-xl text-primary/80">{memory.emoji}</div>
              <div className="mt-1 text-[10px] leading-tight text-primary/70">ذكرى {index + 1}</div>
              <div className="mt-0.5 max-w-[88px] text-xs leading-tight text-primary/50">{memory.title}</div>
              <div className="mt-1 line-clamp-2 max-w-[92px] text-[9px] leading-snug text-primary/35">{memory.text}</div>
            </div>
          </Html>
        </mesh>
      </Float>
    </group>
  );
};

export const Room2 = ({ position }: { position: [number, number, number] }) => {
  const { currentRoom } = useMuseum();
  const isActive = currentRoom === 2;

  if (!isActive) return null;

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[2.4, 64, 64]}>
          <meshBasicMaterial color="#FFB6C1" wireframe transparent opacity={0.18} />
        </Sphere>
        <Sphere args={[2.1, 64, 64]}>
          <meshStandardMaterial color="#0a0005" emissive="#3a0a1a" emissiveIntensity={0.55} />
        </Sphere>
        <Html center>
          <div className="text-2xl text-primary font-serif drop-shadow-[0_0_10px_rgba(255,182,193,0.5)] pointer-events-none">
            O
          </div>
        </Html>
      </Float>

      <Html center transform zIndexRange={[50, 0]} position={[0, -3.2, 0]}>
        <div dir="rtl" className="text-center max-w-[350px] pointer-events-none space-y-1">
          <div className="text-lg text-primary font-serif">الذكريات</div>
          <div className="text-xs text-primary/60">كل ذكرى بتلف حوالين القمر وتفتح تفاصيلها</div>
        </div>
      </Html>

      {MEMORIES.map((memory, i) => (
        <MemoryObject key={memory.title} memory={memory} index={i} total={MEMORIES.length} />
      ))}
    </group>
  );
};

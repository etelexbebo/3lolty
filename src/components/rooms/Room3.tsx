import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, Sphere } from '@react-three/drei';
import { useMuseum } from '@/context/MuseumContext';
import { MESSAGES } from '@/lib/constants';

const MessageLetter = ({ message, index, total }: { message: any; index: number; total: number }) => {
  const { setModalContent, setActiveModal } = useMuseum();
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<any>(null);

  const angle = (index / total) * Math.PI * 2;
  const radius = 6.5;
  const openMessage = () => {
    setActiveModal('message');
    setModalContent({ ...message, position: index, index: index + 1, total });
  };

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const t = clock.getElapsedTime() * (hovered ? 0.08 : 0.24) + angle;
    groupRef.current.position.x = Math.cos(t) * radius;
    groupRef.current.position.y = Math.sin(t * 1.35 + index) * 0.55;
    groupRef.current.position.z = Math.sin(t) * radius;
    groupRef.current.rotation.y = -t;
    groupRef.current.scale.setScalar(hovered ? 1.12 : 1);
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.14} floatIntensity={0.28}>
        <mesh
          onClick={(e: any) => {
            e.stopPropagation();
            openMessage();
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[2.2, 1.55]} />
          <meshBasicMaterial color={hovered ? '#FFC0CB' : '#170711'} transparent opacity={0.94} />

          <Html center transform zIndexRange={[100, 0]} distanceFactor={14}>
            <div
              dir="rtl"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                openMessage();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openMessage();
                }
              }}
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
              className={`pointer-events-auto flex h-[86px] w-[122px] cursor-pointer flex-col justify-between rounded-lg border bg-[#11040c]/85 p-2 text-right font-serif backdrop-blur-md transition-all duration-300 ${
                hovered
                  ? 'border-primary shadow-[0_0_18px_rgba(255,182,193,0.5)]'
                  : 'border-primary/25 shadow-[0_0_10px_rgba(255,182,193,0.12)]'
              }`}
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 16px, rgba(255,182,193,0.05) 16px, rgba(255,182,193,0.05) 17px)',
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] leading-none text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="truncate text-[9px] text-primary/45">
                  {message.date}
                </span>
              </div>
              <p className="line-clamp-2 text-[10px] leading-snug text-primary/70">
                {message.text}
              </p>
              <span className="text-[9px] text-primary/35">
                جواب قديم
              </span>
            </div>
          </Html>
        </mesh>
      </Float>
    </group>
  );
};

export const Room3 = ({ position }: { position: [number, number, number] }) => {
  const { currentRoom } = useMuseum();
  const isActive = currentRoom === 3;

  if (!isActive) return null;

  return (
    <group position={position}>
      <Float speed={1.3} rotationIntensity={0.45} floatIntensity={0.7}>
        <Sphere args={[2.35, 64, 64]}>
          <meshBasicMaterial color="#FFB6C1" wireframe transparent opacity={0.16} />
        </Sphere>
        <Sphere args={[2.02, 64, 64]}>
          <meshStandardMaterial color="#0a0005" emissive="#3a0a1a" emissiveIntensity={0.52} />
        </Sphere>
        <Html center>
          <div className="pointer-events-none font-serif text-2xl text-primary drop-shadow-[0_0_10px_rgba(255,182,193,0.55)]">
            O
          </div>
        </Html>
      </Float>

      <Html center transform zIndexRange={[70, 0]} position={[0, 3.35, 0]}>
        <div dir="rtl" className="pointer-events-none flex w-[84vw] max-w-[360px] flex-col items-center text-center font-serif">
          <h2 className="text-xl text-primary drop-shadow-[0_0_10px_rgba(255,182,193,0.55)]">
            الرسائل
          </h2>
          <p className="mt-1 text-[10px] leading-tight text-primary/45">
            اضغط على رقم الرسالة
          </p>
        </div>
      </Html>

      {MESSAGES.map((message, i) => (
        <MessageLetter key={`${message.date}-${i}`} message={message} index={i} total={MESSAGES.length} />
      ))}
    </group>
  );
};

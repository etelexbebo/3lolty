import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import { useMuseum } from '@/context/MuseumContext';
import * as THREE from 'three';

export const Room6 = ({ position }: { position: [number, number, number] }) => {
  const { currentRoom, setActiveModal } = useMuseum();
  const isActive = currentRoom === 6;
  const [hovered, setHovered] = useState(false);
  const [opened, setOpened] = useState(false);
  
  const doorGroup = useRef<any>(null);
  const lightRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (!doorGroup.current) return;
    
    // Animate door opening
    if (opened && doorGroup.current.rotation.y < Math.PI / 2) {
      doorGroup.current.rotation.y += delta * 1.5;
    }
    
    if (lightRef.current) {
      if (opened) {
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 10, 0.05);
      } else {
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, hovered ? 2 : 0.5, 0.1);
      }
    }
  });

  const handleDoorClick = (e: any) => {
    e.stopPropagation();
    if (!opened) {
      setOpened(true);
      setTimeout(() => {
        setActiveModal('final');
      }, 1500); // Wait for door to open before showing modal
    }
  };

  if (!isActive) return null;

  return (
    <group position={position}>
      <pointLight ref={lightRef} color="#FFB6C1" distance={50} intensity={0.5} position={[0, 0, 2]} />
      
      {/* Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.4, 7.4, 0.4]} />
        <meshStandardMaterial color="#11050a" />
      </mesh>

      {/* Door Hinge Group */}
      <group ref={doorGroup} position={[-1.7, 0, 0.2]}>
        {/* Door Mesh */}
        <mesh 
          position={[1.7, 0, 0]} 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handleDoorClick}
        >
          <boxGeometry args={[3, 7, 0.2]} />
          <meshStandardMaterial 
            color={hovered ? "#2a0a1a" : "#1a0510"} 
            emissive={hovered ? "#3a0a1a" : "#000"}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {!opened && (
          <Html position={[2, 0, 0.11]} center transform zIndexRange={[100, 0]}>
            <div dir="rtl" className={`text-center transition-all duration-500 ${hovered ? 'scale-110 drop-shadow-[0_0_12px_rgba(255,182,193,0.7)]' : 'drop-shadow-[0_0_4px_rgba(255,182,193,0.2)]'} pointer-events-none`}>
              <h2 className="text-xl text-primary font-serif mb-2">
                ممنوع الدخول إلا ليكي
              </h2>
              <p className="text-sm text-primary/60 font-serif">
                هل أنتِ هي؟
              </p>
            </div>
          </Html>
        )}
      </group>

      {/* Doorway glow behind the door */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[4, 8]} />
        <meshBasicMaterial color="#FFB6C1" transparent opacity={opened ? 1 : 0} />
      </mesh>
    </group>
  );
};

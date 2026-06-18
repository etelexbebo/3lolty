import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useMuseum } from '@/context/MuseumContext';
import { ROOM_Z_SPACING } from '@/lib/constants';

import { CameraController } from './CameraController';
import { Particles } from './Particles';
import { Intro } from './rooms/Intro';
import { Room1 } from './rooms/Room1';
import { Room2 } from './rooms/Room2';
import { Room3 } from './rooms/Room3';
import { Room4 } from './rooms/Room4';
import { Room5 } from './rooms/Room5';
import { Room6 } from './rooms/Room6';

const Experience = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#0a0005']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#FFB6C1" />

      <CameraController />
      
      {/* Global Elements */}
      <Particles count={300} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Rooms - Positioned along Z axis */}
      <Intro position={[0, 0, 0 * ROOM_Z_SPACING]} />
      <Room1 position={[0, 0, 1 * ROOM_Z_SPACING]} />
      <Room2 position={[0, 0, 2 * ROOM_Z_SPACING]} />
      <Room3 position={[0, 0, 3 * ROOM_Z_SPACING]} />
      <Room4 position={[0, 0, 4 * ROOM_Z_SPACING]} />
      <Room5 position={[0, 0, 5 * ROOM_Z_SPACING]} />
      <Room6 position={[0, 0, 6 * ROOM_Z_SPACING]} />

      <EffectComposer>

        <Bloom 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          intensity={1.5} 
          mipmapBlur 
        />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};

export default Experience;

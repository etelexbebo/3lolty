import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMuseum } from '@/context/MuseumContext';
import * as THREE from 'three';

const ROOM_Z_SPACING = -30;

export const CameraController = () => {
  const { currentRoom } = useMuseum();
  const vec = new THREE.Vector3();

  useFrame((state) => {
    // Target position based on current room
    const targetZ = currentRoom * ROOM_Z_SPACING;
    const targetY = 0; // could vary if we want
    
    vec.set(0, targetY, targetZ + 10); // Offset camera back a bit from the room center
    
    state.camera.position.lerp(vec, 0.05);
    // state.camera.lookAt(0, targetY, targetZ);
  });

  return null;
};

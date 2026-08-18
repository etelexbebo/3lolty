import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMuseum } from '@/context/MuseumContext';
import * as THREE from 'three';

const ROOM_Z_SPACING = -30;
/** How far the camera stops in front of a focused star. */
const FOCUS_DISTANCE = 4.6;

export const CameraController = () => {
  const { currentRoom, focusTarget } = useMuseum();

  const home = useRef(new THREE.Vector3());
  const star = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3());
  const desiredLook = useRef(new THREE.Vector3());
  const lookMatrix = useRef(new THREE.Matrix4());
  const desiredQuat = useRef(new THREE.Quaternion());

  useFrame((state, delta) => {
    const roomZ = currentRoom * ROOM_Z_SPACING;
    home.current.set(0, 0, roomZ + 10);

    if (focusTarget) {
      star.current.set(focusTarget[0], focusTarget[1], focusTarget[2]);
      desiredPos.current
        .copy(home.current)
        .sub(star.current)
        .normalize()
        .multiplyScalar(FOCUS_DISTANCE)
        .add(star.current);
      desiredLook.current.copy(star.current);
    } else {
      desiredPos.current.copy(home.current);
      desiredLook.current.set(0, 0, roomZ - 10);
    }

    // framerate-independent smoothing
    const t = Math.min(1, 1 - Math.pow(0.015, delta));

    state.camera.position.lerp(desiredPos.current, t);

    // Matrix4.lookAt uses the camera convention (-Z towards the target)
    lookMatrix.current.lookAt(
      state.camera.position,
      desiredLook.current,
      state.camera.up
    );
    desiredQuat.current.setFromRotationMatrix(lookMatrix.current);
    state.camera.quaternion.slerp(desiredQuat.current, t);
  });

  return null;
};

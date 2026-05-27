"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image as DreiImage, Float } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";

// Define the 3 positions in space
const SLOTS = [
  // Slot 0: Front (Right)
  { pos: [0.8, 0.5, 0.8], scale: [3.5, 4.5], op: 1.0, gray: 0.4, color: "#ffffff" },
  // Slot 1: Middle (Left)
  { pos: [-1, -1, 0.2], scale: [3, 4], op: 0.6, gray: 0.0, color: "#bdf532" },
  // Slot 2: Back (Center)
  { pos: [0, 0, -0.5], scale: [4.5, 6], op: 0.4, gray: 0.0, color: "#e4c278" },
];

function ShufflingImage({ url, slotIndex }: { url: string; slotIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Keep track of the initial slot to avoid popping from [0,0,0] on first render
  const [initialSlot] = useState(slotIndex);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const target = SLOTS[slotIndex];

    // Smoothly animate position
    easing.damp3(meshRef.current.position, target.pos as [number, number, number], 0.5, delta);

    // DreiImage internally applies the scale prop. We must animate the mesh's scale to match.
    easing.damp3(meshRef.current.scale, [target.scale[0], target.scale[1], 1], 0.5, delta);

    // Smoothly animate material properties (opacity, grayscale, color tint)
    if (meshRef.current.material) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mat = meshRef.current.material as any;
      easing.damp(mat, "opacity", target.op, 0.5, delta);
      easing.damp(mat, "grayscale", target.gray, 0.5, delta);
      easing.dampC(mat.color, target.color, 0.5, delta);
    }
  });

  return (
    <DreiImage
      ref={meshRef}
      url={url}
      transparent
      position={SLOTS[initialSlot].pos as [number, number, number]}
      scale={[SLOTS[initialSlot].scale[0], SLOTS[initialSlot].scale[1]]}
    />
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const [order, setOrder] = useState(0);

  // Cycle the images every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setOrder((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Subtle mouse parallax tracking for the entire cluster
  useFrame((state, delta) => {
    if (!group.current) return;
    const { pointer } = state;
    easing.dampE(
      group.current.rotation,
      [pointer.y * 0.15, pointer.x * -0.15, 0],
      0.2,
      delta
    );
  });

  return (
    <group ref={group} scale={0.85}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <ShufflingImage url="/images/Abhinav/photo-1.png" slotIndex={(0 + order) % 3} />
        <ShufflingImage url="/images/Abhinav/photo-2.png" slotIndex={(1 + order) % 3} />
        <ShufflingImage url="/images/Abhinav/photo-3.png" slotIndex={(2 + order) % 3} />
      </Float>

      {/* Decorative grid plane */}
      <gridHelper args={[20, 40, "#4d4639", "#221f1a"]} position={[0, -3.5, -2]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

export function Hero3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-10 select-none pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <Scene />
      </Canvas>
    </div>
  );
}

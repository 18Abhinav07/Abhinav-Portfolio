"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image as DreiImage, Float, Sparkles, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";

function Hero3DReadyGate() {
  const { active, progress } = useProgress();
  const fired = useRef(false);
  useEffect(() => {
    if (!active && progress === 100 && !fired.current) {
      fired.current = true;
      window.dispatchEvent(new CustomEvent("hero3d:ready"));
    }
  }, [active, progress]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!fired.current) {
        fired.current = true;
        window.dispatchEvent(new CustomEvent("hero3d:ready"));
      }
    }, 3000);
    return () => clearTimeout(t);
  }, []);
  return null;
}

// The 3 positions in space. Kept to the right half and sized so the photos sit
// beside the headline instead of filling the screen behind it.
const SLOTS = [
  // Slot 0: Front
  { pos: [2.9, 0.1, 1], scale: [2.6, 3.4], op: 0.95, gray: 0.15, color: "#ffffff" },
  // Slot 1: Middle
  { pos: [1.2, -0.6, -0.5], scale: [2.1, 2.8], op: 0.45, gray: 0.5, color: "#bdf532" },
  // Slot 2: Back
  { pos: [4.2, 1.1, -2], scale: [2.8, 3.7], op: 0.2, gray: 0.8, color: "#e4c278" },
];

function ShufflingImage({ url, slotIndex }: { url: string; slotIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [initialSlot] = useState(slotIndex);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const target = SLOTS[slotIndex];

    easing.damp3(meshRef.current.position, target.pos as [number, number, number], 0.8, delta);
    easing.damp3(meshRef.current.scale, [target.scale[0], target.scale[1], 1], 0.8, delta);

    if (meshRef.current.material) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mat = meshRef.current.material as any;
      easing.damp(mat, "opacity", target.op, 0.8, delta);
      easing.damp(mat, "grayscale", target.gray, 0.8, delta);
      easing.dampC(mat.color, target.color, 0.8, delta);
    }
  });

  return (
    <DreiImage
      ref={meshRef}
      url={url}
      transparent
      toneMapped={false}
      position={SLOTS[initialSlot].pos as [number, number, number]}
      scale={[SLOTS[initialSlot].scale[0], SLOTS[initialSlot].scale[1]]}
    />
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const [order, setOrder] = useState(0);
  // A portrait screen only sees a narrow slice of the slots, which puts the
  // photos behind the copy. Push them toward the right edge and shrink them there.
  const portrait = useThree((s) => s.viewport.aspect < 0.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrder((prev) => (prev + 1) % 3);
    }, 5000); // Faster shuffle for more kinetic energy
    return () => clearInterval(interval);
  }, []);

  // Aggressive mouse parallax tracking
  useFrame((state, delta) => {
    if (!group.current) return;
    const { pointer } = state;
    // Rotate based on mouse, but keep it smooth
    easing.dampE(
      group.current.rotation,
      [pointer.y * 0.2, pointer.x * -0.2, 0],
      0.25,
      delta
    );
    // Translate slightly based on mouse
    easing.damp3(
      group.current.position,
      [pointer.x * 0.5, pointer.y * 0.5, 0],
      0.25,
      delta
    );
  });

  return (
    <group ref={group}>
      <group position={portrait ? [0.3, 0.4, 0] : [0, 0, 0]} scale={portrait ? 0.7 : 1}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <ShufflingImage url="/images/Abhinav/photo-1.png" slotIndex={(0 + order) % 3} />
          <ShufflingImage url="/images/Abhinav/photo-2.png" slotIndex={(1 + order) % 3} />
          <ShufflingImage url="/images/Abhinav/photo-3.png" slotIndex={(2 + order) % 3} />
        </Float>
      </group>

      {/* Volumetric Depth: Floating dust/sparks */}
      <Sparkles count={150} scale={12} size={2} speed={0.4} opacity={0.3} color="#BFFF00" />
      <Sparkles count={50} scale={15} size={4} speed={0.2} opacity={0.2} color="#000000" />
      
      {/* Immersive base lighting for light theme */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#FAFF00" />
    </group>
  );
}

export function Hero3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    // CRITICAL: Removed pointer-events-none so mouse parallax actually works!
    <div className="absolute inset-0 z-0 select-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
        <Hero3DReadyGate />
      </Canvas>
    </div>
  );
}

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, Environment } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Mesh } from "three";

function Specimen() {
  const ref = useRef<Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.15 + mouse.current.y * 0.02;
    ref.current.rotation.y += delta * 0.2 + mouse.current.x * 0.02;
  });
  return (
    <Float speed={1.3} rotationIntensity={0.6} floatIntensity={1.4}>
      <Icosahedron ref={ref} args={[1.6, 4]}>
        <MeshDistortMaterial
          color="#fbbf24"
          emissive="#7a4a00"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.85}
          distort={0.42}
          speed={1.6}
        />
      </Icosahedron>
      <Icosahedron args={[2.2, 1]}>
        <meshBasicMaterial color="#fbbf24" wireframe transparent opacity={0.12} />
      </Icosahedron>
    </Float>
  );
}

export function Hero3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 5]} intensity={1.6} color="#fbbf24" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#ffffff" />
      <Specimen />
      <Environment preset="city" />
    </Canvas>
  );
}
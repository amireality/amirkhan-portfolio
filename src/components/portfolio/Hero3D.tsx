import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useRef, useState, Suspense } from "react";
import { AdditiveBlending, BackSide, type Group, type Mesh } from "three";

const EARTH_TEXTURE_URL =
  "https://unpkg.com/three-globe@2.31.1/example/img/earth-dark.jpg";

function Globe() {
  const group = useRef<Group>(null);
  const earth = useRef<Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const texture = useTexture(EARTH_TEXTURE_URL);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (earth.current) {
      earth.current.rotation.y += delta * 0.12;
    }
    if (group.current) {
      const targetX = mouse.current.y * 0.35;
      const targetY = mouse.current.x * 0.5;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* Earth sphere — grayscale texture */}
      <mesh ref={earth}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          color="#ffffff"
          emissive="#1a1a1a"
          emissiveIntensity={0.4}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Wireframe shell */}
      <mesh>
        <sphereGeometry args={[1.615, 48, 48]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} />
      </mesh>
      {/* Inner glow atmosphere */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          side={BackSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Outer glow atmosphere */}
      <mesh scale={1.22}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.06}
          side={BackSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
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
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#ffffff" />
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#ffffff" />
      <Suspense fallback={null}>
        <Globe />
      </Suspense>
    </Canvas>
  );
}
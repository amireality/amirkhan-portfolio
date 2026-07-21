import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import {
  AdditiveBlending,
  BackSide,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from "three";

const EARTH_TEXTURE_URL =
  "https://unpkg.com/three-globe@2.31.1/example/img/earth-dark.jpg";
const CLOUDS_TEXTURE_URL =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/earth_clouds_1024.png";

const GLOBE_RADIUS = 1.6;

const INDIA_CITIES: Array<{ name: string; lat: number; lng: number }> = [
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
];

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function CityMarker({ position, phase }: { position: Vector3; phase: number }) {
  const dot = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + phase;
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
    if (dot.current) {
      const mat = dot.current.material as MeshBasicMaterial;
      mat.opacity = 0.7 + pulse * 0.3;
      const s = 1 + pulse * 0.25;
      dot.current.scale.setScalar(s);
    }
    if (halo.current) {
      const mat = halo.current.material as MeshBasicMaterial;
      mat.opacity = 0.35 * (1 - pulse);
      const s = 1 + pulse * 2.2;
      halo.current.scale.setScalar(s);
    }
  });
  return (
    <group position={position}>
      <mesh ref={dot}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={1} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Globe() {
  const group = useRef<Group>(null);
  const earth = useRef<Mesh>(null);
  const clouds = useRef<Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [earthMap, cloudsMap] = useTexture([EARTH_TEXTURE_URL, CLOUDS_TEXTURE_URL]);

  const cityPositions = useMemo(
    () =>
      INDIA_CITIES.map((c, i) => ({
        position: latLngToVec3(c.lat, c.lng, GLOBE_RADIUS * 1.005),
        phase: i * 0.7,
      })),
    [],
  );

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
      earth.current.rotation.y += delta * 0.08;
    }
    if (clouds.current) {
      clouds.current.rotation.y += delta * 0.11;
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
      {/* Earth sphere, grayscale, self-lit continents for visibility */}
      <mesh ref={earth}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={earthMap}
          emissiveMap={earthMap}
          color="#d8d8d8"
          emissive="#ffffff"
          emissiveIntensity={0.9}
          roughness={0.85}
          metalness={0.05}
        />
        {/* City markers ride with the earth's rotation */}
        {cityPositions.map((c, i) => (
          <CityMarker key={i} position={c.position} phase={c.phase} />
        ))}
      </mesh>
      {/* Cloud layer, grey, slightly faster rotation */}
      <mesh ref={clouds}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.015, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          alphaMap={cloudsMap}
          transparent
          opacity={0.55}
          color="#9a9a9a"
          emissive="#666666"
          emissiveIntensity={0.25}
          depthWrite={false}
        />
      </mesh>
      {/* Inner glow atmosphere */}
      <mesh scale={1.08}>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
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
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
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
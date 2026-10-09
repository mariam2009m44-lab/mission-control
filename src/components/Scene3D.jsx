import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html, useTexture } from '@react-three/drei';
import { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ========== SPACECRAFT 3D MODEL ==========
function Spacecraft({ position = [0, 0, 0], color = '#00d4ff' }) {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Main body - cylinder */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.6, 2.5, 16]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Nose cone */}
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.5, 0.8, 16]} />
        <meshStandardMaterial color="#cc3333" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Cockpit window */}
      <mesh position={[0, 0.6, 0.51]}>
        <circleGeometry args={[0.25, 16]} />
        <meshStandardMaterial color="#0a0e1a" emissive={color} emissiveIntensity={0.8} />
      </mesh>

      {/* Solar panels */}
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.05, 0.8]} />
        <meshStandardMaterial color="#1a3a6e" metalness={0.9} roughness={0.2} emissive="#2a5aa0" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[1.8, 0.05, 0.8]} />
        <meshStandardMaterial color="#1a3a6e" metalness={0.9} roughness={0.2} emissive="#2a5aa0" emissiveIntensity={0.2} />
      </mesh>

      {/* Fins */}
      <mesh position={[0.6, -1, 0]}>
        <boxGeometry args={[0.05, 0.6, 0.8]} />
        <meshStandardMaterial color="#cc3333" />
      </mesh>
      <mesh position={[-0.6, -1, 0]}>
        <boxGeometry args={[0.05, 0.6, 0.8]} />
        <meshStandardMaterial color="#cc3333" />
      </mesh>

      {/* Engine glow */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#555" metalness={0.9} />
      </mesh>
      <mesh position={[0, -1.8, 0]}>
        <coneGeometry args={[0.35, 0.8, 16]} />
        <meshStandardMaterial color="#ff8800" emissive="#ff4400" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ========== PLANET ==========
function Planet({ position, size, color, name, hasRing, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick && onClick(name); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Ring (for Saturn) */}
      {hasRing && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[size * 1.4, size * 2, 64]} />
          <meshBasicMaterial color="#d4b886" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      )}

      {/* Name label */}
      <Html position={[0, size + 0.5, 0]} center>
        <div className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${hovered ? 'bg-white/20 text-white' : 'bg-black/50 text-gray-300'}`}>
          {name}
        </div>
      </Html>

      {/* Hover info */}
      {hovered && (
        <Html position={[0, size + 1.2, 0]} center>
          <div className="bg-black/90 border border-white/20 rounded-xl p-2 text-center text-[10px] text-white">
            <div className="font-bold">{name}</div>
            <div className="text-gray-400 text-[9px]">Click to explore</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ========== SUN ==========
function Sun() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={[-8, 2, -5]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffdd44" />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffdd88" distance={40} />
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ========== MAIN SCENE ==========
export default function Scene3D({ onClose, onPlanetClick }) {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const handlePlanetClick = (name) => {
    setSelectedPlanet(name);
    onPlanetClick && onPlanetClick(name);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-space-danger/20 border border-space-danger/50 text-space-danger rounded-lg text-sm font-bold backdrop-blur-md"
      >
        ✕ Close 3D View
      </button>

      {/* Info banner */}
      <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-xs text-gray-300 backdrop-blur-md">
        🖱️ Drag to rotate · Scroll to zoom · Click planets
      </div>

      {/* Canvas */}
      <Canvas camera={{ position: [0, 3, 12], fov: 60 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />

          {/* Stars background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          {/* Sun */}
          <Sun />

          {/* Spacecraft */}
          <Spacecraft position={[0, 0, 0]} color="#00d4ff" />

          {/* Planets */}
          <Planet position={[5, 1, -3]} size={0.8} color="#2d7fc4" name="Earth" onClick={handlePlanetClick} />
          <Planet position={[7, -1, 2]} size={0.6} color="#c1440e" name="Mars" onClick={handlePlanetClick} />
          <Planet position={[-5, -2, 3]} size={1.2} color="#d4b886" name="Saturn" hasRing onClick={handlePlanetClick} />
          <Planet position={[-4, 2, 4]} size={0.4} color="#aaaaaa" name="Moon" onClick={handlePlanetClick} />
          <Planet position={[3, -3, 5]} size={1} color="#e5c896" name="Jupiter" onClick={handlePlanetClick} />

          {/* Camera controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={40}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

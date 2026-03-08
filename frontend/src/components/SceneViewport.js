import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Grid, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function CameraController({ hasSelection }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(5, hasSelection ? 4.5 : 5, hasSelection ? 7 : 8);
  }, [camera, hasSelection]);

  return null;
}

function SelectionIndicator({ object }) {
  const ringRef = useRef(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.9;
    }
  });

  return (
    <mesh
      ref={ringRef}
      position={[object.position.x, object.position.y + 0.02, object.position.z]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.78, 0.92, 48]} />
      <meshBasicMaterial color="#fff3c4" side={THREE.DoubleSide} transparent opacity={0.85} />
    </mesh>
  );
}

function SceneObject({ object, isSelected, onSelect }) {
  return (
    <group>
      <mesh
        position={[object.position.x, object.position.y, object.position.z]}
        rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
        scale={[object.scale.x, object.scale.y, object.scale.z]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(object.id);
        }}
        castShadow
        receiveShadow
      >
        {object.type === 'sphere' ? (
          <sphereGeometry args={[0.5, 32, 32]} />
        ) : (
          <boxGeometry args={[1, 1, 1]} />
        )}
        <meshStandardMaterial
          color={object.color}
          emissive={isSelected ? '#fff4d1' : '#000000'}
          emissiveIntensity={isSelected ? 0.28 : 0}
          roughness={0.38}
          metalness={0.12}
        />
      </mesh>
      {isSelected ? <SelectionIndicator object={object} /> : null}
    </group>
  );
}

export default function SceneViewport({ objects, selectedId, onSelect }) {
  return (
    <Canvas
      camera={{ position: [5, 5, 8], fov: 50 }}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onPointerMissed={() => onSelect(null)}
    >
      <CameraController hasSelection={Boolean(selectedId)} />
      <color attach="background" args={['#f3efe5']} />
      <fog attach="fog" args={['#f3efe5', 10, 28]} />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#fff6df', '#7a6f63', 1]} />
      <directionalLight
        castShadow
        intensity={1.35}
        position={[8, 10, 6]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment preset="city" />
      <Grid
        args={[30, 30]}
        cellColor="#b7ada1"
        sectionColor="#8f8576"
        fadeDistance={40}
        position={[0, 0.001, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.18} />
      </mesh>
      {objects.map((object) => (
        <SceneObject
          key={object.id}
          object={object}
          isSelected={object.id === selectedId}
          onSelect={onSelect}
        />
      ))}
      <axesHelper args={[3]} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}

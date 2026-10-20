import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Eye, Sparkles, Layers } from 'lucide-react';

interface Valve3DProps {
  manualAngle: number;
  isPulsing: boolean;
  showLabels: boolean;
}

const MechanicalValveModel: React.FC<Valve3DProps> = ({
  manualAngle,
  isPulsing,
  showLabels,
}) => {
  const leftLeafletRef = useRef<THREE.Group>(null);
  const rightLeafletRef = useRef<THREE.Group>(null);

  const materials = useMemo(() => {
    const pyrocarbon = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#16181b'),
      metalness: 0.85,
      roughness: 0.12,
      envMapIntensity: 1.5,
    });

    const fabricCuff = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e5e7eb'),
      roughness: 0.9,
      metalness: 0.05,
    });

    const titanium = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8b939c'),
      metalness: 0.95,
      roughness: 0.35,
    });

    return { pyrocarbon, fabricCuff, titanium };
  }, []);

  const leafletGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.95, 0);
    shape.quadraticCurveTo(-0.9, 1.25, 0, 1.35);
    shape.quadraticCurveTo(0.9, 1.25, 0.95, 0);
    shape.lineTo(-0.95, 0);

    const extrudeSettings = {
      depth: 0.045,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state, delta) => {
    let targetDeg = manualAngle;

    if (isPulsing) {
      const time = state.clock.getElapsedTime() * 7.5;
      const pulseWave = Math.sin(time);
      const normalizedPulse = (pulseWave + 1) / 2;
      targetDeg = 25 + Math.pow(normalizedPulse, 1.8) * 60;
    }

    const targetRad = THREE.MathUtils.degToRad(targetDeg);

    if (leftLeafletRef.current && rightLeafletRef.current) {
      leftLeafletRef.current.rotation.x = THREE.MathUtils.damp(
        leftLeafletRef.current.rotation.x,
        -targetRad,
        18,
        delta
      );
      rightLeafletRef.current.rotation.x = THREE.MathUtils.damp(
        rightLeafletRef.current.rotation.x,
        targetRad,
        18,
        delta
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh material={materials.fabricCuff} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.08, 0.42, 24, 64]} />
      </mesh>

      <mesh material={materials.titanium} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.98, 1.98, 0.45, 64, 1, true]} />
      </mesh>

      <mesh material={materials.pyrocarbon} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.75, 1.75, 0.65, 64, 1, true]} />
      </mesh>

      <group position={[0, 0, 0]}>
        {[-1.68, 1.68].map((xPos, idx) => (
          <mesh key={idx} material={materials.pyrocarbon} position={[xPos, 0, 0]}>
            <boxGeometry args={[0.12, 0.4, 0.28]} />
          </mesh>
        ))}
      </group>

      <group position={[0, 0, -0.32]}>
        <group ref={leftLeafletRef} rotation={[-THREE.MathUtils.degToRad(manualAngle), 0, 0]}>
          <mesh
            geometry={leafletGeometry}
            material={materials.pyrocarbon}
            position={[0, -0.05, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          />
        </group>
      </group>

      <group position={[0, 0, 0.32]}>
        <group ref={rightLeafletRef} rotation={[THREE.MathUtils.degToRad(manualAngle), 0, 0]}>
          <mesh
            geometry={leafletGeometry}
            material={materials.pyrocarbon}
            position={[0, -0.05, 0]}
            rotation={[-Math.PI / 2, Math.PI, 0]}
            castShadow
          />
        </group>
      </group>

      {showLabels && (
        <>
          <Html position={[0, 0.5, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white text-[10px] font-medium px-2 py-1 rounded-md border border-slate-700 backdrop-blur-xs whitespace-nowrap pointer-events-none shadow-md">
              Створки (Пироуглерод) • 85°
            </div>
          </Html>
          <Html position={[2.1, 0.4, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white text-[10px] font-medium px-2 py-1 rounded-md border border-slate-700 backdrop-blur-xs whitespace-nowrap pointer-events-none shadow-md">
              Манжета из полиэфира
            </div>
          </Html>
        </>
      )}
    </group>
  );
};

export const HeartValve3DViewer: React.FC = () => {
  const [angle, setAngle] = useState<number>(85);
  const [isPulsing, setIsPulsing] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Интерактивная 3D-модель
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            Двустворчатый клапан «МедИнж-2» (Аортальный)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              showLabels
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Метки</span>
          </button>

          <button
            onClick={resetCamera}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
            title="Сбросить ракурс камеры"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-[460px] sm:h-[540px] bg-radial from-slate-900 via-slate-950 to-black cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [0, 4.2, 4.8], fov: 45 }}
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <ambientLight intensity={0.65} />
          <directionalLight
            position={[5, 8, 4]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#93c5fd" />
          <pointLight position={[0, -3, 0]} intensity={0.4} color="#38bdf8" />

          <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
            <MechanicalValveModel
              manualAngle={angle}
              isPulsing={isPulsing}
              showLabels={showLabels}
            />
          </Float>

          <ContactShadows
            position={[0, -2.1, 0]}
            opacity={0.65}
            scale={10}
            blur={1.8}
            far={4.5}
            color="#000000"
          />

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={3.2}
            maxDistance={8.5}
            maxPolarAngle={Math.PI / 1.75}
          />
        </Canvas>

        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 pointer-events-none flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>ЛКМ — вращение (360°) • Скролл — масштаб</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-4 flex items-center gap-3">
          <button
            onClick={() => setIsPulsing(!isPulsing)}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
              isPulsing
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isPulsing ? (
              <>
                <Pause className="w-4 h-4" /> Приостановить пульс
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Симулировать пульсацию
              </>
            )}
          </button>
        </div>

        <div className="sm:col-span-8 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Угол раскрытия створок:
            </span>
            <span className="font-mono font-bold text-blue-400 text-sm">
              {isPulsing ? 'Авто (72 уд/мин)' : `${Math.round(angle)}°`}
            </span>
          </div>

          <input
            type="range"
            min="25"
            max="85"
            step="1"
            disabled={isPulsing}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
          />

          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>25° (Закрыт / Диастола)</span>
            <span>55°</span>
            <span className="text-emerald-400 font-semibold">85° (Центральный поток)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

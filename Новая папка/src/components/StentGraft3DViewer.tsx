import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Eye, ShieldCheck, Activity, Layers } from 'lucide-react';

interface StentGraftModelProps {
  deployProgress: number;
  showMarkers: boolean;
}

const StentGraftModel: React.FC<StentGraftModelProps> = ({ deployProgress, showMarkers }) => {
  const sheathRef = useRef<THREE.Mesh>(null);
  const totalLength = 5.6;
  const numRings = 7;
  const compressedRadius = 0.42;
  const expandedRadius = 1.65;

  const materials = useMemo(() => {
    const nitinol = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#94a3b8'),
      metalness: 0.92,
      roughness: 0.22,
    });

    const graftFabric = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f1f5f9'),
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    });

    const sheathMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#38bdf8'),
      transparent: true,
      opacity: 0.38,
      roughness: 0.2,
      transmission: 0.6,
      thickness: 0.5,
    });

    const innerShaft = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e293b'),
      roughness: 0.4,
    });

    const radioMarker = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f59e0b'),
      metalness: 0.98,
      roughness: 0.15,
    });

    return { nitinol, graftFabric, sheathMaterial, innerShaft, radioMarker };
  }, []);

  const createZRingGeometry = (baseRadius: number) => {
    const points: THREE.Vector3[] = [];
    const strutsCount = 10;
    const ringHeight = 0.45;

    for (let i = 0; i <= strutsCount * 2; i++) {
      const angle = (i / (strutsCount * 2)) * Math.PI * 2;
      const yOffset = (i % 2 === 0 ? 1 : -1) * (ringHeight / 2);
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * baseRadius,
          yOffset,
          Math.sin(angle) * baseRadius
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(points, true);
    return new THREE.TubeGeometry(curve, 120, 0.024, 8, true);
  };

  const ringOffsets = useMemo(() => {
    const offsets: number[] = [];
    const step = totalLength / (numRings - 1);
    for (let i = 0; i < numRings; i++) {
      offsets.push(-totalLength / 2 + i * step);
    }
    return offsets;
  }, [totalLength, numRings]);

  const ringStates = useMemo(() => {
    return ringOffsets.map((yPos) => {
      const normalizedPos = (yPos + totalLength / 2) / totalLength;
      const localDeploy = THREE.MathUtils.clamp((deployProgress - (1 - normalizedPos)) * 3.5, 0, 1);
      const currentRadius = THREE.MathUtils.lerp(compressedRadius, expandedRadius, localDeploy);
      
      return {
        yPos,
        localDeploy,
        radius: currentRadius,
        geometry: createZRingGeometry(currentRadius),
      };
    });
  }, [deployProgress, ringOffsets, compressedRadius, expandedRadius]);

  useFrame((_, delta) => {
    if (sheathRef.current) {
      const targetSheathY = THREE.MathUtils.lerp(0, -totalLength * 1.1, deployProgress);
      sheathRef.current.position.y = THREE.MathUtils.damp(
        sheathRef.current.position.y,
        targetSheathY,
        14,
        delta
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh material={materials.innerShaft}>
        <cylinderGeometry args={[0.07, 0.07, totalLength * 1.5, 32]} />
      </mesh>

      {ringStates.map((ring, idx) => (
        <group key={idx} position={[0, ring.yPos, 0]}>
          <mesh geometry={ring.geometry} material={materials.nitinol} castShadow />

          {showMarkers && (idx === 0 || idx === numRings - 1) && (
            <group position={[ring.radius, 0, 0]}>
              <mesh material={materials.radioMarker}>
                <sphereGeometry args={[0.065, 16, 16]} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      <mesh material={materials.graftFabric}>
        <cylinderGeometry
          args={[
            ringStates[ringStates.length - 1].radius,
            ringStates[0].radius,
            totalLength * 0.95,
            48,
            24,
            true
          ]}
        />
      </mesh>

      <mesh ref={sheathRef} material={materials.sheathMaterial}>
        <cylinderGeometry args={[compressedRadius * 1.12, compressedRadius * 1.12, totalLength * 1.05, 32, 1, true]} />
      </mesh>

      {showMarkers && (
        <>
          <Html position={[expandedRadius + 0.35, totalLength / 2 - 0.2, 0]} center distanceFactor={9}>
            <div className="bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-1 rounded-md border border-slate-700 backdrop-blur-xs whitespace-nowrap shadow-lg">
              Проксимальная зона фиксации • 32 мм
            </div>
          </Html>
          <Html position={[-expandedRadius - 0.4, 0, 0]} center distanceFactor={9}>
            <div className="bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-1 rounded-md border border-slate-700 backdrop-blur-xs whitespace-nowrap shadow-lg">
              Нитинол с памятью формы
            </div>
          </Html>
        </>
      )}
    </group>
  );
};

export const StentGraft3DViewer: React.FC = () => {
  const [deployProgress, setDeployProgress] = useState<number>(0.75);
  const [isAutoDeploying, setIsAutoDeploying] = useState<boolean>(false);
  const [showMarkers, setShowMarkers] = useState<boolean>(true);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    let animFrame: number;
    if (isAutoDeploying) {
      const step = () => {
        setDeployProgress((prev) => {
          if (prev >= 1) return 0;
          return Math.min(prev + 0.006, 1);
        });
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isAutoDeploying]);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col text-slate-100">
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-900/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              Эндоваскулярная хирургия аорты
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            Торакальный стент-графт аорты МедИнж • Анимация раскрытия
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              showMarkers
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Метки анатомии</span>
          </button>

          <button
            onClick={resetCamera}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
            title="Сбросить ракурс"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-[480px] sm:h-[560px] bg-radial from-slate-900 via-slate-950 to-black cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [0, 2.5, 7.8], fov: 46 }}
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[6, 9, 6]} intensity={2.2} castShadow />
          <directionalLight position={[-6, -4, -6]} intensity={0.6} color="#38bdf8" />
          <pointLight position={[0, 4, 2]} intensity={0.8} color="#ffffff" />

          <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.25}>
            <StentGraftModel deployProgress={deployProgress} showMarkers={showMarkers} />
          </Float>

          <ContactShadows
            position={[0, -3.4, 0]}
            opacity={0.65}
            scale={12}
            blur={2.2}
            far={5}
            color="#000000"
          />

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={4.0}
            maxDistance={12.0}
          />
        </Canvas>

        <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs space-y-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">Профиль системы: 20 Fr (6.6 мм)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Раскрытый диаметр: 32 мм (Over-sizing 15%)</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 pointer-events-none flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>ЛКМ — вращение изделия (360°) • Скролл — приближение</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-4">
          <button
            onClick={() => setIsAutoDeploying(!isAutoDeploying)}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
              isAutoDeploying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {isAutoDeploying ? (
              <>
                <Pause className="w-4 h-4" /> Остановить авто-цикл
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Автоматическое раскрытие
              </>
            )}
          </button>
        </div>

        <div className="sm:col-span-8 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-400">Стягивание интродьюсера (Высвобождение):</span>
            <span className="font-mono font-bold text-cyan-400 text-sm">
              {Math.round(deployProgress * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            disabled={isAutoDeploying}
            value={deployProgress}
            onChange={(e) => setDeployProgress(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
          />

          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>0% (Внутри катетера)</span>
            <span>50% (Зона дуги)</span>
            <span className="text-emerald-400 font-semibold">100% (Полная фиксация)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

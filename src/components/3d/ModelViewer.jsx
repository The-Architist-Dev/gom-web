/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  useGLTF,
  useFBX,
  Center,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Camera, Download } from 'lucide-react';

/**
 * ModelViewer - Premium 3D model viewer component
 * Supports GLB, FBX, OBJ formats with mouse parallax, hover rotation, and screenshot
 */

// Model component that handles loading and rendering
const Model = ({ 
  url, 
  modelXOffset = 0, 
  modelYOffset = 0,
  enableMouseParallax = false,
  enableHoverRotation = false,
  autoRotate = false,
  autoRotateSpeed = 0.35,
}) => {
  const modelRef = useRef();
  const groupRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { gl } = useThree();

  // Determine file type
  const fileExtension = url.split('.').pop().toLowerCase();
  
  // Load model based on file type
  let scene;
  try {
    if (fileExtension === 'glb' || fileExtension === 'gltf') {
      const { scene: gltfScene } = useGLTF(url);
      scene = gltfScene;
    } else if (fileExtension === 'fbx') {
      scene = useFBX(url);
    } else if (fileExtension === 'obj') {
      // OBJ loading handled differently
      const [objScene, setObjScene] = useState(null);
      useEffect(() => {
        const loader = new OBJLoader();
        loader.load(url, (obj) => {
          setObjScene(obj);
        });
      }, [url]);
      scene = objScene;
    }
  } catch (error) {
    console.error('Error loading model:', error);
  }

  // Mouse move handler for parallax
  useEffect(() => {
    if (!enableMouseParallax && !enableHoverRotation) return;

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', () => setIsHovered(true));
    canvas.addEventListener('mouseleave', () => setIsHovered(false));

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', () => setIsHovered(true));
      canvas.removeEventListener('mouseleave', () => setIsHovered(false));
    };
  }, [enableMouseParallax, enableHoverRotation, gl]);

  // Animation frame
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Auto rotation
    if (autoRotate) {
      groupRef.current.rotation.y += delta * autoRotateSpeed;
    }

    // Mouse parallax
    if (enableMouseParallax && isHovered) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.x * 0.3,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePos.y * 0.2,
        0.05
      );
    }

    // Hover rotation
    if (enableHoverRotation && isHovered && !enableMouseParallax) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  if (!scene) {
    return null;
  }

  return (
    <group ref={groupRef} position={[modelXOffset, modelYOffset, 0]}>
      <Center>
        <primitive ref={modelRef} object={scene.clone()} />
      </Center>
    </group>
  );
};

// Loading component
const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy border-t-transparent dark:border-ivory dark:border-t-transparent" />
      <p className="text-sm font-semibold text-navy dark:text-ivory">Loading 3D Model...</p>
    </div>
  </Html>
);

// Error boundary component
const ErrorFallback = ({ error }) => (
  <Html center>
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-6 shadow-lg dark:bg-dark-surface">
      <p className="text-sm font-semibold text-danger">Failed to load model</p>
      <p className="text-xs text-muted dark:text-dark-text-muted">{error?.message || 'Unknown error'}</p>
    </div>
  </Html>
);

// Main ModelViewer component
const ModelViewer = ({
  url,
  width = 600,
  height = 600,
  modelXOffset = 0,
  modelYOffset = 0,
  enableMouseParallax = false,
  enableHoverRotation = false,
  environmentPreset = 'sunset',
  fadeIn = true,
  autoRotate = false,
  autoRotateSpeed = 0.35,
  showScreenshotButton = false,
  className = '',
}) => {
  const canvasRef = useRef();
  const [isVisible, setIsVisible] = useState(!fadeIn);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fadeIn) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [fadeIn]);

  const handleScreenshot = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current.querySelector('canvas');
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `model-screenshot-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  };

  // Memoize canvas to prevent unnecessary re-renders
  const canvasElement = useMemo(() => (
    <Canvas
      ref={canvasRef}
      shadows
      dpr={[1, 2]}
      gl={{ 
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true,
      }}
      style={{
        width: '100%',
        height: '100%',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease-in-out',
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Environment */}
      <Environment preset={environmentPreset} />
      
      {/* Model */}
      <Suspense fallback={<Loader />}>
        {error ? (
          <ErrorFallback error={error} />
        ) : (
          <Model
            url={url}
            modelXOffset={modelXOffset}
            modelYOffset={modelYOffset}
            enableMouseParallax={enableMouseParallax}
            enableHoverRotation={enableHoverRotation}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
          />
        )}
      </Suspense>
      
      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
        autoRotate={false}
      />
    </Canvas>
  ), [
    url,
    modelXOffset,
    modelYOffset,
    enableMouseParallax,
    enableHoverRotation,
    environmentPreset,
    autoRotate,
    autoRotateSpeed,
    isVisible,
    error,
  ]);

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-surface shadow-lg dark:bg-dark-surface ${className}`}
      style={{ width, height }}
    >
      {canvasElement}
      
      {/* Screenshot button */}
      {showScreenshotButton && (
        <button
          onClick={handleScreenshot}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-navy/90 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-navy hover:shadow-xl active:scale-95 dark:bg-ivory/90 dark:text-navy dark:hover:bg-ivory"
          aria-label="Take screenshot"
        >
          <Camera size={16} />
          <span className="hidden sm:inline">Screenshot</span>
        </button>
      )}

      {/* Controls hint */}
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

// Preload models for better performance
ModelViewer.preload = (url) => {
  const fileExtension = url.split('.').pop().toLowerCase();
  if (fileExtension === 'glb' || fileExtension === 'gltf') {
    useGLTF.preload(url);
  } else if (fileExtension === 'fbx') {
    useFBX.preload(url);
  }
};

export default ModelViewer;

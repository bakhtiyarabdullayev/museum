'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, Plus, Minus, Move, Box, ArrowLeft } from 'lucide-react';
import { Exhibit } from '@/data/types';
import { useLanguage } from './LanguageProvider';
import { useModal } from './useModal';
export default function ModelViewer({
  exhibit,
  onClose,
}: {
  exhibit: Exhibit;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const modal = useModal(onClose);
  const mount = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<{ reset: () => void; zoom: (amount: number) => void } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    setLoading(true);
    setError(false);
    async function initialize() {
      try {
        const [THREE, { OrbitControls }, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
          import('three'),
          import('three/examples/jsm/controls/OrbitControls.js'),
          import('three/examples/jsm/loaders/GLTFLoader.js'),
          import('three/examples/jsm/environments/RoomEnvironment.js'),
        ]);
        if (disposed || !mount.current) return;
        const element = mount.current;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(element.clientWidth, element.clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.4;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute(
          'aria-label',
          'Interactive 3D artifact — drag to rotate, scroll to zoom',
        );
        renderer.domElement.setAttribute('data-testid', 'model-canvas');
        element.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          35,
          element.clientWidth / element.clientHeight,
          0.01,
          100,
        );
        camera.position.set(2.7, 1.8, 3.4);
        const orbit = new OrbitControls(camera, renderer.domElement);
        orbit.target.set(0, 0.65, 0);
        orbit.enableDamping = true;
        orbit.dampingFactor = 0.06;
        orbit.minDistance = 1.3;
        orbit.maxDistance = 7;
        orbit.enablePan = false;
        orbit.maxPolarAngle = Math.PI * 0.9;
        orbit.autoRotate = true;
        orbit.autoRotateSpeed = 0.65;
        orbit.addEventListener('start', () => {
          orbit.autoRotate = false;
        });
        orbit.update();
        orbit.saveState();
        const pmrem = new THREE.PMREMGenerator(renderer);
        const environmentScene = new RoomEnvironment();
        const env = pmrem.fromScene(environmentScene, 0.04);
        scene.environment = env.texture;
        environmentScene.dispose();
        pmrem.dispose();
        const key = new THREE.DirectionalLight(0xffedd0, 3);
        key.position.set(-3, 5, 4);
        scene.add(key);
        scene.add(new THREE.AmbientLight(0xfff3e3, 0.7));
        const floor = new THREE.Mesh(
          new THREE.CircleGeometry(1.5, 64),
          new THREE.MeshStandardMaterial({ color: 0xe5ddcf, roughness: 0.95, metalness: 0 }),
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.035;
        scene.add(floor);
        // Soft contact shadow, drawn locally rather than relying on external textures.
        const shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = 256;
        shadowCanvas.height = 256;
        const ctx = shadowCanvas.getContext('2d')!;
        const gradient = ctx.createRadialGradient(128, 128, 15, 128, 128, 125);
        gradient.addColorStop(0, 'rgba(47,34,20,.28)');
        gradient.addColorStop(1, 'rgba(47,34,20,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
        const shadow = new THREE.Mesh(
          new THREE.PlaneGeometry(1.65, 1.65),
          new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }),
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -0.02;
        scene.add(shadow);
        const loader = new GLTFLoader();
        loader.load(
          exhibit.model3D!,
          (gltf) => {
            if (disposed) {
              gltf.scene.traverse((o) => {
                if (o instanceof THREE.Mesh) {
                  o.geometry.dispose();
                }
              });
              return;
            }
            scene.add(gltf.scene);
            setLoading(false);
          },
          undefined,
          (e) => {
            console.error('Model load failed', e);
            if (!disposed) {
              setError(true);
              setLoading(false);
            }
          },
        );
        controlsRef.current = {
          reset: () => {
            orbit.reset();
            orbit.autoRotate = true;
          },
          zoom: (amount) => {
            const direction = camera.position.clone().sub(orbit.target);
            const distance = THREE.MathUtils.clamp(
              direction.length() * amount,
              orbit.minDistance,
              orbit.maxDistance,
            );
            camera.position.copy(orbit.target).add(direction.setLength(distance));
            orbit.update();
          },
        };
        let frame = 0;
        const animate = () => {
          frame = requestAnimationFrame(animate);
          orbit.update();
          renderer.render(scene, camera);
        };
        animate();
        const observer = new ResizeObserver(() => {
          if (element.clientWidth && element.clientHeight) {
            camera.aspect = element.clientWidth / element.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(element.clientWidth, element.clientHeight);
          }
        });
        observer.observe(element);
        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          orbit.dispose();
          env.dispose();
          shadowTexture.dispose();
          scene.traverse((o) => {
            if (o instanceof THREE.Mesh) {
              o.geometry.dispose();
              const materials = Array.isArray(o.material) ? o.material : [o.material];
              materials.forEach((m) => m.dispose());
            }
          });
          renderer.dispose();
          renderer.domElement.remove();
          controlsRef.current = null;
        };
      } catch (e) {
        console.error('3D viewer unavailable:', e);
        if (!disposed) {
          setError(true);
          setLoading(false);
        }
      }
    }
    initialize();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [exhibit.model3D, retry]);
  return (
    <motion.div
      className="modal-backdrop model-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-title"
        className="model-dialog"
        initial={{ y: 20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="model-header">
          <div>
            <span className="eyebrow">
              <Box size={14} />
              {t({ az: 'RƏQƏMSAL EKSPONAT', en: 'DIGITAL ARTIFACT' })}
            </span>
            <h2 id="model-title">{t(exhibit.name)}</h2>
            <span className="model-period">{t(exhibit.period)}</span>
          </div>
          <button
            className="close-button"
            onClick={onClose}
            aria-label={t({ az: '3D görünüşü bağla', en: 'Close 3D view' })}
          >
            <X size={20} />
          </button>
        </div>
        <div className="model-stage" ref={mount}>
          {loading && (
            <div className="model-status">
              <span className="loading-ring" />
              {t({ az: 'Eksponat hazırlanır…', en: 'Preparing the artifact…' })}
            </div>
          )}
          {error && (
            <div className="model-status">
              <p>
                {t({ az: '3D modeli yükləmək mümkün olmadı.', en: 'Unable to load the 3D model.' })}
              </p>
              <button className="button button-primary" onClick={() => setRetry((v) => v + 1)}>
                {t({ az: 'Yenidən yoxla', en: 'Retry' })}
              </button>
            </div>
          )}
        </div>
        <div className="model-tools">
          <button
            onClick={() => controlsRef.current?.zoom(1.2)}
            aria-label={t({ az: '3D modeli kiçilt', en: 'Zoom out of model' })}
            disabled={loading || error}
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => controlsRef.current?.zoom(0.8)}
            aria-label={t({ az: '3D modeli böyüt', en: 'Zoom into model' })}
            disabled={loading || error}
          >
            <Plus size={18} />
          </button>
          <span />
          <button
            onClick={() => controlsRef.current?.reset()}
            aria-label={t({ az: 'Kameranı sıfırla', en: 'Reset camera' })}
            disabled={loading || error}
          >
            <RotateCcw size={17} />
          </button>
        </div>
        <div className="model-footer">
          <div>
            <Move size={18} />
            <span>
              {t({
                az: '360° fırladaraq eksponatı araşdırın',
                en: 'Rotate 360° to explore the artifact',
              })}
              <small>
                {t({
                  az: 'Sürükləyin · Yaxınlaşdırmaq üçün sürüşdürün',
                  en: 'Drag to rotate · Scroll or pinch to zoom',
                })}
              </small>
            </span>
          </div>
          <button className="text-link" onClick={onClose}>
            <ArrowLeft size={16} />
            {t({ az: 'Eksponata qayıt', en: 'Back to exhibit' })}
          </button>
        </div>
        <span className="model-demo-note">
          {t({
            az: 'Təqdimat üçün hazırlanmış 3D nümunə',
            en: 'Illustrative 3D model for this presentation',
          })}
        </span>
      </motion.div>
    </motion.div>
  );
}

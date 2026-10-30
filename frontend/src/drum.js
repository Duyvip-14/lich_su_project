import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// The face pattern follows trong-dong-3d.html; no remote images are needed.
function makeFace(renderer) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const g = canvas.getContext('2d');
  const c = 512, tau = Math.PI * 2;
  const gradient = g.createRadialGradient(c, c, 20, c, c, c);
  gradient.addColorStop(0, '#c69b53'); gradient.addColorStop(1, '#9d7131');
  g.fillStyle = gradient; g.fillRect(0, 0, 1024, 1024);
  const dark = '#624219', light = '#dfbb75';
  g.lineJoin = 'round';
  const ring = (r, color, width) => {
    g.strokeStyle = color; g.lineWidth = width;
    g.beginPath(); g.arc(c, c, r, 0, tau); g.stroke();
  };
  const ticks = (r1, r2, count, color, width, offset = 0) => {
    g.strokeStyle = color; g.lineWidth = width;
    for (let i = 0; i < count; i++) {
      const a = i / count * tau + offset;
      g.beginPath(); g.moveTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1);
      g.lineTo(c + Math.cos(a) * r2, c + Math.sin(a) * r2); g.stroke();
    }
  };
  g.fillStyle = dark; g.beginPath();
  for (let i = 0; i < 28; i++) {
    const a = i / 28 * tau - Math.PI / 2, r = i % 2 ? 35 : 128;
    const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r;
    if (i) g.lineTo(x, y); else g.moveTo(x, y);
  }
  g.closePath(); g.fill();
  ring(142, dark, 5); ring(152, light, 3);
  ticks(160, 186, 84, dark, 4); ring(196, dark, 4);
  for (let i = 0; i < 48; i++) {
    const a = i / 48 * tau;
    g.beginPath(); g.arc(c + Math.cos(a) * 214, c + Math.sin(a) * 214, 6, 0, tau); g.fill();
  }
  ring(232, dark, 4); ring(238, light, 3);
  g.strokeStyle = dark; g.lineWidth = 4; g.beginPath();
  for (let i = 0; i <= 144; i++) {
    const a = i / 144 * tau, r = i % 2 ? 252 : 274;
    const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r;
    if (i) g.lineTo(x, y); else g.moveTo(x, y);
  }
  g.stroke(); ring(288, dark, 4);
  ticks(298, 330, 120, dark, 4); ticks(298, 314, 120, light, 3, Math.PI / 120);
  ring(340, dark, 5); ring(348, light, 3);
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * tau, w = .045;
    g.beginPath(); g.moveTo(c + Math.cos(a - w) * 358, c + Math.sin(a - w) * 358);
    g.lineTo(c + Math.cos(a) * 392, c + Math.sin(a) * 392);
    g.lineTo(c + Math.cos(a + w) * 358, c + Math.sin(a + w) * 358);
    g.closePath(); g.fill();
  }
  ring(402, dark, 4); ticks(412, 444, 180, dark, 3);
  ring(456, dark, 5); ring(466, light, 3); ring(484, dark, 6);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

export function mountDrum(area, onFailure) {
  const host = area.querySelector('.drum-control');
  const fallback = host.querySelector('.drum');
  const spin = area.querySelector('#spin-drum');
  const reset = area.querySelector('#reset-drum');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = new THREE.Scene();
  let renderer, controls, observer, texture, disposed = false;
  const listeners = new AbortController();
  const canvas = document.createElement('canvas');
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'Trống đồng 3D. Kéo để xoay, cuộn hoặc chụm hai ngón để thu phóng; phím mũi tên để xoay.');
  function dispose() {
    if (disposed) return;
    disposed = true;
    listeners.abort(); observer?.disconnect();
    motion.removeEventListener('change', motionChanged);
    renderer?.setAnimationLoop(null); controls?.dispose();
    const geometries = new Set(), materials = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => materials.add(m));
    });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); texture?.dispose();
    renderer?.dispose(); renderer?.forceContextLoss(); scene.clear(); canvas.remove();
    fallback.hidden = false; spin.hidden = true;
    host.classList.remove('is-3d');
    area.querySelector('.drum-hint').textContent = '↔ Kéo để xoay · Phím ← → khi chọn mô hình';
  }
  function fail() { if (!disposed) { dispose(); onFailure(); } }
  function syncSpin() {
    spin.textContent = controls.autoRotate ? 'Tạm dừng xoay' : 'Tiếp tục xoay';
    spin.setAttribute('aria-pressed', String(controls.autoRotate));
  }
  function motionChanged() {
    controls.autoRotate = false;
    controls.enableDamping = !motion.matches;
    syncSpin();
  }
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 40);
    camera.position.set(2.8, 2.3, 3.5);
    scene.add(new THREE.HemisphereLight(0xfff3da, 0x50402a, 2));
    const key = new THREE.DirectionalLight(0xfff1d3, 3); key.position.set(3, 5, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffd58c, 1.5); rim.position.set(-4, 2, -3); scene.add(rim);
    const bronze = new THREE.MeshStandardMaterial({ color: 0xb58b43, metalness: .48, roughness: .44, side: THREE.DoubleSide });
    texture = makeFace(renderer);
    const faceMaterial = new THREE.MeshStandardMaterial({ map: texture, metalness: .35, roughness: .56 });
    const drum = new THREE.Group();
    // One continuous silhouette, from flared foot through waist and chest to rim.
    const profile = [[.83, 0], [.84, .035], [.82, .10], [.74, .21], [.63, .34], [.60, .43], [.65, .54], [.77, .69], [.82, .80], [.81, .89], [.85, .94]];
    const curve = new THREE.SplineCurve(profile.map(([r, y]) => new THREE.Vector2(r, y)));
    drum.add(new THREE.Mesh(new THREE.LatheGeometry(curve.getPoints(90), 128), bronze));
    const face = new THREE.Mesh(new THREE.CylinderGeometry(1, .98, .075, 128), [bronze, faceMaterial, bronze]);
    face.position.y = .9775; drum.add(face);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(.982, .018, 10, 128), bronze);
    lip.rotation.x = Math.PI / 2; lip.position.y = .95; drum.add(lip);
    const handleGeometry = new THREE.TorusGeometry(.105, .023, 12, 36, Math.PI);
    handleGeometry.rotateZ(-Math.PI / 2);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + Math.PI / 4;
      const handle = new THREE.Mesh(handleGeometry, bronze);
      handle.position.set(Math.cos(a) * .76, .69, Math.sin(a) * .76);
      handle.rotation.y = -a; drum.add(handle);
    }
    drum.position.y = -.5; scene.add(drum);
    controls = new OrbitControls(camera, canvas);
    controls.enablePan = false; controls.enableDamping = !motion.matches;
    controls.minDistance = 2.7; controls.maxDistance = 7;
    controls.minPolarAngle = .18; controls.maxPolarAngle = 1.45;
    controls.autoRotate = !motion.matches; controls.autoRotateSpeed = .7;
    controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
    controls.target.set(0, 0, 0); controls.update(); controls.saveState();
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    };
    host.append(canvas); host.classList.add('is-3d');
    observer = new ResizeObserver(resize); observer.observe(host); resize();
    // Only hide the working CSS version after a successful WebGL frame.
    renderer.render(scene, camera); fallback.hidden = true; spin.hidden = false; syncSpin();
    area.querySelector('.drum-hint').textContent = 'Kéo để xoay · Cuộn hoặc chụm hai ngón để thu phóng';
    spin.addEventListener('click', () => { controls.autoRotate = !controls.autoRotate; syncSpin(); }, { signal: listeners.signal });
    reset.addEventListener('click', () => controls.reset(), { signal: listeners.signal });
    canvas.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'Home') { controls.reset(); return; }
      const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      if (e.key === 'ArrowLeft') spherical.theta -= .12;
      if (e.key === 'ArrowRight') spherical.theta += .12;
      if (e.key === 'ArrowUp') spherical.phi -= .10;
      if (e.key === 'ArrowDown') spherical.phi += .10;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle);
      camera.position.setFromSpherical(spherical).add(controls.target); controls.update();
    }, { signal: listeners.signal });
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); fail(); }, { signal: listeners.signal });
    motion.addEventListener('change', motionChanged);
    let previous = performance.now();
    renderer.setAnimationLoop(now => {
      if (disposed) return;
      try {
        const delta = Math.min((now - previous) / 1000, .05); previous = now;
        controls.update(document.hidden ? 0 : delta); renderer.render(scene, camera);
      } catch { fail(); }
    });
    return dispose;
  } catch (error) { dispose(); throw error; }
}

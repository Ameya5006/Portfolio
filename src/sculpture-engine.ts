import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { Finish } from "./Sculpture";

export type SculptureController = {
  setMotion: (motion: boolean) => void;
  setFinish: (finish: Finish) => void;
  setPointer: (x: number, y: number) => void;
  dispose: () => void;
};

/** GPU scene is an optional enhancement. The hero and navigation never wait for it. */
export function createSculpture(
  canvas: HTMLCanvasElement,
  context: WebGL2RenderingContext,
  host: HTMLElement,
): SculptureController {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      window.matchMedia("(pointer: coarse)").matches ? 1.25 : 1.6,
    ),
  );
  renderer.setClearColor(0x12151a, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 0, 7.7);

  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.035);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();

  const geometry = new THREE.TorusKnotGeometry(1.23, 0.43, 224, 32, 2, 3);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xd4d7dd,
    metalness: 1,
    roughness: 0.19,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.65,
  });
  const knot = new THREE.Mesh(geometry, material);
  knot.position.x = 1.45;
  knot.rotation.set(0.24, -0.3, -0.4);
  scene.add(knot);
  // An original three-strand signal lattice encircles the sculpture.
  // Static line geometry + one instanced draw keep the additional GPU cost bounded.
  const lattice = new THREE.Group();
  scene.add(lattice);
  const traceMaterial = new THREE.LineBasicMaterial({
    color: 0xb8cbb3,
    transparent: true,
    opacity: 0.27,
    depthWrite: false,
  });
  const curves = Array.from({ length: 3 }, (_, strand) => {
    const points = Array.from({ length: 96 }, (_, i) => {
      const angle = (i / 96) * Math.PI * 2;
      return new THREE.Vector3(
        Math.cos(angle) * (2.05 + strand * 0.12),
        Math.sin(angle) * (1.68 + strand * 0.12),
        Math.sin(angle * 2 + strand * 0.7) * 0.68,
      );
    });
    return new THREE.CatmullRomCurve3(points, true);
  });
  const traceGeometries = curves.map((curve) =>
    new THREE.BufferGeometry().setFromPoints(curve.getPoints(192)),
  );
  traceGeometries.forEach((geometry) =>
    lattice.add(new THREE.LineLoop(geometry, traceMaterial)),
  );
  const sparkGeometry = new THREE.SphereGeometry(0.024, 8, 6);
  const sparkMaterial = new THREE.MeshBasicMaterial({ color: 0xe6f5d1 });
  const sparks = new THREE.InstancedMesh(sparkGeometry, sparkMaterial, 12);
  lattice.add(sparks);
  const sparkTransform = new THREE.Object3D();
  const sparkPoint = new THREE.Vector3();
  const fill = new THREE.DirectionalLight(0xcddfff, 3);
  fill.position.set(-4, 2, 3);
  scene.add(fill);
  const key = new THREE.DirectionalLight(0xfff0df, 4);
  key.position.set(4, 5, 4);
  scene.add(key);
  const cursorLight = new THREE.PointLight(0xe7f2ce, 15, 12, 2);
  cursorLight.position.set(0, 1, 3);
  scene.add(cursorLight);
  const raycaster = new THREE.Raycaster();
  const lightPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2.6);
  const lightTarget = new THREE.Vector3(0, 1, 2.6);
  const view = { x: 1.45, y: 0, z: 7.7 };
  let chapter = 0;

  let enabled = true;
  let visible = true;
  let disposed = false;
  let sharedClock = false;
  let frame = 0;
  let time = 0;
  let previous = performance.now();
  let px = 0;
  let py = 0;
  const pointer = new THREE.Vector2();
  const lightPointer = new THREE.Vector2();
  const targetColor = new THREE.Color(0xd4d7dd);
  const colors = { silver: 0xd4d7dd, warm: 0xdcc6a7, cobalt: 0x446dff };

  function render(now: number) {
    frame = 0;
    if (disposed) return;
    const delta = Math.max(0, Math.min((now - previous) / 1000, 0.05));
    previous = now;
    if (enabled) time += delta;
    px += (pointer.x - px) * 0.045;
    py += (pointer.y - py) * 0.045;
    knot.rotation.x = 0.24 + Math.sin(time * 0.19) * 0.14 + py * 0.18;
    knot.rotation.y = -0.3 + time * 0.12 + px * 0.3;
    knot.rotation.z = -0.4 + Math.sin(time * 0.13) * 0.14;
    material.color.lerp(targetColor, enabled ? 0.07 : 1);
    knot.position.x += (view.x - knot.position.x) * 0.035;
    knot.position.y +=
      (view.y + Math.sin(time * 0.65) * 0.07 - knot.position.y) * 0.035;
    camera.position.z += (view.z - camera.position.z) * 0.035;
    lattice.position.copy(knot.position);
    lattice.scale.copy(knot.scale);
    lattice.rotation.set(0.45 + py * 0.08, -0.2 + time * 0.065, -0.35);
    for (let i = 0; i < 12; i++) {
      curves[i % 3].getPoint(
        (time * 0.045 + Math.floor(i / 3) * 0.25 + (i % 3) * 0.11) % 1,
        sparkPoint,
      );
      sparkTransform.position.copy(sparkPoint);
      sparkTransform.updateMatrix();
      sparks.setMatrixAt(i, sparkTransform.matrix);
    }
    sparks.instanceMatrix.needsUpdate = true;
    if (enabled) {
      lightPointer.set(px, -py);
      raycaster.setFromCamera(lightPointer, camera);
      raycaster.ray.intersectPlane(lightPlane, lightTarget);
      cursorLight.position.lerp(lightTarget, 1 - Math.exp(-8 * delta));
    }
    renderer.render(scene, camera);
    if (enabled && visible && !document.hidden && !sharedClock)
      frame = requestAnimationFrame(render);
  }
  function refresh() {
    if (disposed || frame || (sharedClock && enabled)) return;
    previous = performance.now();
    frame = requestAnimationFrame(render);
  }
  function resize() {
    const bounds = host.getBoundingClientRect();
    renderer.setSize(
      Math.max(1, bounds.width),
      Math.max(1, bounds.height),
      false,
    );
    camera.aspect = bounds.width / Math.max(1, bounds.height);
    const mobile = bounds.width < 760;
    knot.scale.setScalar(mobile ? 0.86 : 1.15);
    view.x = mobile ? 0 : chapter === 1 ? -2 : 1.45;
    view.y = mobile ? -1.35 : 0;
    camera.updateProjectionMatrix();
    refresh();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const intersection = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) refresh();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  intersection.observe(host);
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (visible) refresh();
  };
  document.addEventListener("visibilitychange", visibility);
  const sharedFrame = () => {
    if (!sharedClock) {
      sharedClock = true;
      cancelAnimationFrame(frame);
      frame = 0;
    }
    if (enabled && visible && !document.hidden) render(performance.now());
  };
  const releaseClock = () => {
    sharedClock = false;
    refresh();
  };
  window.addEventListener("portfolio:frame", sharedFrame);
  window.addEventListener("portfolio:release-clock", releaseClock);
  const journey = (event: Event) => {
    const { progress } = (
      event as CustomEvent<{ progress: number; velocity: number }>
    ).detail;
    chapter = progress > 0.23 && progress < 0.6 ? 1 : 0;
    const mobile = window.innerWidth < 760;
    view.x = mobile ? 0 : 1.45 * Math.cos(progress * Math.PI * 2);
    view.z = 7.7 - Math.sin(progress * Math.PI) * 0.85;
    view.y = mobile ? -1.35 : Math.sin(progress * Math.PI * 2) * 0.4;
    refresh();
  };
  window.addEventListener("portfolio:scroll", journey);
  resize();

  return {
    setMotion(value) {
      enabled = value;
      cancelAnimationFrame(frame);
      frame = 0;
      refresh();
    },
    setFinish(value) {
      targetColor.setHex(colors[value]);
      refresh();
    },
    setPointer(x, y) {
      pointer.set(x, y);
      if (enabled) refresh();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("portfolio:frame", sharedFrame);
      window.removeEventListener("portfolio:release-clock", releaseClock);
      window.removeEventListener("portfolio:scroll", journey);
      geometry.dispose();
      material.dispose();
      traceGeometries.forEach((geometry) => geometry.dispose());
      traceMaterial.dispose();
      sparkGeometry.dispose();
      sparkMaterial.dispose();
      sparks.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}

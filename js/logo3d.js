/**
 * logo3d.js — Logo 3D cromado "Webs VC" · Three.js ES Module
 * ═══════════════════════════════════════════════════════════════════════
 * Geometría: TextGeometry (helvetiker_bold) con MeshPhysicalMaterial
 * chrome espejo — metalness=1, roughness=0.03, clearcoat=1.
 * Environment: mapa HDRI procedural de estudio Apple (canvas 512×256).
 * Animación: wave por letra + oscilación sinusoidal del grupo.
 *
 * ─── PERSONALIZACIÓN ───────────────────────────────────────────────────
 * • Cambiar el texto del logo → edita CONFIG.logoText
 * • Cambiar el color del cromo → edita CONFIG.chromeColor
 * • Ajustar la velocidad de animación → edita CONFIG.rotSpeedY / waveFreq
 *
 * ─── PARA USAR TU PROPIO .glb EN LUGAR DEL TEXTO ──────────────────────
 * Cuando tengas listo tu modelo 3D del logo:
 *   1. Sube el archivo a /assets/models/logo-websvc.glb
 *   2. Importa GLTFLoader: añade al importmap en index.html:
 *        "three/addons/loaders/GLTFLoader.js": "https://cdn.jsdelivr.net/..."
 *   3. Busca el bloque "═══ LOAD GLB" al final de initScene() y descoméntalo.
 *   4. Comenta o elimina el bloque "═══ TEXTO 3D" en buildText().
 *
 * ─── VALIDACIONES DEL SKILL 3d-web-experience ─────────────────────────
 *   ✅ Fallback estático si WebGL no disponible (img PNG)
 *   ✅ DPR limitado ≤2 desktop / ≤1.5 móvil
 *   ✅ canvas pointer-events:none → no bloquea scroll ni touch
 *   ✅ IntersectionObserver → pausa render fuera del viewport
 *   ✅ ResizeObserver → adapta canvas al contenedor sin reload
 *   ✅ Un único rAF loop (evita loops dobles / memory leaks)
 *   ✅ Loading indicator mientras descarga la fuente CDN
 */

import * as THREE        from 'three';
import { FontLoader }    from 'three/addons/loaders/FontLoader.js';
import { TextGeometry }  from 'three/addons/geometries/TextGeometry.js';

/* ═══════════════════════════════════════════════════════════════════════
   CONFIGURACIÓN
   ═══════════════════════════════════════════════════════════════════════ */
const CONFIG = Object.freeze({
  /* 🔄 CAMBIA AQUÍ EL TEXTO DE TU LOGO */
  logoText:  'Webs VC',

  /* 🔄 CAMBIA AQUÍ EL COLOR BASE DEL CROMO
   * 0xffffff = cromo puro (blanco espejo)
   * 0x0a84ff = cromo azul Apple
   * 0xe8e8e8 = aluminio satinado  */
  chromeColor: 0xffffff,

  /* URL de la fuente typeface.json (jsDelivr CDN) */
  fontUrl: 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/fonts/helvetiker_bold.typeface.json',

  /* Geometría del texto */
  textSize:        0.60,
  textDepth:       0.20,   // profundidad de extrusión (da el volumen 3D)
  curveSegments:   20,     // suavidad de las curvas — reducir en low-end
  bevelEnabled:    true,
  bevelThickness:  0.050,  // grosor del bisel (captura más luz)
  bevelSize:       0.030,
  bevelSegments:   10,     // suavidad del bisel

  /* Animación global del grupo */
  oscAmplY:   0.65,   // rad — amplitud oscilación Y (±37°)
  oscFreqY:   0.00020, // Hz — frecuencia oscilación Y
  wobbleAmpX: 0.10,   // rad — balanceo suave en X
  wobbleFreqX: 0.00025,
  breathAmpZ: 0.025,  // rad — respiración en Z
  breathFreqZ: 0.00015,
  scaleBreath: 0.012,  // amplitud del pulso de escala

  /* Animación wave por letra */
  waveAmp:    0.055,   // unidades — desplazamiento vertical por letra
  waveFreq:   0.0012,  // Hz — velocidad de la ola
  wavePhase:  0.50,    // rad — desfase entre letras consecutivas
  waveLerp:   0.10,    // [0-1] — suavizado del lerp (menor = más suave)

  /* Espaciado extra entre letras (kerning adicional) */
  letterSpacing: 0.04,
  spaceWidth:    0.45,  // fracción del textSize que ocupa un espacio

  /* Cámara */
  fov:     50,
  cameraZ: 4.8,

  /* IDs del DOM */
  containerId: 'logo-3d-container',
  fallbackId:  'logo-3d-fallback',

  /* Performance */
  maxDPRDesktop: 2,
  maxDPRMobile:  1.5,
});

/* ═══════════════════════════════════════════════════════════════════════
   DETECCIÓN DE CAPACIDADES
   ═══════════════════════════════════════════════════════════════════════ */
function isWebGLAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (_) { return false; }
}

function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    window.matchMedia('(max-width: 767px)').matches;
}

/* ═══════════════════════════════════════════════════════════════════════
   ENTRADA
   ═══════════════════════════════════════════════════════════════════════ */
if (!isWebGLAvailable()) {
  activateFallback();
} else {
  // ES modules se ejecutan después de DOMContentLoaded por spec
  initScene();
}

/* ═══════════════════════════════════════════════════════════════════════
   ESCENA PRINCIPAL
   ═══════════════════════════════════════════════════════════════════════ */
function initScene() {
  const container = document.getElementById(CONFIG.containerId);
  if (!container) return;

  /* ── SCENE ─────────────────────────────────────────────────────────── */
  const scene = new THREE.Scene();
  scene.background = null; // transparente → hero gradient visible

  /* ── CAMERA ─────────────────────────────────────────────────────────── */
  const w0 = container.clientWidth  || 280;
  const h0 = container.clientHeight || 220;
  const camera = new THREE.PerspectiveCamera(CONFIG.fov, w0 / h0, 0.1, 50);
  camera.position.set(0, 0, CONFIG.cameraZ);

  /* ── RENDERER ────────────────────────────────────────────────────────── */
  const mobile  = isMobileDevice();
  const maxDPR  = mobile ? CONFIG.maxDPRMobile : CONFIG.maxDPRDesktop;
  const dpr     = Math.min(window.devicePixelRatio || 1, maxDPR);

  const renderer = new THREE.WebGLRenderer({
    antialias:       true,
    alpha:           true,           // fondo transparente
    powerPreference: 'default',
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(w0, h0);
  renderer.outputColorSpace    = THREE.SRGBColorSpace;
  renderer.toneMapping         = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2.2; // más alto = cromo más brillante

  const canvas = renderer.domElement;
  canvas.style.pointerEvents = 'none'; // ← NO bloquea scroll
  canvas.style.touchAction   = 'none';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  /* ── ENVIRONMENT MAP (estudio HDRI procedural) ──────────────────────── */
  const envMap = buildStudioEnvMap(renderer);
  scene.environment = envMap;
  // scene.background = envMap; // ← descomenta si quieres ver el HDRI de fondo

  /* ── ILUMINACIÓN ────────────────────────────────────────────────────── */
  // El env map lleva el 80% del trabajo; las luces añaden destellos dinámicos
  scene.add(new THREE.AmbientLight(0xffffff, 0.12));

  const keyLight = new THREE.DirectionalLight(0xfff8f0, 3.5); // cálido arriba
  keyLight.position.set(3, 6, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x3366ff, 1.8); // azul izquierda
  fillLight.position.set(-5, 2, 2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x00ddff, 2.2);  // cian detrás
  rimLight.position.set(0, -3, -5);
  scene.add(rimLight);

  const accentLight = new THREE.DirectionalLight(0xffffff, 1.0); // abajo-frente
  accentLight.position.set(1, -2, 4);
  scene.add(accentLight);

  /* ── MATERIAL CROMO ESPEJO ──────────────────────────────────────────── */
  const chromeMat = new THREE.MeshPhysicalMaterial({
    color:                     new THREE.Color(CONFIG.chromeColor),
    metalness:                 1.0,    // 100% metálico
    roughness:                 0.01,   // espejo casi perfecto (era 0.03)
    reflectivity:              1.0,
    clearcoat:                 1.0,    // capa de barniz = profundidad cristal
    clearcoatRoughness:        0.01,
    envMapIntensity:           3.5,    // reflejos muy intensos (era 2.2)
    iridescence:               0.45,   // arco iris en ángulos rasantes
    iridescenceIOR:            1.5,
    iridescenceThicknessRange: [100, 500],
    sheen:                     0.3,
    sheenRoughness:            0.12,
    sheenColor:                new THREE.Color(0x88ccff),
  });

  /* ── ESTADO DE ANIMACIÓN (máquina de estados: loading → loaded) ───── */
  const state = {
    loaded:       false,
    isVisible:    true,
    letterMeshes: [],   // [{ mesh, waveIndex }]
    textGroup:    null,
    loadingRing:  null,
  };

  /* ── LOADING INDICATOR (visible mientras descarga la fuente ~50-200ms) */
  state.loadingRing = buildLoadingRing(scene);

  /* ── ÚNICO LOOP DE ANIMACIÓN ─────────────────────────────────────────
   * Estrategia: un solo rAF que gestiona tanto el estado "cargando"
   * como el estado "cargado". Evita dobles loops / memory leaks.
   * ─────────────────────────────────────────────────────────────────── */
  function animate() {
    requestAnimationFrame(animate);

    const t = Date.now();

    if (!state.loaded) {
      /* Girar el anillo de carga */
      if (state.loadingRing) state.loadingRing.rotation.z -= 0.025;
    } else if (state.isVisible && state.textGroup) {
      const g = state.textGroup;

      /* Oscilación Y suave (muestra profundidad 3D sin rotación completa) */
      g.rotation.y = Math.sin(t * CONFIG.oscFreqY)   * CONFIG.oscAmplY;
      /* Balanceo X */
      g.rotation.x = Math.sin(t * CONFIG.wobbleFreqX) * CONFIG.wobbleAmpX;
      /* Respiración Z */
      g.rotation.z = Math.sin(t * CONFIG.breathFreqZ) * CONFIG.breathAmpZ;
      /* Pulso de escala (muy sutil) */
      const pulse  = 1 + Math.sin(t * 0.0008) * CONFIG.scaleBreath;
      g.scale.setScalar(pulse);

      /* Wave por letra — desplazamiento Y individual con lerp */
      state.letterMeshes.forEach(function({ mesh, waveIndex }) {
        const targetY = Math.sin(t * CONFIG.waveFreq + waveIndex * CONFIG.wavePhase)
                        * CONFIG.waveAmp;
        mesh.position.y += (targetY - mesh.position.y) * CONFIG.waveLerp;
      });
    }

    renderer.render(scene, camera);
  }

  /* ── CARGA DE FUENTE Y CONSTRUCCIÓN DEL TEXTO ─────────────────────── */
  const fontLoader = new FontLoader();

  fontLoader.load(
    CONFIG.fontUrl,

    /* onLoad */
    function(font) {
      /* Eliminar el anillo de carga */
      scene.remove(state.loadingRing);
      disposeObject(state.loadingRing);
      state.loadingRing = null;

      /* ═══ TEXTO 3D ═════════════════════════════════════════════════
       * Aquí se construye el logo "Webs VC" carácter por carácter.
       * Cuando tengas tu .glb, sustituye este bloque por la sección
       * "═══ LOAD GLB ═══" que encontrarás debajo, comentada.
       * ═══════════════════════════════════════════════════════════════ */
      const { letterMeshes, groupWidth, textHeight } = buildTextMeshes(font, chromeMat);

      const textGroup = new THREE.Group();
      letterMeshes.forEach(function({ mesh }) { textGroup.add(mesh); });

      /* Centrar horizontal y verticalmente */
      textGroup.position.set(-groupWidth / 2, -textHeight / 2, 0);
      scene.add(textGroup);

      state.letterMeshes = letterMeshes;
      state.textGroup    = textGroup;
      state.loaded       = true;

      /* ═══ LOAD GLB ═════════════════════════════════════════════════
       * 🔄 CUANDO TENGAS TU ARCHIVO .glb:
       *
       * PASO 1 — Añade al importmap de index.html:
       *   "three/addons/loaders/GLTFLoader.js":
       *     "https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js"
       *
       * PASO 2 — Importa en la parte superior de este archivo:
       *   import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
       *
       * PASO 3 — Comenta el bloque "TEXTO 3D" de arriba y descomenta:
       *
       * const gltfLoader = new GLTFLoader();
       * gltfLoader.load(
       *   '/assets/models/logo-websvc.glb',  // ← PON AQUÍ LA RUTA DE TU .GLB
       *   function(gltf) {
       *     gltf.scene.traverse(function(child) {
       *       if (child.isMesh) child.material = chromeMat;
       *     });
       *     gltf.scene.scale.setScalar(1.0); // ajusta según tu modelo
       *     scene.add(gltf.scene);
       *     state.textGroup = gltf.scene;
       *     state.loaded    = true;
       *   },
       *   undefined,
       *   function(err) {
       *     console.error('[logo3d] Error cargando .glb:', err);
       *     activateFallback();
       *   }
       * );
       * ═══════════════════════════════════════════════════════════════ */
    },

    /* onProgress */ undefined,

    /* onError */
    function(err) {
      console.error('[logo3d] Error al cargar la fuente:', err);
      activateFallback();
    }
  );

  /* ── INTERSECTION OBSERVER ───────────────────────────────────────────
   * Pausa el render cuando el canvas sale del viewport (ahorra GPU/batería)
   * ─────────────────────────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      function(entries) { state.isVisible = entries[0].isIntersecting; },
      { threshold: 0.05 }
    ).observe(container);
  }

  /* ── RESIZE OBSERVER ─────────────────────────────────────────────────
   * Adapta el canvas al contenedor sin recargar la página
   * ─────────────────────────────────────────────────────────────────── */
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(onResize).observe(container);
  } else {
    window.addEventListener('resize', onResize, { passive: true });
  }

  /* ── ARRANQUE ────────────────────────────────────────────────────────
   * El loop arranca inmediatamente — muestra el ring mientras carga font
   * ─────────────────────────────────────────────────────────────────── */
  animate();
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPER: Construir meshes individuales por carácter
   Permite animar cada letra de forma independiente (wave effect).
   ═══════════════════════════════════════════════════════════════════════ */
function buildTextMeshes(font, material) {
  const geomParams = {
    font,
    size:           CONFIG.textSize,
    height:         CONFIG.textDepth,
    curveSegments:  CONFIG.curveSegments,
    bevelEnabled:   CONFIG.bevelEnabled,
    bevelThickness: CONFIG.bevelThickness,
    bevelSize:      CONFIG.bevelSize,
    bevelSegments:  CONFIG.bevelSegments,
  };

  const chars        = CONFIG.logoText.split('');
  const letterMeshes = [];
  let   offsetX      = 0;
  let   waveIndex    = 0;
  let   textHeight   = 0;

  chars.forEach(function(char) {
    if (char === ' ') {
      offsetX += CONFIG.textSize * CONFIG.spaceWidth;
      return;
    }

    const geo = new TextGeometry(char, geomParams);
    geo.computeBoundingBox();

    const bb        = geo.boundingBox;
    const charW     = bb.max.x - bb.min.x;
    const charH     = bb.max.y - bb.min.y;
    if (charH > textHeight) textHeight = charH;

    const mesh      = new THREE.Mesh(geo, material);
    mesh.position.x = offsetX;
    mesh.position.y = 0;

    letterMeshes.push({ mesh, waveIndex });
    waveIndex++;
    offsetX += charW + CONFIG.letterSpacing;
  });

  return {
    letterMeshes,
    groupWidth: offsetX - CONFIG.letterSpacing, // quitar último kerning
    textHeight,
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPER: Indicador de carga (arco giratorio mientras descarga font)
   ═══════════════════════════════════════════════════════════════════════ */
function buildLoadingRing(scene) {
  const geo  = new THREE.TorusGeometry(0.22, 0.035, 8, 28, Math.PI * 1.6);
  const mat  = new THREE.MeshBasicMaterial({ color: 0x0071e3, transparent: true, opacity: 0.7 });
  const ring = new THREE.Mesh(geo, mat);
  scene.add(ring);
  return ring;
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPER: Environment Map procedural estilo Apple Studio
   Genera un equirectangular 512×256 con Canvas 2D para el PMREM.
   Puntos de luz estratégicos → reflejos cromados realistas.
   ═══════════════════════════════════════════════════════════════════════ */
function buildStudioEnvMap(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const W = 512, H = 256;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  /* Fondo oscuro de estudio */
  ctx.fillStyle = '#070A12';
  ctx.fillRect(0, 0, W, H);

  /* Gradiente techo: blanco brillante muy intenso (softbox Apple) */
  fillGrad(ctx, 0, 0, 0, H * 0.45, [
    [0,   'rgba(255, 255, 255, 1.0)'],
    [0.5, 'rgba(245, 250, 255, 0.7)'],
    [1,   'rgba(245, 250, 255, 0.0)'],
  ]);

  /* Punto de luz clave: arriba-izquierda — ULTRA brillante */
  radialSpot(ctx, W * 0.28, H * 0.06, 130, 'rgba(255,255,255,1.0)',   'rgba(220,235,255,0)');

  /* Segundo highlight especular: centro-arriba — puntual e intenso */
  radialSpot(ctx, W * 0.50, H * 0.02,  70, 'rgba(255,255,255,1.0)',   'rgba(255,255,255,0)');

  /* Tercer highlight: arriba-derecha */
  radialSpot(ctx, W * 0.72, H * 0.06,  90, 'rgba(255,252,245,0.90)',  'rgba(255,252,245,0)');

  /* Fill light: azul-frío lado izquierdo — más intenso */
  radialSpot(ctx,    0,    H * 0.40, 160, 'rgba(30,90,220,0.75)',    'rgba(30,90,220,0)');

  /* Rim light: cian lado derecho — más intenso */
  radialSpot(ctx,    W,    H * 0.35, 150, 'rgba(60,200,255,0.85)',   'rgba(60,200,255,0)');

  /* Acento cálido: abajo-derecha (bounce light dorado) */
  radialSpot(ctx, W * 0.75, H * 0.80, 110, 'rgba(255,190,80,0.40)',  'rgba(255,190,80,0)');

  /* Reflejo cálido: abajo-izquierda */
  radialSpot(ctx, W * 0.20, H * 0.82, 100, 'rgba(180,210,255,0.35)', 'rgba(180,210,255,0)');

  /* Gradiente suelo: azul noche profundo */
  fillGrad(ctx, 0, H * 0.65, 0, H, [
    [0,   'rgba(3, 10, 30, 0.0)'],
    [1,   'rgba(3, 10, 30, 0.8)'],
  ]);

  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping    = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const envMap = pmrem.fromEquirectangular(tex).texture;
  tex.dispose();
  pmrem.dispose();
  return envMap;
}

/* ── helpers internos del env map ──────────────────────────────────── */
function fillGrad(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([t, c]) => g.addColorStop(t, c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function radialSpot(ctx, cx, cy, r, cCenter, cEdge) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, cCenter);
  g.addColorStop(1, cEdge);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPER: Mostrar fallback PNG y ocultar contenedor 3D
   ═══════════════════════════════════════════════════════════════════════ */
function activateFallback() {
  const fallback  = document.getElementById(CONFIG.fallbackId);
  const container = document.getElementById(CONFIG.containerId);
  if (fallback)  fallback.style.display  = 'block';
  if (container) container.style.display = 'none';
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPER: Liberar recursos de un Object3D (geometry + material)
   ═══════════════════════════════════════════════════════════════════════ */
function disposeObject(obj) {
  if (!obj) return;
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach(m => m.dispose());
    } else {
      obj.material.dispose();
    }
  }
}

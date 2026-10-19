// ============================================================
//  PORTAL DEL RIO — CONSTRUCTORA MELENDEZ
//  Producido por MIESGROUP para Constructora Melendez
//
//  Dos tipologias + zonas comunes:
//    - Apartamento Tipo A  (69 m2 construidos)
//    - Apartamento Tipo B  (61 m2 construidos)
//    - Zonas comunes: piscina, BBQ, circuito de patinaje, salon social
//
//  PENDIENTE:
//    - Calibrar yaw/pitch de los hotspots con ?debug=1 (son aproximados:
//      salen de revisar a ojo cada panorama)
//    - Calibrar dotX/dotY y radarYawOffset del plano con ?debug=1
// ============================================================

import type { HotspotConfig, SceneConfig, FloorPlanRoomConfig, TourConfig } from '@/lib/tour-types';
import { assetPath } from '@/lib/asset-path';

const CONSTRUCTORA = 'melendez';
const PROYECTO     = 'portal-del-rio';

const BASE  = `/projects/${CONSTRUCTORA}/${PROYECTO}`;
const PANO  = (folder: 'tipo-a' | 'tipo-b' | 'areas', file: string) => assetPath(`${BASE}/panoramas/${folder}/${file}`);
const PLAN  = (file: string) => assetPath(`${BASE}/floor-plans/${file}`);
const GALLERY = (file: string) => assetPath(`${BASE}/images/gallery/${file}`);
const BRAND = (file: string) => assetPath(`/projects/${CONSTRUCTORA}/branding/${file}`);

// Prefijos de id de escena por apartamento
const A = 'pr-a-';   // Tipo A
const B = 'pr-b-';   // Tipo B
const AM = 'pr-am-'; // Zonas comunes

/** Hotspot de navegacion entre escenas del mismo apartamento. */
function go(prefix: string, from: string, to: string, label: string, yaw: number, pitch = -5): HotspotConfig {
  return {
    id: `${prefix}${from}-to-${to}`,
    pitch,
    yaw,
    type: 'scene',
    label,
    description: `Ir a ${label.toLowerCase()}`,
    targetSceneId: `${prefix}${to}`,
  };
}

/** Punto del plano (modo imagen): dotX/dotY en % de la imagen. x/y/width/height solo se usan
 *  como respaldo, asi que se dejan fijos.
 *  radarYawOffset: grados que se suman al yaw del visor para que el cono del plano apunte
 *  hacia donde mira la camara (0 = arriba en el plano, sentido horario). Se estimaron
 *  cruzando referencias de cada panorama (cama, TV, ventanas, cocina) con la planta;
 *  afinar con [ y ] en ?debug=1. */
function dot(prefix: string, key: string, label: string, dotX: number, dotY: number, radarYawOffset: number, adjacentTo: string[]): FloorPlanRoomConfig {
  return {
    id: `fp-${prefix}${key}`,
    sceneId: `${prefix}${key}`,
    label,
    x: 0, y: 0, width: 10, height: 10,
    dotX,
    dotY,
    radarYawOffset,
    adjacentTo: adjacentTo.map((k) => `${prefix}${k}`),
  };
}

// ─── Apartamento Tipo A (69 m2) ─────────────────────────────────────────
const scenesA: SceneConfig[] = [
  {
    id: `${A}acceso`, name: 'Acceso', description: 'Entrada, cocina y zona de oficios',
    panorama: PANO('tipo-a', 'acceso.jpg'),
    defaultView: { pitch: 0, yaw: 20, hfov: 100 },
    hotspots: [
      go(A, 'acceso', 'sala', 'Sala y comedor', 39.1, -8.4),
      go(A, 'acceso', 'hab-aux', 'Alcoba auxiliar', 85.4, -1.9),
      go(A, 'acceso', 'hall', 'Hall', 82.1, -17),
    ],
  },
  {
    id: `${A}sala`, name: 'Sala y comedor', description: 'Sala, comedor y cocina',
    panorama: PANO('tipo-a', 'sala.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(A, 'sala', 'balcon', 'Balcón', 20.1, -2.2),
      go(A, 'sala', 'acceso', 'Acceso', -122, -5.8),
      go(A, 'sala', 'hall', 'Hall', 115.9, -19.2),
      go(A, 'sala', 'estudio', 'Estudio', 58, -3),
    ],
  },
  {
    id: `${A}balcon`, name: 'Balcón', description: 'Balcón con vista',
    panorama: PANO('tipo-a', 'balcon.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(A, 'balcon', 'sala', 'Sala y comedor', 1.4, -4.5),
      go(A, 'balcon', 'estudio', 'Estudio', -54.9, -4.8),
      go(A, 'balcon', 'hall', 'Hall', -25, -3.4),
    ],
  },
  {
    id: `${A}estudio`, name: 'Estudio', description: 'Estudio y sala de TV',
    panorama: PANO('tipo-a', 'estudio.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(A, 'estudio', 'sala', 'Sala y comedor', -95, -5),
      go(A, 'estudio', 'hall', 'Hall', -159.4, -6),
      go(A, 'estudio', 'balcon', 'Balcón', -49.1, -3.7),
    ],
    variants: [
      { id: 'estudio', label: 'Estudio' },
      { id: 'hab-flex', label: 'Habitación flexible', linkSceneId: `${A}hab-flex` },
    ],
    variantButton: { pitch: 4.2, yaw: 49.7 },
  },
  {
    id: `${A}hab-flex`, name: 'Habitación flexible', description: 'El estudio convertido en alcoba',
    panorama: PANO('tipo-a', 'hab-flex.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(A, 'hab-flex', 'hall', 'Hall', -160, -14),
    ],
    variants: [
      { id: 'hab-flex', label: 'Habitación flexible' },
      { id: 'estudio', label: 'Estudio', linkSceneId: `${A}estudio` },
    ],
    variantButton: { pitch: 4.4, yaw: 49.7 },
  },
  {
    id: `${A}hall`, name: 'Hall', description: 'Circulación hacia las alcobas',
    panorama: PANO('tipo-a', 'hall.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(A, 'hall', 'hab-aux', 'Alcoba auxiliar', 78.9, -4.5),
      go(A, 'hall', 'hab-ppal', 'Alcoba principal', 177.1, -4.1),
      go(A, 'hall', 'bano-aux', 'Baño auxiliar', -118.3, -7.6),
      go(A, 'hall', 'sala', 'Sala y comedor', -59.1, -5.5),
      go(A, 'hall', 'acceso', 'Acceso', -89, -4.6),
      go(A, 'hall', 'estudio', 'Estudio', 3.5, -2.4),
    ],
  },
  {
    id: `${A}hab-aux`, name: 'Alcoba auxiliar', description: 'Alcoba auxiliar',
    panorama: PANO('tipo-a', 'hab-aux.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(A, 'hab-aux', 'hall', 'Hall', -91.3, -33),
      go(A, 'hab-aux', 'acceso', 'Acceso', -89.5, -10.2),
    ],
  },
  {
    id: `${A}hab-ppal`, name: 'Alcoba principal', description: 'Alcoba principal con vestier',
    panorama: PANO('tipo-a', 'hab-ppal.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(A, 'hab-ppal', 'hall', 'Hall', -147.9, -31.3),
      go(A, 'hab-ppal', 'bano-ppal', 'Baño principal', 120.2, 0.5),
      go(A, 'hab-ppal', 'bano-aux', 'Baño auxiliar', -169.4, -0.8),
      go(A, 'hab-ppal', 'sala', 'Sala y comedor', -148.9, -4.6),
    ],
  },
  {
    id: `${A}bano-aux`, name: 'Baño auxiliar', description: 'Baño social',
    panorama: PANO('tipo-a', 'bano-aux.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(A, 'bano-aux', 'hall', 'Hall', 105, -5),
      go(A, 'bano-aux', 'hab-ppal', 'Alcoba principal', -178.1, -3),
      // Segundo acceso al Hall (mirando al piso), con id propio para no repetir el del primero.
      { ...go(A, 'bano-aux', 'hall', 'Hall', 141.3, -37.1), id: `${A}bano-aux-to-hall-2` },
    ],
  },
  {
    id: `${A}bano-ppal`, name: 'Baño principal', description: 'Baño de la alcoba principal',
    panorama: PANO('tipo-a', 'bano-ppal.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [go(A, 'bano-ppal', 'hab-ppal', 'Alcoba principal', 175)],
  },
];

const roomsA: FloorPlanRoomConfig[] = [
  dot(A, 'acceso', 'Acceso', 74.2, 87.3, -88, ['sala', 'hab-aux', 'hall']),
  dot(A, 'sala', 'Sala y comedor', 51.2, 56.4, -85, ['acceso', 'balcon', 'hall', 'estudio']),
  dot(A, 'balcon', 'Balcón', 38, 59.4, 90, ['sala', 'estudio', 'hall']),
  dot(A, 'estudio', 'Estudio', 51.2, 19.9, -75, ['sala', 'hall', 'balcon']),
  // Sin lineas: esta burbuja vive en el recuadro de la alcoba opcional, fuera del plano principal.
  dot(A, 'hab-flex', 'Habitación flexible', 14.5, 30.8, -75, []),
  dot(A, 'hall', 'Hall', 72.7, 41.7, -105, ['hab-aux', 'hab-ppal', 'bano-aux', 'sala', 'acceso', 'estudio']),
  dot(A, 'hab-aux', 'Alcoba auxiliar', 69.8, 19.5, -60, ['hall', 'acceso']),
  dot(A, 'hab-ppal', 'Alcoba principal', 88.1, 34.4, 20, ['hall', 'bano-ppal', 'bano-aux', 'sala']),
  dot(A, 'bano-aux', 'Baño auxiliar', 83.1, 65.2, -170, ['hall', 'hab-ppal']),
  dot(A, 'bano-ppal', 'Baño principal', 93.1, 63.8, 180, ['hab-ppal']),
];

// ─── Apartamento Tipo B (61 m2) ─────────────────────────────────────────
const scenesB: SceneConfig[] = [
  {
    id: `${B}acceso`, name: 'Acceso', description: 'Entrada, cocina y zona de oficios',
    panorama: PANO('tipo-b', 'acceso.jpg'),
    defaultView: { pitch: 0, yaw: -70, hfov: 100 },
    hotspots: [
      go(B, 'acceso', 'sala', 'Sala', -68.5, -6.5),
      go(B, 'acceso', 'balcon', 'Balcón', -82.8, -2.2),
    ],
  },
  {
    id: `${B}sala`, name: 'Sala', description: 'Sala, cocina y balcón',
    panorama: PANO('tipo-b', 'sala.jpg'),
    defaultView: { pitch: 0, yaw: 60, hfov: 100 },
    hotspots: [
      go(B, 'sala', 'balcon', 'Balcón', 78, -5),
      go(B, 'sala', 'acceso', 'Acceso', -75, -5),
      go(B, 'sala', 'comedor', 'Comedor', -3.8, -7.5),
    ],
  },
  {
    id: `${B}balcon`, name: 'Balcón', description: 'Balcón con vista',
    panorama: PANO('tipo-b', 'balcon.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(B, 'balcon', 'sala', 'Sala', 130, -8),
      go(B, 'balcon', 'acceso', 'Acceso', -172.2, -2.9),
      go(B, 'balcon', 'comedor', 'Comedor', -150.7, -3.6),
      // Segundo acceso a la Sala (mirando al piso)
      { ...go(B, 'balcon', 'sala', 'Sala', -175.2, -23), id: `${B}balcon-to-sala-2` },
    ],
  },
  {
    id: `${B}comedor`, name: 'Comedor', description: 'Comedor y circulación a las alcobas',
    panorama: PANO('tipo-b', 'comedor.jpg'),
    defaultView: { pitch: 0, yaw: -60, hfov: 100 },
    hotspots: [
      go(B, 'comedor', 'sala', 'Sala', 160, -5),
      go(B, 'comedor', 'acceso', 'Acceso', -120.9, -5.4),
      // Ids con -2: asi los genero el modo debug; se conservan para que coincidan con sus ediciones guardadas.
      { ...go(B, 'comedor', 'hab-ppal', 'Alcoba principal', 22.3, -2.8), id: `${B}comedor-to-hab-ppal-2` },
      { ...go(B, 'comedor', 'hab-aux', 'Alcoba auxiliar', 53.7, -3.3), id: `${B}comedor-to-hab-aux-2` },
      go(B, 'comedor', 'bano-aux', 'Baño auxiliar', -10.6, -3.6),
    ],
    variants: [
      { id: 'comedor', label: 'Comedor' },
      { id: 'op-flexible', label: 'Opción flexible', linkSceneId: `${B}op-flexible` },
    ],
    variantButton: { pitch: -35, yaw: -30 },
  },
  {
    id: `${B}op-flexible`, name: 'Opción flexible', description: 'El comedor convertido en alcoba',
    panorama: PANO('tipo-b', 'op-flexible.jpg'),
    defaultView: { pitch: 0, yaw: -10, hfov: 100 },
    hotspots: [
      go(B, 'op-flexible', 'sala', 'Sala', -172),
      go(B, 'op-flexible', 'hab-aux', 'Alcoba auxiliar', 170),
    ],
    variants: [
      { id: 'op-flexible', label: 'Opción flexible' },
      { id: 'comedor', label: 'Comedor', linkSceneId: `${B}comedor` },
    ],
    variantButton: { pitch: -35, yaw: -20 },
  },
  {
    id: `${B}hab-aux`, name: 'Alcoba auxiliar', description: 'Alcoba auxiliar con escritorio',
    panorama: PANO('tipo-b', 'hab-aux.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(B, 'hab-aux', 'comedor', 'Comedor', -171.6, -6.4),
      go(B, 'hab-aux', 'bano-aux', 'Baño auxiliar', -146.7, -2.2),
    ],
  },
  {
    id: `${B}hab-ppal`, name: 'Alcoba principal', description: 'Alcoba principal con vestier',
    panorama: PANO('tipo-b', 'hab-ppal.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(B, 'hab-ppal', 'comedor', 'Comedor', -125, -5),
      go(B, 'hab-ppal', 'bano-ppal', 'Baño principal', -34.7, -2.7),
      go(B, 'hab-ppal', 'bano-aux', 'Baño auxiliar', -94.7, -4.6),
    ],
  },
  {
    id: `${B}bano-aux`, name: 'Baño auxiliar', description: 'Baño social',
    panorama: PANO('tipo-b', 'bano-aux.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [
      go(B, 'bano-aux', 'hab-aux', 'Alcoba auxiliar', -142.5, -4.9),
      go(B, 'bano-aux', 'comedor', 'Comedor', 100, -5),
      go(B, 'bano-aux', 'hab-ppal', 'Alcoba principal', 166.6, -5.5),
      go(B, 'bano-aux', 'sala', 'Sala', -98.1, -4.7),
    ],
  },
  {
    id: `${B}bano-ppal`, name: 'Baño principal', description: 'Baño de la alcoba principal',
    panorama: PANO('tipo-b', 'bano-ppal.jpg'),
    defaultView: { pitch: 0, yaw: 0, hfov: 100 },
    hotspots: [go(B, 'bano-ppal', 'hab-ppal', 'Alcoba principal', 175)],
  },
];

const roomsB: FloorPlanRoomConfig[] = [
  dot(B, 'acceso', 'Acceso', 66.6, 59.3, 95, ['sala', 'balcon']),
  dot(B, 'sala', 'Sala', 86.6, 20.3, -95, ['acceso', 'balcon', 'comedor']),
  dot(B, 'balcon', 'Balcón', 79.9, 5.8, 0, ['sala', 'acceso', 'comedor']),
  dot(B, 'comedor', 'Comedor', 50.6, 43.0, -85, ['acceso', 'sala', 'hab-aux', 'hab-ppal', 'bano-aux', 'balcon']),
  dot(B, 'op-flexible', 'Opción flexible', 59.9, 35.7, -85, ['sala', 'hab-aux']),
  dot(B, 'hab-aux', 'Alcoba auxiliar', 49.9, 16.6, -10, ['comedor', 'bano-aux']),
  dot(B, 'hab-ppal', 'Alcoba principal', 19.9, 18.5, -65, ['comedor', 'bano-ppal', 'bano-aux']),
  dot(B, 'bano-aux', 'Baño auxiliar', 23.9, 43.0, 180, ['hab-aux', 'comedor', 'hab-ppal', 'sala']),
  dot(B, 'bano-ppal', 'Baño principal', 7.9, 43.0, 180, ['hab-ppal']),
];

// ─── Zonas comunes ──────────────────────────────────────────────────────
// Se modelan como un "apartamento" especial (ver TourConfig.amenities). Sin plano.
const amenityScene = (key: string, name: string, description: string, file: string, hotspots: HotspotConfig[]): SceneConfig => ({
  id: `${AM}${key}`,
  name,
  description,
  panorama: PANO('areas', file),
  defaultView: { pitch: 0, yaw: 0, hfov: 100 },
  hotspots,
});

const templateConfig: TourConfig = {
  // ─── Marca ──────────────────────────────────────────────────────────
  brand: {
    name: 'Portal del Río',
    tagline: 'Constructora Meléndez',
    logo: BRAND('LogoPortalDelRioHorizontal.png'),
    website: 'https://www.constructoramelendez.com',
  },

  // ─── Tema visual ────────────────────────────────────────────────────
  theme: {
    // Paleta del logo Portal del Río: navy #1C2430 / #2C384C, naranja #F4AC5C, crema #E4E0D4
    primary: '#F4AC5C',
    secondary: '#C49058',
    panelBg: 'rgba(28, 36, 48, 0.88)',
    textPrimary: '#E4E0D4',
    textMuted: 'rgba(228, 224, 212, 0.55)',
    borderColor: 'rgba(244, 172, 92, 0.22)',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },

  // ─── Edificio y apartamentos ────────────────────────────────────────
  buildings: [
    {
      id: PROYECTO,
      name: 'Portal del Río',
      floors: 1,
      apartmentsPerFloor: 2,
      apartments: [
        {
          id: `${PROYECTO}-tipo-a`,
          name: 'Apartamento Tipo A',
          description: 'Sala · Comedor · 2 Alcobas · Estudio · 2 Baños · Balcón',
          floor: 0,
          position: 0,
          bedrooms: 2,
          bathrooms: 2,
          area: 69,
          areaPrivada: 62,
          hotspotX: 48.3,
          hotspotY: 33.5,
          cardDir: 'down',
          scenes: scenesA,
          floorPlan: {
            width: 1800,
            height: 1221,
            background: 'rgba(28, 36, 48, 0.6)',
            backgroundImage: PLAN('plano-tipo-a.jpg'),
            rooms: roomsA,
          },
        },
        {
          id: `${PROYECTO}-tipo-b`,
          name: 'Apartamento Tipo B',
          description: 'Sala · Comedor · 2 Alcobas · 2 Baños · Balcón',
          floor: 0,
          position: 1,
          bedrooms: 2,
          bathrooms: 2,
          area: 61,
          areaPrivada: 54,
          hotspotX: 25.7,
          hotspotY: 36.2,
          cardDir: 'down',
          scenes: scenesB,
          floorPlan: {
            width: 1800,
            height: 2646,
            background: 'rgba(28, 36, 48, 0.6)',
            backgroundImage: PLAN('plano-tipo-b.jpg'),
            rooms: roomsB,
          },
        },
      ],
    },
  ],

  amenities: {
    id: `${PROYECTO}-zonas-comunes`,
    name: 'Zonas comunes',
    description: 'Piscina · BBQ · Circuito de patinaje · Salón social',
    floor: 0,
    position: 2,
    // Posicion del ojo en la foto de la porteria (% de la imagen). Sale de la marcacion del cliente.
    hotspotX: 78.4,
    hotspotY: 71.3,
    cardDir: 'up',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    available: true,
    scenes: [
      amenityScene('piscina', 'Piscina', 'Piscina y zona húmeda', 'piscina.jpg', [
        go(AM, 'piscina', 'salon-social', 'Salón social', 95.4, 1),
        go(AM, 'piscina', 'bbq', 'BBQ', 66.4, 1.4),
        go(AM, 'piscina', 'circuito', 'Circuito de patinaje', 52, 1.1),
      ]),
      amenityScene('bbq', 'BBQ', 'Zona de BBQ y pérgola', 'bbq.jpg', [
        go(AM, 'bbq', 'piscina', 'Piscina', -108.8, 2.5),
        go(AM, 'bbq', 'salon-social', 'Salón social', 150.3, -0.8),
        go(AM, 'bbq', 'circuito', 'Circuito de patinaje', 42.5, 0.6),
      ]),
      amenityScene('circuito', 'Circuito de patinaje', 'Circuito de patinaje y juegos infantiles', 'circuito.jpg', [
        go(AM, 'circuito', 'bbq', 'BBQ', -159.4, -0.6),
        go(AM, 'circuito', 'salon-social', 'Salón social', 147.7, 2.3),
      ]),
      amenityScene('salon-social', 'Salón social', 'Salón social', 'salon-social.jpg', [
        go(AM, 'salon-social', 'bbq', 'BBQ', -21.3, -1.1),
      ]),
    ],
    floorPlan: { width: 900, height: 600, background: 'transparent', rooms: [] },
  },

  autoRotateSpeed: -0.5,
  showFloorPlan: true,
  showWelcome: true,

  // ─── Galería (renders y fotomontajes), con pestañas por categoría ────
  gallery: [
    ...([
      ['sala', 'Sala'],
      ['cocina', 'Cocina'],
      ['estudio', 'Estudio'],
      ['alcoba-principal', 'Alcoba principal'],
      ['alcoba-auxiliar', 'Alcoba auxiliar'],
      ['bano-principal', 'Baño principal'],
      ['balcon', 'Balcón'],
      ['zona-de-oficios', 'Zona de oficios'],
    ] as const).map(([file, title]) => ({
      id: `apto-${file}`,
      src: GALLERY(`aptos/${file}.jpg`),
      title,
      caption: 'Apartamento Tipo A · 69 m²',
      category: 'Apartamentos',
    })),
    ...([
      ['porteria', 'Portería'],
      ['piscina', 'Piscina'],
      ['gimnasio', 'Gimnasio'],
      ['coworking', 'Coworking'],
      ['juegos-infantiles', 'Juegos infantiles'],
    ] as const).map(([file, title]) => ({
      id: `zc-${file}`,
      src: GALLERY(`zonas-comunes/${file}.jpg`),
      title,
      category: 'Zonas comunes',
    })),
    ...[1, 2, 3].map((n) => ({
      id: `fotomontaje-${n}`,
      src: GALLERY(`fotomontajes/fotomontaje-${n}.jpg`),
      title: `Fotomontaje ${n}`,
      caption: 'Imagen ilustrativa del proyecto en su entorno',
      category: 'Fotomontajes',
    })),
  ],

  // ─── Plantas arquitectónicas (versión con áreas) ────────────────────
  plantas: [
    {
      id: 'planta-tipo-a',
      src: PLAN('planta-tipo-a-areas.jpg'),
      title: 'Apartamento Tipo A',
      caption: 'Área construida 69 m² · Área privada 62 m²',
    },
    {
      id: 'planta-tipo-b',
      src: PLAN('planta-tipo-b-areas.jpg'),
      title: 'Apartamento Tipo B',
      caption: 'Área construida 61 m² · Área privada 54 m²',
    },
  ],
};

export const portalDelRio = templateConfig;

export default templateConfig;

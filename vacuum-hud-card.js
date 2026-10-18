/* Vacuum HUD Card — custom Lovelace card for Home Assistant
 * Instrument-panel style card for robot vacuums: state, battery, controls,
 * suction, mop water level, last clean stats, map with room cleaning and
 * consumables (with reset) in one panel. Works with any `vacuum` entity;
 * every extra block is optional and hides itself when not configured.
 *
 * Install via HACS (recommended):
 *   HACS -> three-dot menu -> Custom repositories -> add this repository
 *   with category "Dashboard", install, then add a card with
 *   type: custom:vacuum-hud-card
 *
 * Manual install (alternative):
 *   copy this file to config/www/, add as a Lovelace resource:
 *     url: /local/vacuum-hud-card.js
 *     type: module
 *
 * UI language follows Home Assistant's configured language automatically.
 * Supported languages: English (en), Spanish (es). Others fall back to
 * English.
 */

const VERSION = "0.2.0";

const STRINGS = {
  en: {
    editor: {
      general: "General",
      status: "Status",
      consumables: "Consumables",
      map: "Map and rooms",
      display: "Display",
      entity: "Vacuum",
      name: "Name (optional)",
      battery: "Battery sensor (optional, else the vacuum's battery attribute)",
      problem: "Problem / error sensor",
      cleanArea: "Clean area sensor",
      cleanTime: "Clean time sensor",
      waterLevel: "Mop water level (select)",
      filter: "Filter life",
      filterReset: "Filter reset button",
      sideBrush: "Side brush life",
      sideBrushReset: "Side brush reset button",
      mainBrush: "Main brush life",
      mainBrushReset: "Main brush reset button",
      mop: "Mop life",
      mopReset: "Mop reset button",
      sensorCleaning: "Sensor cleaning",
      sensorCleaningReset: "Sensor cleaning reset button",
      mapEntity: "Map (camera or image entity)",
      mapSelect: "Map / floor selector (select)",
      rooms: "Rooms to show (optional, every mapped area by default)",
      showControls: "Show control buttons",
      showFanSpeed: "Show suction selector",
      showRooms: "Show room cleaning",
      showZone: "Show zone cleaning (draw on the map)",
    },
    states: {
      cleaning: "Cleaning",
      docked: "Docked",
      idle: "Idle",
      paused: "Paused",
      returning: "Returning",
      error: "Error",
      unavailable: "Unavailable",
      unknown: "Unknown",
    },
    actions: { start: "Start", pause: "Pause", stop: "Stop", home: "Dock", locate: "Locate" },
    speeds: {
      off: "Off", quiet: "Quiet", silent: "Silent", low: "Low", eco: "Eco", standard: "Standard",
      normal: "Normal", balanced: "Balanced", medium: "Medium", high: "High", strong: "Strong",
      turbo: "Turbo", max: "Max", "max+": "Max+", very_high: "Very high", auto: "Auto",
    },
    labels: {
      battery: "Battery",
      suction: "Suction",
      water: "Mop water",
      area: "Clean area",
      time: "Clean time",
      health: "Faults",
      noFaults: "None",
      fault: "Fault",
      consumables: "Consumables",
      filter: "Filter",
      sideBrush: "Side brush",
      mainBrush: "Main brush",
      mop: "Mop",
      sensors: "Sensors",
      reset: "Reset",
      confirmReset: "Reset?",
      done: "Done",
      notFound: "Entity not found",
      locked: "Can't be changed right now",
      rooms: "Rooms",
      clean: "Clean",
      noRooms: "Map the vacuum's segments to areas to send it to a room. Tap here to open its details.",
      roomsError: "Couldn't read the vacuum's rooms",
      floor: "Map",
      noRoomsFloor: "No rooms on this map are mapped to areas yet. Tap here to open the vacuum's details.",
      zone: "Zone",
      zoneHint: "Drag on the map to mark the zone",
      cleanZone: "Clean zone",
      cancel: "Cancel",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
    },
  },
  es: {
    editor: {
      general: "General",
      status: "Estado",
      consumables: "Consumibles",
      map: "Mapa y habitaciones",
      display: "Pantalla",
      entity: "Aspirador",
      name: "Nombre (opcional)",
      battery: "Sensor de batería (opcional; si no, el atributo del aspirador)",
      problem: "Sensor de avería / error",
      cleanArea: "Sensor de área limpiada",
      cleanTime: "Sensor de tiempo de limpieza",
      waterLevel: "Agua de la mopa (select)",
      filter: "Vida del filtro",
      filterReset: "Botón de reset del filtro",
      sideBrush: "Vida del cepillo lateral",
      sideBrushReset: "Botón de reset del cepillo lateral",
      mainBrush: "Vida del cepillo principal",
      mainBrushReset: "Botón de reset del cepillo principal",
      mop: "Vida de la mopa",
      mopReset: "Botón de reset de la mopa",
      sensorCleaning: "Limpieza de sensores",
      sensorCleaningReset: "Botón de reset de la limpieza de sensores",
      mapEntity: "Mapa (entidad camera o image)",
      mapSelect: "Selector de mapa / planta (select)",
      rooms: "Habitaciones a mostrar (opcional; por defecto, todas las áreas asociadas)",
      showControls: "Mostrar los botones de control",
      showFanSpeed: "Mostrar el selector de succión",
      showRooms: "Mostrar la limpieza por habitaciones",
      showZone: "Mostrar la limpieza por zona (dibujar en el mapa)",
    },
    states: {
      cleaning: "Limpiando",
      docked: "En la base",
      idle: "Parado",
      paused: "En pausa",
      returning: "Volviendo",
      error: "Error",
      unavailable: "No disponible",
      unknown: "Desconocido",
    },
    actions: { start: "Empezar", pause: "Pausar", stop: "Parar", home: "Base", locate: "Localizar" },
    speeds: {
      off: "Apagado", quiet: "Silencioso", silent: "Silencioso", low: "Baja", eco: "Eco", standard: "Estándar",
      normal: "Normal", balanced: "Equilibrada", medium: "Media", high: "Alta", strong: "Fuerte",
      turbo: "Turbo", max: "Máx", "max+": "Máx+", very_high: "Muy alta", auto: "Auto",
    },
    labels: {
      battery: "Batería",
      suction: "Succión",
      water: "Agua de la mopa",
      area: "Área limpiada",
      time: "Tiempo limpiando",
      health: "Averías",
      noFaults: "Ninguna",
      fault: "Avería",
      consumables: "Consumibles",
      filter: "Filtro",
      sideBrush: "Cepillo lateral",
      mainBrush: "Cepillo principal",
      mop: "Mopa",
      sensors: "Sensores",
      reset: "Resetear",
      confirmReset: "¿Resetear?",
      done: "Hecho",
      notFound: "No se encuentra la entidad",
      locked: "No se puede cambiar ahora",
      rooms: "Habitaciones",
      clean: "Limpiar",
      noRooms: "Asocia los segmentos del robot a áreas para mandarlo a una habitación. Toca aquí para abrir sus detalles.",
      roomsError: "No se han podido leer las habitaciones del robot",
      floor: "Mapa",
      noRoomsFloor: "Ninguna habitación de este mapa está asociada a un área. Toca aquí para abrir los detalles del robot.",
      zone: "Zona",
      zoneHint: "Arrastra sobre el mapa para marcar la zona",
      cleanZone: "Limpiar zona",
      cancel: "Cancelar",
      zoomIn: "Acercar",
      zoomOut: "Alejar",
    },
  },
};

// Same palette as the Ecowitt HUD card, so both cards sit well together.
const COLORS = {
  info: "#3b82c4",
  low: "#2ba86a",
  moderate: "#c78a00",
  danger: "#d1481c",
  neutral: "#8a92a3",
  accent: "#f5a623",
};

const STATE_COLORS = {
  cleaning: COLORS.low,
  returning: COLORS.info,
  paused: COLORS.moderate,
  error: COLORS.danger,
};

// VacuumEntityFeature bits
const F = { PAUSE: 4, STOP: 8, RETURN_HOME: 16, FAN_SPEED: 32, LOCATE: 512, START: 8192, CLEAN_AREA: 16384 };

const ICONS = {
  play: "M8,5.14V19.14L19,12.14L8,5.14Z",
  pause: "M14,19H18V5H14M6,19H10V5H6V19Z",
  stop: "M18,18H6V6H18V18Z",
  home: "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
  locate:
    "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
  reset:
    "M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z",
  check: "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",
  close: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  plus: "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
  minus: "M19,13H5V11H19V13Z",
  layers: "M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z",
  chevron: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
  alert:
    "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
};

const CONSUMABLES = [
  { key: "filter", reset: "filter_reset", label: "filter" },
  { key: "side_brush", reset: "side_brush_reset", label: "sideBrush" },
  { key: "main_brush", reset: "main_brush_reset", label: "mainBrush" },
  { key: "mop", reset: "mop_reset", label: "mop" },
  { key: "sensor_cleaning", reset: "sensor_cleaning_reset", label: "sensors" },
];

// Sections in display order. Each one keeps its own container, so an update
// only touches the parts that changed (the robot keeps spinning, the map
// image doesn't reload, the bars animate).
const SECTIONS = ["hero", "banner", "controls", "map", "pills", "stats", "cons"];

const CONFIRM_MS = 3000;
// A second tap that comes this soon after the first is a double-click, not a
// confirmation, so it doesn't reset anything.
const CONFIRM_MIN_MS = 400;

// Zone cleaning: integrations with a zone service and a map that carries
// `calibration_points` (pixel <-> vacuum coordinates), like Dreame Vacuum or
// Xiaomi with the cloud map extractor. Both take a list of [x1, y1, x2, y2].
const ZONE_SERVICES = {
  dreame_vacuum: ["dreame_vacuum", "vacuum_clean_zone"],
  xiaomi_miio: ["xiaomi_miio", "vacuum_clean_zone"],
};
// Shorter drags than this (in map pixels) are taps, not zones.
const ZONE_MIN_PX = 6;
const MAP_MAX_ZOOM = 5;

// Text states that mean "no fault" on fault/error sensors (Roborock reports
// `none`, Dreame `no_error`, binary sensors `off`).
const OK_STATES = new Set(["", "off", "0", "ok", "none", "no_error", "no error", "normal", "unavailable", "unknown"]);
const DURATION_SECONDS = { s: 1, min: 60, h: 3600, d: 86400 };
const DURATION_UNITS = new Set(Object.keys(DURATION_SECONDS));

function detectLang(hass) {
  const raw =
    (hass && hass.locale && hass.locale.language) ||
    (hass && hass.language) ||
    (typeof navigator !== "undefined" && navigator.language) ||
    "en";
  const lang = String(raw).toLowerCase().replace(/_/g, "-").split("-")[0];
  return Object.prototype.hasOwnProperty.call(STRINGS, lang) ? lang : "en";
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function icon(name, size = 20) {
  return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24"><path d="${ICONS[name]}"/></svg>`;
}

function levelColor(pct, warn, crit) {
  if (pct == null) return COLORS.neutral;
  if (pct <= crit) return COLORS.danger;
  if (pct <= warn) return COLORS.moderate;
  return COLORS.low;
}

function num(st) {
  if (!st) return null;
  const v = parseFloat(st.state);
  return isNaN(v) ? null : v;
}

function isUsable(st) {
  return !!st && st.state !== "unavailable" && st.state !== "unknown";
}

// A button's state is the time it was last pressed, so "unknown" (never
// pressed) is fine; only "unavailable" means it can't be pressed (Dreame
// disables its reset buttons while the part is at 100 %).
function isPressable(st) {
  return !!st && st.state !== "unavailable";
}

function isOn(st) {
  return !!st && !OK_STATES.has(String(st.state).toLowerCase());
}

function isDuration(st) {
  return !!st && (st.attributes.device_class === "duration" || DURATION_UNITS.has(st.attributes.unit_of_measurement));
}

// Consumable sensors come as a percentage left (Dreame, Ecovacs, Tuya) or as
// time left (Roborock, Xiaomi Miio). Time left has no known maximum, so it's
// shown as is instead of being drawn as a percentage bar.
function lifeKind(st) {
  if (num(st) == null) return null;
  const unit = st.attributes.unit_of_measurement;
  if (unit === "%" || unit == null || unit === "") return "pct";
  if (isDuration(st)) return "time";
  return null;
}

// Clean time as "2 h 10 min" (Home Assistant itself shows "130min").
function durationHtml(st) {
  const factor = DURATION_SECONDS[st && st.attributes.unit_of_measurement];
  const v = num(st);
  if (!factor || v == null || !isDuration(st)) return null;
  const mins = Math.round((v * factor) / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const unit = (u) => `<span class="stat-unit"> ${u}</span>`;
  return h ? `${h}${unit("h")}${m ? ` ${m}${unit("min")}` : ""}` : `${m}${unit("min")}`;
}

// Affine transform from three point pairs ([[sx, sy, dx, dy] x3]), solved
// with Cramer's rule. Returns (x, y) => [x', y'], or null if degenerate.
function affine(pairs) {
  const [p, q, r] = pairs;
  const det = p[0] * (q[1] - r[1]) - p[1] * (q[0] - r[0]) + (q[0] * r[1] - r[0] * q[1]);
  if (!det) return null;
  const solve = (k) => [
    (p[k] * (q[1] - r[1]) - p[1] * (q[k] - r[k]) + (q[k] * r[1] - r[k] * q[1])) / det,
    (p[0] * (q[k] - r[k]) - p[k] * (q[0] - r[0]) + (q[0] * r[k] - r[0] * q[k])) / det,
    (p[0] * (q[1] * r[k] - r[1] * q[k]) - p[1] * (q[0] * r[k] - r[0] * q[k]) + p[k] * (q[0] * r[1] - r[0] * q[1])) / det,
  ];
  const X = solve(2);
  const Y = solve(3);
  return (x, y) => [X[0] * x + X[1] * y + X[2], Y[0] * x + Y[1] * y + Y[2]];
}

// Map pixel <-> vacuum coordinate transforms from a map entity's
// calibration_points ([{ vacuum: {x, y}, map: {x, y} } x3]).
function calibration(st) {
  const pts = st && st.attributes.calibration_points;
  if (!Array.isArray(pts) || pts.length < 3) return null;
  const three = pts.slice(0, 3);
  const ok = three.every((c) => c && c.vacuum && c.map && [c.vacuum.x, c.vacuum.y, c.map.x, c.map.y].every(Number.isFinite));
  if (!ok) return null;
  const toVac = affine(three.map((c) => [c.map.x, c.map.y, c.vacuum.x, c.vacuum.y]));
  const toMap = affine(three.map((c) => [c.vacuum.x, c.vacuum.y, c.map.x, c.map.y]));
  return toVac && toMap ? { toVac, toMap } : null;
}

function deviceName(hass, entityId) {
  const ent = hass.entities && hass.entities[entityId];
  const dev = ent && ent.device_id && hass.devices && hass.devices[ent.device_id];
  return dev ? dev.name_by_user || dev.name || "" : "";
}

// Top-down robot: the side brush spins while cleaning, a ring pulses while
// returning, and a dock bar shows under it when docked.
function robotSvg(state, color) {
  return `
    <svg class="robot ${esc(state)}" viewBox="0 0 72 72" style="--c:${color}">
      <rect class="dock" x="16" y="63" width="40" height="5" rx="2.5"/>
      <circle class="ring" cx="36" cy="34" r="29"/>
      <circle class="body" cx="36" cy="34" r="25"/>
      <circle class="face" cx="36" cy="34" r="18"/>
      <path class="bumper" d="M15.5 21.5A25 25 0 0 1 56.5 21.5"/>
      <rect class="eye" x="31" y="13" width="10" height="4" rx="2"/>
      <circle class="button" cx="36" cy="38" r="5"/>
      <g class="brush">
        <path d="M19 18v-9M19 18l7.8 4.5M19 18l-7.8 4.5"/>
        <circle cx="19" cy="18" r="2.2"/>
      </g>
    </svg>`;
}

// Battery glyph like the one in the Ecowitt card preview.
function batterySvg(pct, color) {
  const w = pct == null ? 0 : Math.max(1, Math.round((13 * Math.min(100, pct)) / 100));
  return `
    <svg width="22" height="12" viewBox="0 0 22 12">
      <rect x="0.7" y="0.7" width="17.6" height="10.6" rx="2" fill="none" stroke="${color}" stroke-width="1.4"/>
      <rect x="18.6" y="3.5" width="2.6" height="5" rx="0.8" fill="${color}"/>
      <rect x="2.6" y="2.6" width="${w}" height="6.8" rx="1" fill="${color}"/>
    </svg>`;
}

// Guess the companion entities of a vacuum from the other entities of the
// same device. Only used to pre-fill a new card (getStubConfig).
function guessEntities(hass, vacuumId) {
  const out = {};
  const reg = hass && hass.entities;
  const dev = reg && reg[vacuumId] && reg[vacuumId].device_id;
  if (!dev) return out;
  const siblings = Object.values(reg).filter((e) => e.device_id === dev && e.entity_id !== vacuumId && hass.states[e.entity_id]);
  // Match on the object id and the name, never on the domain: every sensor's
  // entity id starts with "sensor.".
  const text = (id) => {
    const st = hass.states[id];
    return `${id.split(".")[1]} ${(st && st.attributes.friendly_name) || ""}`.toLowerCase();
  };
  // First match in registry order, or the best-ranked one when `rank` is given.
  const pick = (domain, test, rank) => {
    const hits = siblings
      .map((e) => e.entity_id)
      .filter((id) => id.startsWith(domain + ".") && test(hass.states[id], text(id)));
    if (rank) hits.sort((a, b) => rank(hass.states[b], text(b)) - rank(hass.states[a], text(a)));
    return hits[0];
  };
  const dc = (st, cls) => st.attributes.device_class === cls;
  const set = (key, id) => {
    if (id) out[key] = id;
  };
  const TOTAL = /total|lifetime|histor/;
  const LEFT = /left|restante|remaining/;
  set("battery", pick("sensor", (st) => dc(st, "battery")));
  set(
    "problem",
    pick("binary_sensor", (st, t) => dc(st, "problem") && /problem|error|fault/.test(t)) ||
      pick("sensor", (st, t) => /error|fault/.test(t) && !/count|time|code/.test(t)) ||
      pick("binary_sensor", (st) => dc(st, "problem"))
  );
  set("clean_area", pick("sensor", (st, t) => (dc(st, "area") || /clean(ing|ed)?.?area|área/.test(t)) && !TOTAL.test(t)));
  set(
    "clean_time",
    pick("sensor", (st, t) => /clean(ing)?.?time|tiempo de limpieza/.test(t) && !TOTAL.test(t) && !LEFT.test(t))
  );
  set("water_level", pick("select", (st, t) => /water|agua|mop|scrub|fregad/.test(t) && !/room|habitaci|mode|modo/.test(t)));
  const parts = {
    filter: /filter|filtro/,
    side_brush: /side.?brush|edge|lateral/,
    main_brush: /main.?brush|roll|rodillo|principal/,
    mop: /mop|mopa/,
    sensor_cleaning: /(^|[_ ])sensors?([_ ]|$)|limpieza de sensores/,
  };
  // Prefer a percentage over a time left; skip anything that isn't a
  // consumable life (e.g. Dreame's "mop pad installed" sensor).
  const life = (st) => ({ pct: 2, time: 1 })[lifeKind(st)] || 0;
  for (const [key, re] of Object.entries(parts)) {
    set(key, pick("sensor", (st, t) => re.test(t) && life(st) > 0 && !TOTAL.test(t), life));
    set(`${key}_reset`, pick("button", (st, t) => re.test(t) && /reset|restablec|reinici/.test(t)));
  }
  set(
    "map_select",
    pick("select", (st, t) => /selected.?map|current.?map|mapa seleccionado|piso seleccionado|floor/.test(t) && !/room|rotat/.test(t))
  );
  set(
    "map",
    pick("camera", (st, t) => /map|mapa/.test(t) && !/data|wifi/.test(t), (st, t) => (/_map\b/.test(t) ? 1 : 0)) ||
      pick("image", () => true)
  );
  return out;
}

class VacuumHudCardEditor extends HTMLElement {
  _withDefaults(config) {
    return { show_controls: true, show_fan_speed: true, show_rooms: true, show_zone: true, ...(config || {}) };
  }
  setConfig(config) {
    this._config = this._withDefaults(config);
    if (this._form) {
      this._form.data = this._config;
      return;
    }
    this._render();
  }
  set hass(hass) {
    this._hass = hass;
    if (this._form && this._builtLang === detectLang(hass)) {
      this._form.hass = hass;
      return;
    }
    this._render();
  }
  connectedCallback() {
    if (!this._form) this._render();
  }
  _schema(E) {
    const ent = (name, label, domain) => ({ name, label, selector: { entity: domain ? { domain } : {} } });
    return [
      {
        type: "expandable", name: "general", title: E.general, flatten: true, expanded: true,
        schema: [
          { ...ent("entity", E.entity, "vacuum"), required: true },
          { name: "name", label: E.name, selector: { text: {} } },
          ent("battery", E.battery, "sensor"),
        ],
      },
      {
        type: "expandable", name: "status", title: E.status, flatten: true,
        schema: [
          ent("problem", E.problem, ["binary_sensor", "sensor"]),
          ent("clean_area", E.cleanArea, "sensor"),
          ent("clean_time", E.cleanTime, "sensor"),
          ent("water_level", E.waterLevel, ["select", "input_select"]),
        ],
      },
      {
        type: "expandable", name: "map", title: E.map, flatten: true,
        schema: [
          ent("map", E.mapEntity, ["camera", "image"]),
          ent("map_select", E.mapSelect, ["select", "input_select"]),
          { name: "rooms", label: E.rooms, selector: { area: { multiple: true } } },
        ],
      },
      {
        type: "expandable", name: "consumables", title: E.consumables, flatten: true,
        schema: [
          ent("filter", E.filter, "sensor"),
          ent("filter_reset", E.filterReset, ["button", "script"]),
          ent("side_brush", E.sideBrush, "sensor"),
          ent("side_brush_reset", E.sideBrushReset, ["button", "script"]),
          ent("main_brush", E.mainBrush, "sensor"),
          ent("main_brush_reset", E.mainBrushReset, ["button", "script"]),
          ent("mop", E.mop, "sensor"),
          ent("mop_reset", E.mopReset, ["button", "script"]),
          ent("sensor_cleaning", E.sensorCleaning, "sensor"),
          ent("sensor_cleaning_reset", E.sensorCleaningReset, ["button", "script"]),
        ],
      },
      {
        type: "expandable", name: "display", title: E.display, flatten: true,
        schema: [
          { name: "show_controls", label: E.showControls, selector: { boolean: {} } },
          { name: "show_fan_speed", label: E.showFanSpeed, selector: { boolean: {} } },
          { name: "show_rooms", label: E.showRooms, selector: { boolean: {} } },
          { name: "show_zone", label: E.showZone, selector: { boolean: {} } },
        ],
      },
    ];
  }
  _render() {
    if (!this._hass || !this._config) return;
    this._builtLang = detectLang(this._hass);
    this.innerHTML = "";
    const form = document.createElement("ha-form");
    form.hass = this._hass;
    form.data = this._config;
    form.schema = this._schema(STRINGS[this._builtLang].editor);
    form.computeLabel = (s) => s.label || s.title || s.name;
    form.addEventListener("value-changed", (ev) => {
      this._config = ev.detail.value;
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
    });
    this._form = form;
    this.appendChild(form);
  }
}
customElements.define("vacuum-hud-card-editor", VacuumHudCardEditor);

class VacuumHudCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("vacuum-hud-card-editor");
  }
  static getStubConfig(hass) {
    const entity = Object.keys((hass && hass.states) || {}).find((id) => id.startsWith("vacuum."));
    return entity ? { entity, ...guessEntities(hass, entity) } : { entity: "" };
  }
  constructor() {
    super();
    this._confirm = {}; // reset entity -> "confirm" | "done"
    this._armedAt = {};
    this._timers = {};
    this._selected = []; // area ids picked for a room clean, in tap order
    this._rooms = null; // { entity, status: "loading" | "ok" | "error", areas }
    this._mode = null; // tool open on the map: "rooms" | "zone"
    this._zone = null; // [x1, y1, x2, y2] in vacuum coordinates
    this._drag = null; // { a: [x, y], b: [x, y] } in map pixels while drawing
  }
  setConfig(config) {
    if (!config || !config.entity) throw new Error("vacuum-hud-card: 'entity' is required");
    if (this._config && this._config.entity !== config.entity) {
      this._rooms = null;
      this._selected = [];
      this._speedsSeen = false;
    }
    this._config = config;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    }
    this._sig = null;
    this._render();
  }
  set hass(hass) {
    // A registry change (e.g. the rooms were just mapped to areas) brings a
    // new `entities` object: read the rooms again.
    if (this._hass && hass.entities !== this._hass.entities && this._rooms && this._rooms.status !== "loading") {
      this._rooms = null;
      this._sig = null;
    }
    this._hass = hass;
    // Only re-render when one of our entities (or the language) changed.
    const sig = this._signature();
    if (sig === this._sig) return;
    this._render();
  }
  getCardSize() {
    return this._config && this._config.map ? 12 : 7;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  disconnectedCallback() {
    Object.values(this._timers).forEach(clearTimeout);
    this._timers = {};
    this._confirm = {};
  }
  _ids() {
    const c = this._config;
    const keys = ["entity", "battery", "problem", "clean_area", "clean_time", "water_level", "map", "map_select"];
    CONSUMABLES.forEach((x) => keys.push(x.key, x.reset));
    return [...keys.map((k) => c[k]), this._mapEntityId()].filter(Boolean);
  }
  _signature() {
    if (!this._hass || !this._config) return null;
    // HA replaces a state object whenever it changes, so comparing
    // last_updated stamps is enough.
    const parts = this._ids().map((id) => {
      const st = this._hass.states[id];
      return st ? st.last_updated + st.state : "-";
    });
    return detectLang(this._hass) + "|" + parts.join("|") + "|" + JSON.stringify(this._confirm);
  }
  _st(key) {
    const id = this._config[key];
    return id ? this._hass.states[id] : undefined;
  }
  _call(domain, service, data, target) {
    Promise.resolve(this._hass.callService(domain, service, data, target)).catch((err) =>
      this.dispatchEvent(
        new CustomEvent("hass-notification", { detail: { message: (err && err.message) || String(err) }, bubbles: true, composed: true })
      )
    );
  }
  _moreInfo(entityId) {
    if (!entityId || !this._hass.states[entityId]) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }
  _onClick(ev) {
    const el = ev.target.closest("[data-action]");
    if (!el || !this._hass) return;
    const { action, value } = el.dataset;
    const entity_id = this._config.entity;
    switch (action) {
      case "more-info":
        this._moreInfo(value);
        break;
      case "vacuum":
        this._call("vacuum", value, { entity_id });
        break;
      case "fan":
        this._call("vacuum", "set_fan_speed", { entity_id, fan_speed: value });
        break;
      case "water": {
        const id = this._config.water_level;
        this._call(id.split(".")[0], "select_option", { entity_id: id, option: value });
        break;
      }
      case "reset":
        this._reset(value);
        break;
      case "map-select": {
        const id = this._config.map_select;
        this._call(id.split(".")[0], "select_option", { entity_id: id, option: value });
        if (this._floorOpen) {
          this._floorOpen = false;
          this._render();
        }
        break;
      }
      case "floor-menu":
        this._floorOpen = !this._floorOpen;
        this._render();
        break;
      case "zoom-in":
      case "zoom-out":
        this._zoomCenter(action === "zoom-in" ? 1.5 : 1 / 1.5);
        break;
      case "room": {
        const i = this._selected.indexOf(value);
        if (i >= 0) this._selected.splice(i, 1);
        else this._selected.push(value);
        this._render();
        break;
      }
      case "zone-mode":
      case "rooms-mode": {
        const mode = action === "zone-mode" ? "zone" : "rooms";
        this._mode = this._mode === mode ? null : mode;
        this._zone = null;
        this._drag = null;
        this._selected = [];
        this._render();
        break;
      }
      case "clean-zone": {
        const svc = this._zoneService();
        if (!svc || !this._zone) break;
        this._call(svc[0], svc[1], { zone: [this._zone], repeats: 1 }, { entity_id });
        this._mode = null;
        this._zone = null;
        this._render();
        break;
      }
      case "clean-rooms":
        if (!this._selected.length) break;
        this._call("vacuum", "clean_area", { cleaning_area_id: [...this._selected] }, { entity_id });
        this._selected = [];
        if (this._mode === "rooms") this._mode = null;
        this._render();
        break;
    }
  }
  // Resetting a consumable needs two taps: the first arms it for a few
  // seconds, the second presses the button.
  _reset(id) {
    if (!isPressable(this._hass.states[id])) return;
    if (this._confirm[id] === "confirm" && Date.now() - this._armedAt[id] < CONFIRM_MIN_MS) return;
    clearTimeout(this._timers[id]);
    if (this._confirm[id] === "confirm") {
      const domain = id.split(".")[0];
      if (domain === "script") this._call("script", "turn_on", { entity_id: id });
      else this._call("button", "press", { entity_id: id });
      this._confirm[id] = "done";
    } else {
      this._confirm[id] = "confirm";
      this._armedAt[id] = Date.now();
    }
    this._render();
    this._timers[id] = setTimeout(() => {
      delete this._confirm[id];
      this._render();
    }, CONFIRM_MS);
  }
  // Areas the vacuum can be sent to: the ones mapped to its segments in the
  // entity registry (Home Assistant's own "Clean areas" mapping). The
  // segments seen when mapping carry the name of their map (floor), so the
  // rooms can be narrowed down to the map that's loaded.
  _loadRooms() {
    const entity = this._config.entity;
    this._rooms = { entity, status: "loading", areas: [], floors: {}, knownFloors: new Set() };
    this._hass
      .callWS({ type: "config/entity_registry/get", entity_id: entity })
      .then((entry) => {
        const opts = (entry && entry.options && entry.options.vacuum) || {};
        const mapping = opts.area_mapping || {};
        const groupOf = {};
        const knownFloors = new Set();
        for (const seg of opts.last_seen_segments || []) {
          if (!seg || seg.group == null) continue;
          groupOf[seg.id] = seg.group;
          knownFloors.add(seg.group);
        }
        const areas = Object.keys(mapping).filter((a) => Array.isArray(mapping[a]) && mapping[a].length);
        const floors = {};
        areas.forEach((a) => (floors[a] = mapping[a].map((id) => groupOf[id]).filter((g) => g != null)));
        return { entity, status: "ok", areas, floors, knownFloors };
      })
      .catch(() => ({ entity, status: "error", areas: [], floors: {}, knownFloors: new Set() }))
      .then((rooms) => {
        if (!this._config || this._config.entity !== entity) return;
        this._rooms = rooms;
        this._render();
      });
  }
  // With one `image` entity per map (Roborock), follow the selected map: use
  // the device's image entity named after it.
  _mapEntityId() {
    const c = this._config;
    const id = c && c.map;
    const sel = c && this._hass && this._st("map_select");
    if (!id || !id.startsWith("image.") || !isUsable(sel)) return id;
    const ents = this._hass.entities || {};
    const dev = ents[id] && ents[id].device_id;
    if (!dev) return id;
    const want = String(sel.state).toLowerCase();
    const hit = Object.values(ents).find((e) => {
      const st = e.device_id === dev && e.entity_id.startsWith("image.") && this._hass.states[e.entity_id];
      return st && String(st.attributes.friendly_name || "").toLowerCase().endsWith(want);
    });
    return hit ? hit.entity_id : id;
  }
  _stateLabel(st, S) {
    if (!st) return S.labels.notFound;
    if (S.states[st.state]) return S.states[st.state];
    return this._hass.formatEntityState ? this._hass.formatEntityState(st) : st.state;
  }
  _speedLabel(st, value, S) {
    const k = String(value).toLowerCase().replace(/\s+/g, "_");
    if (S.speeds[k]) return S.speeds[k];
    return this._hass.formatEntityAttributeValue ? this._hass.formatEntityAttributeValue(st, "fan_speed", value) : value;
  }
  _optionLabel(st, value, S) {
    const k = String(value).toLowerCase().replace(/\s+/g, "_");
    if (S.speeds[k]) return S.speeds[k];
    return this._hass.formatEntityState ? this._hass.formatEntityState(st, value) : value;
  }
  _fmt(st) {
    if (!st) return { v: "—", u: "" };
    const v = num(st);
    if (v == null) return { v: esc(this._hass.formatEntityState ? this._hass.formatEntityState(st) : st.state), u: "" };
    // Home Assistant's own formatting: the entity's decimals and the user's
    // number format (decimal comma).
    if (this._hass.formatEntityStateToParts) {
      const parts = this._hass.formatEntityStateToParts(st);
      const join = (fn) => parts.filter(fn).map((p) => p.value).join("").trim();
      return { v: esc(join((p) => p.type !== "unit")), u: esc(join((p) => p.type === "unit")) };
    }
    return { v: esc(Math.round(v * 10) / 10), u: esc(st.attributes.unit_of_measurement || "") };
  }
  _build() {
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card>
        <div class="title"></div>
        ${SECTIONS.map((k) => `<div class="sec" data-sec="${k}"></div>`).join("")}
      </ha-card>`;
    const root = this.shadowRoot;
    const hero = root.querySelector('[data-sec="hero"]');
    hero.innerHTML = `
      <div class="row hero divider">
        <div class="clickable robot-wrap" data-action="more-info"></div>
        <div class="hero-main clickable" data-action="more-info"></div>
        <div class="battery-slot"></div>
      </div>`;
    const map = root.querySelector('[data-sec="map"]');
    map.innerHTML = `
      <div class="map-wrap divider">
        <div class="floors-slot"></div>
        <div class="map clickable" data-action="more-info">
          <div class="map-frame">
            <div class="map-view"><img alt=""><div class="zone-box" hidden></div></div>
            <div class="map-floor"></div>
            <div class="map-tools"></div>
            <div class="map-zoom"></div>
            <div class="map-panel" data-action="noop" hidden></div>
          </div>
        </div>
        <div class="rooms-slot"></div>
      </div>`;
    this._els = {
      title: root.querySelector(".title"),
      robot: hero.querySelector(".robot-wrap"),
      heroMain: hero.querySelector(".hero-main"),
      battery: hero.querySelector(".battery-slot"),
      mapWrap: map.firstElementChild,
      mapBox: map.querySelector(".map"),
      mapImg: map.querySelector("img"),
      rooms: map.querySelector(".rooms-slot"),
      floors: map.querySelector(".floors-slot"),
      tools: map.querySelector(".map-tools"),
      panel: map.querySelector(".map-panel"),
      zoneBox: map.querySelector(".zone-box"),
      mapFrame: map.querySelector(".map-frame"),
      mapView: map.querySelector(".map-view"),
      floorChip: map.querySelector(".map-floor"),
      zoom: map.querySelector(".map-zoom"),
      sec: {},
    };
    this._view = { s: 1, x: 0, y: 0 };
    this._ptrs = new Map();
    const frame = this._els.mapFrame;
    frame.addEventListener("pointerdown", (ev) => this._ptrDown(ev));
    frame.addEventListener("pointermove", (ev) => this._ptrMove(ev));
    frame.addEventListener("pointerup", (ev) => this._ptrUp(ev, true));
    frame.addEventListener("pointercancel", (ev) => this._ptrUp(ev, false));
    frame.addEventListener("wheel", (ev) => this._onWheel(ev), { passive: false });
    // A drag that moved the map isn't a tap on it.
    frame.addEventListener("click", (ev) => {
      if (!this._suppressClick) return;
      this._suppressClick = false;
      ev.stopPropagation();
    });
    this._els.mapImg.addEventListener("load", () => {
      this._setView(this._view.s, this._view.x, this._view.y);
      this._drawZone();
    });
    SECTIONS.forEach((k) => (this._els.sec[k] = root.querySelector(`[data-sec="${k}"]`)));
    this._html = new Map();
    this._mapUrl = null;
  }
  _zoneService() {
    const ent = this._hass.entities && this._hass.entities[this._config.entity];
    return ent && ZONE_SERVICES[ent.platform];
  }
  // Pointer position in the map image's own pixels. Uses only the rendered
  // box, so it stays right when the card is scaled with CSS zoom.
  _mapPoint(ev) {
    const img = this._els.mapImg;
    const rect = img.getBoundingClientRect();
    if (!rect.width || !rect.height || !img.naturalWidth) return null;
    const fx = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
    const fy = Math.min(1, Math.max(0, (ev.clientY - rect.top) / rect.height));
    return [fx * img.naturalWidth, fy * img.naturalHeight];
  }
  _frameScale() {
    const f = this._els.mapFrame;
    const rect = f.getBoundingClientRect();
    // Screen pixels per CSS pixel, so it also works with CSS zoom.
    return { rect, k: f.offsetWidth ? rect.width / f.offsetWidth : 1 };
  }
  // Zoom and pan as a transform on the image's wrapper (the zone overlay
  // rides along), kept inside the frame so no empty edge shows.
  _setView(s, x, y) {
    const f = this._els.mapFrame;
    const W = f.offsetWidth;
    const H = f.offsetHeight;
    s = Math.min(MAP_MAX_ZOOM, Math.max(1, s));
    x = s === 1 ? 0 : Math.min(0, Math.max(W * (1 - s), x));
    y = s === 1 ? 0 : Math.min(0, Math.max(H * (1 - s), y));
    this._view = { s, x, y };
    this._els.mapView.style.transform = s === 1 ? "" : `translate(${x}px, ${y}px) scale(${s})`;
    f.classList.toggle("zoomed", s > 1);
    const [zin, zout] = this._els.zoom.querySelectorAll("button");
    if (zin) zin.disabled = s >= MAP_MAX_ZOOM;
    if (zout) zout.disabled = s <= 1;
  }
  // Zoom to `s`, keeping the map point under (cx, cy) where it is.
  _zoomAt(cx, cy, s) {
    const { rect, k } = this._frameScale();
    const lx = (cx - rect.left) / k;
    const ly = (cy - rect.top) / k;
    const v = this._view;
    const ns = Math.min(MAP_MAX_ZOOM, Math.max(1, s));
    this._setView(ns, lx - (ns * (lx - v.x)) / v.s, ly - (ns * (ly - v.y)) / v.s);
  }
  _zoomCenter(factor) {
    const { rect } = this._frameScale();
    this._zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, this._view.s * factor);
  }
  _onWheel(ev) {
    if (!this._els.mapImg.naturalWidth || this._els.mapBox.hidden) return;
    // Scrolling out of an unzoomed map is left to the page, so it still scrolls.
    if (ev.deltaY > 0 && this._view.s <= 1) return;
    ev.preventDefault();
    this._zoomAt(ev.clientX, ev.clientY, this._view.s * Math.exp(-ev.deltaY * 0.002));
  }
  _pinchInfo() {
    const [a, b] = [...this._ptrs.values()];
    return { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
  }
  // One pointer draws a zone (zone mode) or pans a zoomed map; two pinch-zoom.
  _ptrDown(ev) {
    this._suppressClick = false;
    // The buttons and panels on the map are not the map.
    if (ev.target.closest && ev.target.closest("button, .map-panel:not(.hint), .floor-menu")) return;
    if (!this._els.mapImg.naturalWidth) return;
    this._ptrs.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    try {
      this._els.mapFrame.setPointerCapture(ev.pointerId);
    } catch (e) {
      // Not an active pointer (synthetic event): the rest still works.
    }
    if (this._ptrs.size === 2) {
      this._drag = null;
      this._pan = null;
      this._pinch = { ...this._pinchInfo(), v: { ...this._view } };
      this._drawZone();
      return;
    }
    if (this._ptrs.size > 2) return;
    if (this._mode === "zone" && this._calib) {
      const pt = this._mapPoint(ev);
      if (!pt) return;
      ev.preventDefault();
      this._drag = { a: pt, b: pt };
      this._drawZone();
    } else if (this._view.s > 1) {
      this._pan = { x: ev.clientX, y: ev.clientY, v: { ...this._view }, moved: false };
    }
  }
  _ptrMove(ev) {
    if (!this._ptrs.has(ev.pointerId)) return;
    this._ptrs.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (this._pinch) {
      if (this._ptrs.size < 2) return;
      const p = this._pinch;
      const cur = this._pinchInfo();
      const { rect, k } = this._frameScale();
      const ns = Math.min(MAP_MAX_ZOOM, Math.max(1, (p.v.s * cur.d) / p.d));
      // The map point that was under the fingers stays under them.
      const cx = ((p.mx - rect.left) / k - p.v.x) / p.v.s;
      const cy = ((p.my - rect.top) / k - p.v.y) / p.v.s;
      this._setView(ns, (cur.mx - rect.left) / k - ns * cx, (cur.my - rect.top) / k - ns * cy);
      return;
    }
    if (this._drag) {
      const pt = this._mapPoint(ev);
      if (pt) this._drag.b = pt;
      this._drawZone();
    } else if (this._pan) {
      const { k } = this._frameScale();
      const dx = (ev.clientX - this._pan.x) / k;
      const dy = (ev.clientY - this._pan.y) / k;
      if (Math.hypot(dx, dy) > 3) this._pan.moved = true;
      this._setView(this._pan.v.s, this._pan.v.x + dx, this._pan.v.y + dy);
    }
  }
  _ptrUp(ev, done) {
    if (!this._ptrs.has(ev.pointerId)) return;
    this._ptrs.delete(ev.pointerId);
    if (this._pinch) {
      if (this._ptrs.size < 2) this._pinch = null;
      return;
    }
    if (this._pan) {
      if (this._pan.moved) this._suppressClick = true;
      this._pan = null;
      return;
    }
    if (!this._drag) return;
    if (!done) {
      this._drag = null;
      this._drawZone();
      return;
    }
    const pt = this._mapPoint(ev);
    if (pt) this._drag.b = pt;
    const { a, b } = this._drag;
    this._drag = null;
    if (Math.abs(a[0] - b[0]) >= ZONE_MIN_PX && Math.abs(a[1] - b[1]) >= ZONE_MIN_PX && this._calib) {
      // All four corners, so a rotated map still gives the right box.
      const corners = [[a[0], a[1]], [b[0], a[1]], [a[0], b[1]], [b[0], b[1]]].map(([x, y]) => this._calib.toVac(x, y));
      const xs = corners.map((c) => c[0]);
      const ys = corners.map((c) => c[1]);
      this._zone = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(Math.round);
    }
    this._render();
  }
  // Draw the zone (or the one being dragged) over the map, in percentages of
  // the image so it follows any display size.
  _drawZone() {
    const box = this._els.zoneBox;
    const img = this._els.mapImg;
    let px = null;
    if (this._drag) px = [this._drag.a, this._drag.b];
    else if (this._zone && this._calib) {
      const [x1, y1, x2, y2] = this._zone;
      px = [this._calib.toMap(x1, y1), this._calib.toMap(x2, y2)];
    }
    if (!px || this._mode !== "zone" || !img.naturalWidth) {
      box.hidden = true;
      return;
    }
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    const l = Math.min(px[0][0], px[1][0]) / W;
    const t = Math.min(px[0][1], px[1][1]) / H;
    const w = Math.abs(px[0][0] - px[1][0]) / W;
    const h = Math.abs(px[0][1] - px[1][1]) / H;
    Object.assign(box.style, { left: `${l * 100}%`, top: `${t * 100}%`, width: `${w * 100}%`, height: `${h * 100}%` });
    box.hidden = false;
  }
  // Replace an element's content only when it actually changed.
  _patch(el, html) {
    if (this._html.get(el) === html) return;
    this._html.set(el, html);
    el.innerHTML = html;
  }
  _setMapImage(url) {
    const img = this._els.mapImg;
    if (url === this._mapUrl) return;
    this._mapUrl = url;
    if (!url) {
      img.removeAttribute("src");
      return;
    }
    if (!img.getAttribute("src")) {
      img.src = url;
      return;
    }
    // Load the new frame off-screen first, so the map doesn't blink.
    const next = new Image();
    next.onload = () => {
      if (this._mapUrl === url) img.src = url;
    };
    next.src = url;
  }
  _render() {
    if (!this.shadowRoot || !this._config || !this._hass) return;
    if (!this._els) this._build();
    this._sig = this._signature();
    const lang = detectLang(this._hass);
    const S = STRINGS[lang];
    const c = this._config;
    const vac = this._st("entity");
    const state = vac ? vac.state : "unavailable";
    const color = STATE_COLORS[state] || COLORS.neutral;
    const features = (vac && vac.attributes.supported_features) || 0;
    const has = (bit) => (features & bit) === bit;
    const els = this._els;
    const html = {};

    // Some integrations name the vacuum entity after its device, which makes
    // the friendly name read "D20 Pro Plus D20 Pro Plus": use the device name.
    els.title.textContent = c.name || deviceName(this._hass, c.entity) || (vac && vac.attributes.friendly_name) || c.entity;

    // Battery: dedicated sensor, else the (deprecated) vacuum attribute.
    const batSt = this._st("battery");
    const bat = batSt ? num(batSt) : vac && vac.attributes.battery_level != null ? Number(vac.attributes.battery_level) : null;
    const batColor = levelColor(bat, 40, 20);

    let sub = "";
    if (vac && vac.attributes.fan_speed) {
      sub = `${S.labels.suction}: ${esc(this._speedLabel(vac, vac.attributes.fan_speed, S))}`;
    }

    els.robot.dataset.value = c.entity;
    els.heroMain.dataset.value = c.entity;
    this._patch(els.robot, robotSvg(state, color));
    this._patch(
      els.heroMain,
      `<div class="hero-state">${esc(this._stateLabel(vac, S))}</div>${sub ? `<div class="hero-sub">${sub}</div>` : ""}`
    );
    this._patch(
      els.battery,
      bat == null
        ? ""
        : `<div class="battery clickable" data-action="more-info" data-value="${esc(c.battery || c.entity)}">
            <div class="battery-row">${batterySvg(bat, batColor)}<span class="battery-pct">${Math.round(bat)}%</span></div>
            <div class="battery-label">${S.labels.battery}</div>
          </div>`
    );

    // Problem banner
    const prob = this._st("problem");
    html.banner = "";
    if (isOn(prob) || state === "error") {
      // Prefer the sensor's description, then its (translated) state; a
      // binary sensor or a sensor that still reads "no error" says "Fault".
      let text = S.labels.fault;
      if (isOn(prob)) {
        const d = prob.attributes.description;
        if (d && !OK_STATES.has(String(d).toLowerCase())) text = d;
        else if (prob.state !== "on") text = this._hass.formatEntityState ? this._hass.formatEntityState(prob) : prob.state;
      }
      html.banner = `<div class="banner clickable" data-action="more-info" data-value="${esc(c.problem || c.entity)}">${icon("alert", 18)}<span>${esc(text)}</span></div>`;
    }

    // Controls
    html.controls = "";
    if (vac && c.show_controls !== false) {
      const btns = [];
      const cleaning = state === "cleaning";
      if (cleaning && has(F.PAUSE)) btns.push(["pause", "pause", S.actions.pause, true]);
      else if (has(F.START)) btns.push(["start", "play", S.actions.start, true]);
      if (has(F.STOP)) btns.push(["stop", "stop", S.actions.stop, false]);
      if (has(F.RETURN_HOME)) btns.push(["return_to_base", "home", S.actions.home, false]);
      if (has(F.LOCATE)) btns.push(["locate", "locate", S.actions.locate, false]);
      if (btns.length) {
        html.controls = `<div class="row controls divider">${btns
          .map(
            ([svc, ic, label, primary]) =>
              `<button class="ctl${primary ? " primary" : ""}" data-action="vacuum" data-value="${svc}" title="${esc(label)}">
                <span class="ctl-ic">${icon(ic, 22)}</span><span class="ctl-label">${esc(label)}</span>
              </button>`
          )
          .join("")}</div>`;
      }
    }

    // Suction + mop water pills
    const pillRow = (label, options, current, action, fmt) =>
      `<div class="pills-block">
        <div class="section-label">${esc(label)}</div>
        <div class="pills">${options
          .map((o) => `<button class="pill${o === current ? " on" : ""}" data-action="${action}" data-value="${esc(o)}">${esc(fmt(o))}</button>`)
          .join("")}</div>
      </div>`;
    const noteRow = (label, note) =>
      `<div class="pills-block"><div class="section-label">${esc(label)}</div><div class="note">${esc(note)}</div></div>`;
    let pills = "";
    const speeds = vac && vac.attributes.fan_speed_list;
    if (c.show_fan_speed !== false && vac) {
      if (has(F.FAN_SPEED) && Array.isArray(speeds) && speeds.length) {
        this._speedsSeen = true;
        pills += pillRow(S.labels.suction, speeds, vac.attributes.fan_speed, "fan", (o) => this._speedLabel(vac, o, S));
      } else if (this._speedsSeen) {
        // Some integrations drop the suction setting for a while (Dreame does
        // during a clean with per-room settings): say so instead of making
        // the block vanish.
        pills += noteRow(S.labels.suction, S.labels.locked);
      }
    }
    // Hidden while unavailable (e.g. Dreame without the mop attached), instead
    // of offering "Unavailable" as an option.
    const water = this._st("water_level");
    if (isUsable(water) && Array.isArray(water.attributes.options)) {
      pills += pillRow(S.labels.water, water.attributes.options, water.state, "water", (o) => this._optionLabel(water, o, S));
    }
    html.pills = pills ? `<div class="pills-wrap divider">${pills}</div>` : "";

    // Stats
    const stats = [];
    const statHtml = (key, label, inner) =>
      `<div class="stat clickable" data-action="more-info" data-value="${esc(c[key])}"><div class="stat-val">${inner}</div><div class="stat-label">${esc(label)}</div></div>`;
    for (const [key, label] of [["clean_area", S.labels.area], ["clean_time", S.labels.time]]) {
      if (!c[key]) continue;
      const st = this._st(key);
      const dur = durationHtml(st);
      const f = dur ? null : this._fmt(st);
      stats.push(statHtml(key, label, dur || `${f.v}<span class="stat-unit"> ${f.u}</span>`));
    }
    if (prob) {
      const bad = isOn(prob);
      stats.push(
        statHtml(
          "problem",
          S.labels.health,
          `<span style="color:${bad ? COLORS.danger : COLORS.low}">${icon(bad ? "alert" : "check", 16)}</span><span class="stat-txt">${esc(bad ? S.labels.fault : S.labels.noFaults)}</span>`
        )
      );
    }
    html.stats = stats.length ? `<div class="grid divider">${stats.join("")}</div>` : "";

    // Map + floor switch + room cleaning
    const sel = this._st("map_select");
    const floor = isUsable(sel) ? sel.state : null;
    const floorOpts = floor && Array.isArray(sel.attributes.options) ? sel.attributes.options : [];
    const floorName = (o) => this._optionLabel(sel, o, S);

    const mapId = this._mapEntityId();
    const mapSt = mapId ? this._hass.states[mapId] : undefined;
    const pic = mapSt && isUsable(mapSt) && mapSt.attributes.entity_picture;
    let mapUrl = null;
    if (pic) {
      // The state (or last_updated) changes with each new map frame.
      const stamp = encodeURIComponent(mapSt.state + mapSt.last_updated);
      const url = `${pic}${pic.includes("?") ? "&" : "?"}v=${stamp}`;
      mapUrl = this._hass.hassUrl ? this._hass.hassUrl(url) : url;
    }
    els.mapBox.hidden = !mapUrl;
    els.mapBox.dataset.value = mapId || "";

    // Map / floor switch: a bubble on the map's left corner that opens the
    // other maps, or a row of pills when there's no map image.
    let floors = "";
    let floorChip = "";
    if (floorOpts.length > 1 && mapUrl) {
      floorChip = `<button class="map-chip" data-action="floor-menu" title="${esc(S.labels.floor)}">${icon("layers", 16)}<span>${esc(floorName(floor))}</span>${icon("chevron", 14)}</button>`;
      if (this._floorOpen) {
        floorChip += `<div class="floor-menu">${floorOpts
          .map((o) => `<button class="${o === floor ? "on" : ""}" data-action="map-select" data-value="${esc(o)}">${esc(floorName(o))}</button>`)
          .join("")}</div>`;
      }
    } else if (floorOpts.length > 1) {
      floors = `<div class="section-label">${esc(S.labels.floor)}</div>
        <div class="pills">${floorOpts
          .map((o) => `<button class="pill${o === floor ? " on" : ""}" data-action="map-select" data-value="${esc(o)}">${esc(floorName(o))}</button>`)
          .join("")}</div>`;
    }
    if (!floorChip) this._floorOpen = false;
    this._patch(els.floors, floors);
    this._patch(els.floorChip, floorChip);

    // A different map (or floor) starts unzoomed.
    const viewKey = `${mapId}|${floor}`;
    this._patch(
      els.zoom,
      mapUrl
        ? `<button class="map-btn small" data-action="zoom-in" title="${esc(S.labels.zoomIn)}" aria-label="${esc(S.labels.zoomIn)}">${icon("plus", 18)}</button>
           <button class="map-btn small" data-action="zoom-out" title="${esc(S.labels.zoomOut)}" aria-label="${esc(S.labels.zoomOut)}">${icon("minus", 18)}</button>`
        : ""
    );
    if (this._viewKey !== viewKey) {
      this._viewKey = viewKey;
      this._setView(1, 0, 0);
    } else {
      this._setView(this._view.s, this._view.x, this._view.y);
    }

    // Room and zone cleaning sit as buttons on the map, so they don't make
    // the card longer. Without a map image, rooms go below as a list.
    this._calib = calibration(mapSt);
    const onMap = !!mapUrl;
    const zoneOk = !!(onMap && this._calib && this._zoneService() && isUsable(vac) && c.show_zone !== false);
    const roomsOk = !!(vac && has(F.CLEAN_AREA) && c.show_rooms !== false);
    if ((this._mode === "zone" && !zoneOk) || (this._mode === "rooms" && !(roomsOk && onMap))) {
      this._mode = null;
      this._zone = null;
    }

    let roomsBody = "";
    if (roomsOk) {
      if (!this._rooms || this._rooms.entity !== c.entity) this._loadRooms();
      const r = this._rooms;
      const known = this._hass.areas || {};
      let areas = r.areas.filter((a) => known[a]);
      if (Array.isArray(c.rooms) && c.rooms.length) areas = c.rooms.filter((a) => areas.includes(a));
      const mapped = areas.length;
      // Only the rooms of the loaded map: vacuums ignore segments of another
      // map. Skipped when the selector's name isn't one of the known maps.
      if (floor && r.knownFloors.has(floor)) areas = areas.filter((a) => (r.floors[a] || []).includes(floor));
      this._selected = this._selected.filter((a) => areas.includes(a));
      if (r.status === "error") {
        roomsBody = `<div class="note">${esc(S.labels.roomsError)}</div>`;
      } else if (r.status === "ok" && !areas.length) {
        const hint = mapped ? S.labels.noRoomsFloor : S.labels.noRooms;
        roomsBody = `<div class="note clickable" data-action="more-info" data-value="${esc(c.entity)}">${esc(hint)}</div>`;
      } else if (areas.length) {
        const n = this._selected.length;
        roomsBody = `
          <div class="rooms">
            <div class="pills">${areas
              .map((a) => {
                const ar = known[a];
                const ic = ar.icon ? `<ha-icon icon="${esc(ar.icon)}"></ha-icon>` : "";
                return `<button class="pill room${this._selected.includes(a) ? " on" : ""}" data-action="room" data-value="${esc(a)}">${ic}${esc(ar.name || a)}</button>`;
              })
              .join("")}</div>
            <button class="clean-btn" data-action="clean-rooms" ${n && isUsable(vac) ? "" : "disabled"}>
              ${icon("play", 16)}<span>${esc(S.labels.clean)}${n ? ` (${n})` : ""}</span>
            </button>
          </div>`;
      }
    }

    // While a tool is open, a tap on the map doesn't open its details.
    if (this._mode) els.mapBox.removeAttribute("data-action");
    else els.mapBox.setAttribute("data-action", "more-info");
    els.mapBox.classList.toggle("tool", !!this._mode);
    els.mapBox.classList.toggle("drawing", this._mode === "zone");

    const btn = (action, label, inner, cls = "") =>
      `<button class="map-btn${cls}" data-action="${action}" title="${esc(label)}" aria-label="${esc(label)}">${inner}</button>`;
    const zoneIc = `<svg class="ic" width="18" height="18" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2.5"/></svg>`;
    const roomsIc = `<svg class="ic" width="18" height="18" viewBox="0 0 24 24"><path d="M3 3h18v18H3zM3 12h7M10 3v5M10 16v5M14 12h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
    let tools = "";
    let panel = "";
    if (onMap) {
      if (this._mode === "zone") {
        tools = (this._zone ? btn("clean-zone", S.labels.cleanZone, icon("play", 18), " go") : "") + btn("zone-mode", S.labels.cancel, icon("close", 18));
        if (!this._zone) panel = `<div class="map-hint">${esc(S.labels.zoneHint)}</div>`;
      } else if (this._mode === "rooms") {
        tools = btn("rooms-mode", S.labels.cancel, icon("close", 18));
        panel = roomsBody;
      } else {
        tools = (roomsOk ? btn("rooms-mode", S.labels.rooms, roomsIc) : "") + (zoneOk ? btn("zone-mode", S.labels.zone, zoneIc) : "");
      }
    }
    this._patch(els.tools, tools);
    this._patch(els.panel, panel);
    els.panel.hidden = !panel;
    els.panel.classList.toggle("hint", this._mode === "zone");
    this._drawZone();
    this._setMapImage(mapUrl);

    const rooms = !onMap && roomsBody ? `<div class="section-label">${esc(S.labels.rooms)}</div>${roomsBody}` : "";
    this._patch(els.rooms, rooms);
    els.rooms.hidden = !rooms;
    els.floors.hidden = !floors;
    html.map = mapUrl || rooms || floors ? "map" : "";

    // Consumables
    const rows = CONSUMABLES.filter((x) => c[x.key])
      .map((x) => {
        const st = this._st(x.key);
        const kind = lifeKind(st);
        const pct = kind === "pct" ? Math.max(0, Math.min(100, num(st))) : null;
        const col = kind === "pct" ? levelColor(pct, 30, 10) : COLORS.neutral;
        let value = "—";
        if (kind === "pct") value = Math.round(pct) + "%";
        else if (kind === "time") value = this._hass.formatEntityState ? this._hass.formatEntityState(st) : `${st.state} ${st.attributes.unit_of_measurement || ""}`;
        const rid = c[x.reset];
        const mode = rid && this._confirm[rid];
        const resetOk = rid && isPressable(this._hass.states[rid]);
        const resetBtn = rid
          ? `<button class="reset${mode ? " " + mode : ""}" ${resetOk ? `data-action="reset" data-value="${esc(rid)}"` : "disabled"} title="${esc(S.labels.reset)}">
              ${icon(mode === "done" ? "check" : "reset", 15)}${mode === "confirm" ? `<span>${esc(S.labels.confirmReset)}</span>` : ""}
            </button>`
          : "";
        return `<div class="cons">
          <div class="cons-main clickable" data-action="more-info" data-value="${esc(c[x.key])}">
            <span class="cons-pct" style="color:${col}">${esc(value)}</span>
            ${kind === "time" ? "" : `<div class="track"><div class="fill" style="height:${pct || 0}%;background:${col}"></div></div>`}
            <span class="cons-name">${esc(S.labels[x.label])}</span>
          </div>
          ${resetBtn}
        </div>`;
      })
      .join("");
    html.cons = rows ? `<div class="cons-wrap"><div class="section-label">${S.labels.consumables}</div><div class="cons-grid">${rows}</div></div>` : "";

    for (const k of SECTIONS) {
      if (k === "hero") continue;
      if (k === "map") {
        els.sec.map.hidden = !html.map;
        continue;
      }
      this._patch(els.sec[k], html[k]);
      els.sec[k].hidden = !html[k];
    }
    // Whichever section ends up last drops its divider, so no line trails
    // into the empty padding at the bottom of the card.
    const visible = SECTIONS.filter((k) => !els.sec[k].hidden);
    SECTIONS.forEach((k) => els.sec[k].classList.toggle("last", k === visible[visible.length - 1]));
  }
}

const STYLE = `
  :host { display: block; }
  ha-card { display: block; padding: 22px 24px; background: var(--ha-card-background, var(--card-background-color, #fff)); color: var(--primary-text-color, #1c2128); font-family: -apple-system, "Segoe UI", Roboto, sans-serif; overflow: hidden; border-radius: var(--ha-card-border-radius, 12px); box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0,0,0,.12)); border: 1px solid var(--divider-color, rgba(0,0,0,.06)); box-sizing: border-box; height: 100%; }
  [hidden] { display: none !important; }
  .clickable { cursor: pointer; border-radius: 6px; transition: background .15s ease; }
  .clickable:hover { background: rgba(127,127,127,.12); }
  .clickable:active { background: rgba(127,127,127,.18); }
  .title { font-size: 13px; font-weight: 600; color: var(--secondary-text-color, #70788a); margin: 0 0 14px; letter-spacing: .02em; }
  .row { display: flex; }
  .divider { border-bottom: 1px solid var(--divider-color, rgba(0,0,0,.08)); }
  .sec.last > .divider { border-bottom: 0; padding-bottom: 0; }
  .ic { fill: currentColor; display: inline-block; vertical-align: middle; flex: none; }
  .section-label { font-size: 9px; letter-spacing: .08em; color: var(--secondary-text-color, #8a92a3); margin-bottom: 7px; text-transform: uppercase; font-weight: 600; }
  .note { font-size: 11.5px; color: var(--secondary-text-color, #70788a); padding: 2px 0; }
  .note.clickable { padding: 4px 6px; margin: 0 -6px; }

  .hero { align-items: center; gap: 14px; padding-bottom: 16px; }
  .robot-wrap { flex: none; padding: 2px; }
  .robot { width: 64px; height: 64px; display: block; overflow: visible; }
  .robot .body { fill: var(--card-background-color, #fff); stroke: var(--c); stroke-width: 2.4; }
  .robot .face { fill: var(--c); opacity: .12; }
  .robot .bumper { fill: none; stroke: var(--c); stroke-width: 4; stroke-linecap: round; opacity: .55; }
  .robot .eye { fill: var(--c); opacity: .7; }
  .robot .button { fill: var(--c); }
  .robot .brush { stroke: ${COLORS.accent}; stroke-width: 2; stroke-linecap: round; fill: ${COLORS.accent}; transform-box: view-box; transform-origin: 19px 18px; }
  .robot .ring { fill: none; stroke: var(--c); stroke-width: 1.5; opacity: 0; transform-box: view-box; transform-origin: 36px 34px; }
  .robot .dock { fill: var(--secondary-text-color, #8a92a3); opacity: 0; }
  .robot.cleaning .brush { animation: spin .7s linear infinite; }
  .robot.returning .ring { animation: pulse 1.6s ease-out infinite; }
  .robot.docked .dock { opacity: .45; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { from { opacity: .7; transform: scale(.85); } to { opacity: 0; transform: scale(1.15); } }
  @media (prefers-reduced-motion: reduce) { .robot .brush, .robot .ring { animation: none !important; } }

  .hero-main { flex: 1; min-width: 0; padding: 4px 6px; }
  .hero-state { font-size: 28px; font-weight: 600; line-height: 1.1; }
  .hero-sub { font-size: 12px; color: var(--secondary-text-color, #70788a); margin-top: 5px; }
  .battery-slot { flex: none; }
  .battery { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; padding: 4px 6px; }
  .battery-row { display: flex; align-items: center; gap: 5px; }
  .battery-pct { font-size: 15px; font-weight: 600; }
  .battery-label { font-size: 9px; color: var(--secondary-text-color, #70788a); }

  .banner { display: flex; align-items: center; gap: 8px; margin-top: 12px; padding: 8px 10px; background: rgba(209,72,28,.1); color: ${COLORS.danger}; font-size: 12px; font-weight: 600; }

  button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  button:disabled { cursor: default; opacity: .35; }
  .controls { justify-content: space-around; gap: 8px; padding: 16px 0; }
  .ctl { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 56px; }
  .ctl-ic { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--divider-color, rgba(0,0,0,.12)); color: var(--primary-text-color, #1c2128); transition: background .15s ease, transform .1s ease; }
  .ctl:hover .ctl-ic { background: rgba(127,127,127,.12); }
  .ctl:active .ctl-ic { transform: scale(.94); }
  .ctl.primary .ctl-ic { background: ${COLORS.low}; border-color: ${COLORS.low}; color: #fff; }
  .ctl.primary:hover .ctl-ic { background: #24935c; }
  .ctl-label { font-size: 9.5px; color: var(--secondary-text-color, #70788a); }

  .pills-wrap { display: flex; flex-direction: column; gap: 14px; padding: 16px 0; }
  .pills { display: flex; flex-wrap: wrap; gap: 6px; }
  .pill { font-size: 11.5px; padding: 5px 11px; border-radius: 999px; border: 1px solid var(--divider-color, rgba(0,0,0,.12)); color: var(--secondary-text-color, #70788a); transition: background .15s ease; display: inline-flex; align-items: center; gap: 5px; }
  .pill:hover { background: rgba(127,127,127,.12); }
  .pill.on { background: ${COLORS.info}; border-color: ${COLORS.info}; color: #fff; font-weight: 600; }
  .pill ha-icon { --mdc-icon-size: 15px; display: inline-flex; }

  .grid { display: flex; flex-wrap: wrap; gap: 18px 28px; padding: 14px 0; }
  .stat { padding: 2px 6px; margin: 0 -6px; }
  .stat-val { font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
  .stat-unit { font-size: 12px; color: var(--secondary-text-color, #70788a); font-weight: 400; }
  .stat-txt { font-size: 14px; }
  .stat-label { font-size: 9.5px; color: var(--secondary-text-color, #70788a); margin-top: 2px; }

  .map-wrap { display: flex; flex-direction: column; gap: 12px; padding: 16px 0; }
  .map { display: flex; justify-content: center; padding: 4px; }
  .map-frame { position: relative; max-width: 100%; overflow: hidden; border-radius: 6px; touch-action: pan-y; }
  .map-frame.zoomed { touch-action: none; cursor: grab; }
  .map-view { transform-origin: 0 0; }
  .map img { display: block; max-width: 100%; max-height: 320px; -webkit-user-drag: none; user-select: none; }
  .map-floor { position: absolute; top: 6px; left: 6px; max-width: calc(100% - 90px); }
  .map-chip { display: inline-flex; align-items: center; gap: 4px; max-width: 100%; height: 30px; padding: 0 8px 0 9px; border-radius: 999px; font-size: 11.5px; font-weight: 600; background: var(--card-background-color, #fff); color: var(--primary-text-color, #1c2128); border: 1px solid var(--divider-color, rgba(0,0,0,.12)); box-shadow: 0 1px 4px rgba(0,0,0,.18); box-sizing: border-box; }
  .map-chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .floor-menu { margin-top: 4px; display: flex; flex-direction: column; min-width: 120px; background: var(--card-background-color, #fff); border: 1px solid var(--divider-color, rgba(0,0,0,.12)); border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.22); overflow: hidden; }
  .floor-menu button { text-align: left; padding: 8px 12px; font-size: 11.5px; }
  .floor-menu button:hover { background: rgba(127,127,127,.12); }
  .floor-menu button.on { color: ${COLORS.info}; font-weight: 600; }
  .map-zoom { position: absolute; right: 6px; bottom: 6px; display: flex; flex-direction: column; gap: 5px; }
  .map-btn.small { width: 28px; height: 28px; }
  .map.tool, .map.tool:hover { cursor: default; background: none; }
  .map.drawing { cursor: crosshair; touch-action: none; }
  .zone-box { position: absolute; border: 2px solid ${COLORS.info}; background: rgba(59,130,196,.18); border-radius: 3px; pointer-events: none; box-sizing: border-box; }
  .map-tools { position: absolute; top: 6px; right: 6px; display: flex; gap: 6px; }
  .map-btn { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--card-background-color, #fff); color: var(--primary-text-color, #1c2128); border: 1px solid var(--divider-color, rgba(0,0,0,.12)); box-shadow: 0 1px 4px rgba(0,0,0,.18); }
  .map-btn:hover { filter: brightness(.95); }
  .map-btn.go { background: ${COLORS.low}; border-color: ${COLORS.low}; color: #fff; }
  .map-panel { position: absolute; left: 6px; right: 6px; bottom: 6px; max-height: calc(100% - 50px); overflow: auto; padding: 8px; border-radius: 8px; background: var(--card-background-color, #fff); box-shadow: 0 2px 8px rgba(0,0,0,.22); cursor: default; box-sizing: border-box; }
  .map-panel .rooms { flex-direction: column; align-items: stretch; gap: 8px; }
  .map-panel .clean-btn { align-self: flex-end; }
  .map-panel.hint { pointer-events: none; left: 6px; right: 42px; padding: 0; background: none; box-shadow: none; overflow: visible; }
  .map-hint { display: inline-block; font-size: 11px; line-height: 1.3; color: #fff; background: rgba(0,0,0,.6); padding: 4px 10px; border-radius: 12px; }
  .rooms { display: flex; align-items: flex-end; gap: 10px; }
  .rooms .pills { flex: 1; min-width: 0; }
  .clean-btn { flex: none; display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 600; padding: 6px 12px; border-radius: 999px; background: ${COLORS.low}; color: #fff; transition: background .15s ease; }
  .clean-btn:not(:disabled):hover { background: #24935c; }

  .cons-wrap { padding-top: 16px; }
  .cons-grid { display: flex; justify-content: space-around; gap: 4px; }
  .cons { display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1; min-width: 0; }
  .cons-main { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 4px 6px; width: 100%; box-sizing: border-box; flex: 1; }
  .cons-pct { font-size: 13px; font-weight: 600; text-align: center; }
  .cons-name { font-size: 9.5px; color: var(--secondary-text-color, #70788a); text-align: center; line-height: 1.2; }
  .track { width: 8px; height: 40px; border-radius: 4px; background: var(--divider-color, rgba(0,0,0,.07)); overflow: hidden; display: flex; align-items: flex-end; }
  .fill { width: 100%; border-radius: 4px; transition: height .4s ease; }
  .reset { display: flex; align-items: center; gap: 4px; height: 28px; min-width: 28px; justify-content: center; border-radius: 14px; color: var(--secondary-text-color, #8a92a3); font-size: 10.5px; font-weight: 600; transition: background .15s ease; }
  .reset:not(:disabled):hover { background: rgba(127,127,127,.12); }
  .reset.confirm { background: rgba(209,72,28,.12); color: ${COLORS.danger}; padding: 0 8px; font-size: 9.5px; }
  .reset.done { color: ${COLORS.low}; }
`;

customElements.define("vacuum-hud-card", VacuumHudCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "vacuum-hud-card",
  name: "Vacuum HUD Card",
  description: "Instrument-panel robot vacuum card: state, battery, controls, suction, mop water, last clean, map with room cleaning and consumables with reset",
  preview: true,
  documentationURL: "https://github.com/pablopeza/vacuum-hud-card",
});

console.info(`%c VACUUM-HUD-CARD %c v${VERSION} `, "color:#fff;background:#3b82c4;font-weight:600", "color:#3b82c4");

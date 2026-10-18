<img src="https://cdn.jsdelivr.net/gh/pablopeza/vacuum-hud-card@main/images/logo.svg?v=1" alt="Vacuum HUD Card logo" width="96">

# Vacuum HUD Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/pablopeza/vacuum-hud-card/blob/main/LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/pablopeza/vacuum-hud-card)](https://github.com/pablopeza/vacuum-hud-card/releases)

An instrument-panel Lovelace card for robot vacuums in Home Assistant. State,
battery, controls, suction, mop water, last clean, map with room cleaning and
consumables in a single readable panel. It works with any `vacuum` entity: every block is optional and
hides itself when its entities aren't set.

It's the sibling of the [Weather Station Card](https://github.com/luisanllo/ecowitt-hud-card)
and shares its look, so both sit well together on a dashboard.

<img src="https://cdn.jsdelivr.net/gh/pablopeza/vacuum-hud-card@main/images/preview-light.png?v=2" alt="Light mode preview" width="380"> <img src="https://cdn.jsdelivr.net/gh/pablopeza/vacuum-hud-card@main/images/preview-dark.png?v=2" alt="Dark mode preview" width="380">

*Light and dark mode: it follows your active Home Assistant theme.*

## Features

- 🤖 Top-down robot that shows what it's doing: the side brush spins while cleaning, a ring pulses while returning, and the dock shows when it's docked
- 🔋 Battery from a battery sensor, or from the vacuum's `battery_level` attribute on older integrations
- ▶️ Start/pause, stop, return to dock and locate. Only the buttons your vacuum supports are shown
- 🌀 Suction selector from the vacuum's `fan_speed_list`
- 💧 Mop water level selector (any `select` entity)
- 📏 Last clean area and time, and a fault indicator with a banner showing the error description
- 🗺️ Map image (any `camera` or `image` entity) you can **zoom and pan**, a **map / floor switch**, **room cleaning** (pick one or more rooms and send the vacuum there) and **zone cleaning** (draw a rectangle on the map)
- 🧽 Consumables (filter, side brush, main brush, mop, sensor cleaning) with color-coded bars and a **two-tap reset**: the first tap arms it, the second presses the reset button. Integrations that report time left instead of a percentage (Roborock, Xiaomi) show the time left
- 👆 Every value opens Home Assistant's more-info dialog when tapped
- 🎨 Visual editor that **pre-fills the companion entities** of the vacuum's device (battery, faults, consumables, reset buttons, map…)
- 🌗 Follows Home Assistant's light/dark theme
- 🌍 UI in English or Spanish, picked from your Home Assistant language

## Installation

### Via HACS (recommended)

1. HACS → **⋮** menu (top right) → **Custom repositories**
2. URL: `https://github.com/pablopeza/vacuum-hud-card`, category **Dashboard**
3. Search for **"Vacuum HUD Card"** in HACS → Download
4. Add the resource if HACS doesn't do it for you:
   - URL: `/hacsfiles/vacuum-hud-card/vacuum-hud-card.js`
   - Type: JavaScript Module

### Manual

1. Download [`vacuum-hud-card.js`](https://github.com/pablopeza/vacuum-hud-card/blob/main/vacuum-hud-card.js) to `config/www/`
2. Settings → Dashboards → **⋮** menu → Resources → add:
   - URL: `/local/vacuum-hud-card.js`
   - Type: JavaScript Module

## Configuration

Add the card from the card picker ("Vacuum HUD Card") and the editor fills in
what it finds on your vacuum's device. Or use YAML with `type: custom:vacuum-hud-card`.
Only `entity` is required.

| Option | Required | Description |
|---|---|---|
| `entity` | ✅ | The `vacuum` entity |
| `name` | | Card title (defaults to the vacuum's device name) |
| `battery` | | Battery sensor (`%`). Falls back to the vacuum's `battery_level` attribute |
| `problem` | | Fault entity: a `binary_sensor` (`device_class: problem`) or a text sensor. States like `none`, `no_error` or `ok` count as no fault. Its `description` attribute, if any, is shown in the banner |
| `clean_area` | | Last clean area sensor |
| `clean_time` | | Last clean time sensor |
| `water_level` | | Mop water level `select` / `input_select` |
| `filter` / `filter_reset` | | Filter life sensor (`%` or time left) and its reset `button` (or `script`) |
| `side_brush` / `side_brush_reset` | | Side brush life sensor and its reset button |
| `main_brush` / `main_brush_reset` | | Main brush life sensor and its reset button |
| `mop` / `mop_reset` | | Mop life sensor and its reset button |
| `sensor_cleaning` / `sensor_cleaning_reset` | | Sensor cleaning sensor and its reset button |
| `map` | | Map `camera` or `image` entity |
| `map_select` | | The vacuum's map / floor `select` (e.g. Dreame's or Roborock's "Selected map") |
| `rooms` | | Area IDs to offer for room cleaning, in this order (defaults to every area mapped to the vacuum) |
| `show_rooms` | | Show room cleaning (default `true`) |
| `show_zone` | | Show zone cleaning when the map supports it (default `true`) |
| `show_controls` | | Show the control buttons (default `true`) |
| `show_fan_speed` | | Show the suction selector (default `true`) |

### Example

```yaml
type: custom:vacuum-hud-card
entity: vacuum.conga
battery: sensor.conga_battery
problem: binary_sensor.conga_problem
clean_area: sensor.conga_clean_area
clean_time: sensor.conga_clean_time
water_level: select.conga_water_level
filter: sensor.conga_filter_life
filter_reset: button.conga_reset_filter
side_brush: sensor.conga_edge_brush_life
side_brush_reset: button.conga_reset_edge_brush
main_brush: sensor.conga_roll_brush_life
main_brush_reset: button.conga_reset_roll_brush
mop: sensor.conga_mop_life
mop_reset: button.conga_reset_mop
```

Consumable bars turn amber at 30 % and red at 10 %. The battery turns amber at
40 % and red at 20 %. A consumable that reports time left (`device_class:
duration`) is shown as time, without a bar: the card doesn't know its total life.

### Map and room cleaning

`map` shows the vacuum's map from any `camera` or `image` entity (the editor
picks the one on the vacuum's device) and refreshes it when the entity updates.
Zoom in with the + / − buttons on the map, the mouse wheel or a two-finger
pinch, and drag to move around a zoomed map.

With several maps (one per floor), `map_select` adds a bubble in the map's top
left corner that shows the selected map and opens the others to switch to
(without a map image, it's a row of buttons instead). It's hidden while the `select` is
unavailable (Dreame, for example, while it's mapping). If `map` is an `image`
entity and the device has one image per map (Roborock), the card shows the one
named after the selected map.

Room cleaning uses Home Assistant's own area cleaning (`vacuum.clean_area`,
Home Assistant 2026.3 or later), so it works with any integration that supports
it, such as Roborock or Dreame Vacuum. The rooms are the Home Assistant areas
you mapped to the vacuum's segments: open the vacuum's more-info dialog and map
them under **Clean areas**. Until you do, the card shows a hint that opens that
dialog.

Room and zone cleaning are buttons in the map's corner, so they don't make the
card longer (without a map image, the rooms are listed below instead). The
rooms button opens a panel over the map: tap one or more rooms, then **Clean**.
When the maps have names Home Assistant knows from the area mapping, only the
rooms of the selected map are offered, since vacuums ignore rooms on another
map. They're sent in the order you tapped
them, though not every vacuum follows that order. With `rooms` you can limit and
order the rooms the card offers:

```yaml
map: camera.d20_pro_plus_map
map_select: select.d20_pro_plus_selected_map
rooms:
  - kitchen
  - living_room
```

### Zone cleaning

Tap the zone button on the map, drag a rectangle, then the green play button. It needs a map
entity with `calibration_points` (to turn image pixels into the vacuum's
coordinates) and an integration with a zone cleaning action: Dreame Vacuum
(`dreame_vacuum.vacuum_clean_zone`) or Xiaomi Miio
(`xiaomi_miio.vacuum_clean_zone`, with a map from the Xiaomi Cloud Map
Extractor). The button only shows when both are there.

## Why

I wrote it for a Cecotec Conga 1790, a Tuya vacuum that Cecotec stopped
supporting and that now runs fully local through
[Tuya Local](https://github.com/make-all/tuya-local). Nothing in the card is
specific to it, though.

## License

[MIT](https://github.com/pablopeza/vacuum-hud-card/blob/main/LICENSE)

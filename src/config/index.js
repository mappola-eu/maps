export const MAP_STYLE = 
  document.querySelector('meta[name="map.style"]')?.getAttribute('content');

export const DEFAULT_LON =
  document.querySelector('meta[name="default.lon"]')?.getAttribute('content') || 17;

export const DEFAULT_LAT =
  document.querySelector('meta[name="default.lat"]')?.getAttribute('content') || 41.5;

export const DEFAULT_ZOOM = 
  document.querySelector('meta[name="default.zoom"]')?.getAttribute('content') || 6;

export const MAX_ZOOM =
  document.querySelector('meta[name="max.zoom"]')?.getAttribute('content') || 12;

export const CLICK_THRESHOLD = 8;
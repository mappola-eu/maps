const toFeature = result => ({
  type: 'Feature',
  properties: {
    count: 1,
    results: [ result.id ]
  },
  geometry: {
    type: 'Point',
    coordinates: result.coords.slice().reverse()
  }
});

export const EMPTY_GEOJSON = {
  type: 'FeatureCollection',
  features: []
}

// https://stackoverflow.com/questions/30703212/how-to-convert-radius-in-metres-to-pixels-in-mapbox-leaflet
const metersPerPixel = function(latitude, zoom) {
  const earthCircumference = 40075017;
  const latRad = latitude * (Math.PI / 180);
  return earthCircumference * Math.cos(latRad) / Math.pow(2, zoom + 8);
}

/**
 * Groups results to a single GeoJSON. Results closer than the pixelDistance
 * are collapsed to a single point (clustering). 
 */
export const toGeoJSON = (results, map, pixelDistance = 10) => {
  /*
  const grouped = {};

  // Collapse everything with pixelDistance meters. Approximate, so we're faster
  const zoom = map.getZoom();
  const latitude = map.getCenter().lat;

  const meters = metersPerPixel(latitude, zoom);
  const threshold = pixelDistance * meters;

  // Cf. https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
  const dimension = Math.round(Math.log10(threshold));
  const precision = Math.max(0, 5 - dimension);


  results.forEach(result => {
    const [lat, lon] = result.coords;
    const key = lon.toFixed(precision) + ',' + lat.toFixed(precision);

    const feature = grouped[key];
    
    if (feature) {
      feature.properties.results.push(result.id);
      feature.properties.count += 1;
    } else {
      grouped[key] = toFeature(result);
    }
  });

  return {
    type: 'FeatureCollection',
    features: Object.values(grouped)
  };
  */

  return {
    type: 'FeatureCollection',
    features: results.map(toFeature)
  }
}

export const getBounds = results => {
  if (!results || results.length === 0)
    return;
    
  let minLat = Infinity;
  let minLon = Infinity;
  let maxLat = - Infinity;
  let maxLon = - Infinity;

  results.forEach(({ coords }) => {
    const [lat, lon] = coords;

    if (lon < minLon)
      minLon = lon;

    if (lon > maxLon)
      maxLon = lon;

    if (lat < minLat)
      minLat = lat;

    if (lat > maxLat)
      maxLat = lat;
  });  

  return [
    [minLon, minLat],
    [maxLon, maxLat]
  ];
}
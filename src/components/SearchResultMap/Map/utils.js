const toFeature = result => ({
  type: 'Feature',
  properties: {
    ...result
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

export const toGeoJSON = (results, map, pixelDistance = 10) => ({
  type: 'FeatureCollection',
  features: results.map(toFeature)
})

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
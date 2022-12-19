const toFeature = result => ({
  type: 'Feature',
  properties: {
    count: 1,
    results: [ result ]
  },
  geometry: {
    type: 'Point',
    coordinates: result.lonlat
  }
})

export const toGeoJSON = (results, precision = 5) => {
  const grouped = {};

  results.forEach(result => {
    const [lon, lat] = result.lonlat;
    const key = lon.toFixed(precision) + ',' + lat.toFixed(precision);

    const feature = grouped[key];
    
    if (feature) {
      feature.properties.results.push(result);
      feature.properties.count += 1;
    } else {
      grouped[key] = toFeature(result);
    }
  });

  return Object.values(grouped);
}
export const pointStyle = {
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','point_count'], 1 ],
      0, 4, 
      10, 18
    ],
    'circle-color': '#eb585b',
    'circle-stroke-color': '#472a2d' ,
    'circle-stroke-width': 1
  }
} 

export const selectionStyle = {
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','point_count'], 1 ],
      0, 20, 
      10, 38
    ],
    'circle-color': '#eb585b',
    'circle-opacity': 0.35,
    'circle-stroke-color': '#eb585b',
    'circle-stroke-width': 1,
    'circle-stroke-opacity': 0.6
  }
}
export const pointStyle = {
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','count'], 1 ],
      0, 4, 
      10, 18
    ],
    'circle-color': '#ff0000',
    'circle-stroke-color': '#000' ,
    'circle-stroke-width': 1
  }
} 

export const selectionStyle = {
  'type': 'circle',
  'paint': {
    'circle-radius': 20,
    'circle-color': 'transparent',
    'circle-stroke-color': '#00ff00',
    'circle-stroke-width': 3
  }
}
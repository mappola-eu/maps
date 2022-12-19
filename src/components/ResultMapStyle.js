export const pointStyle = ({ fill = '#fff', stroke = '#000', strokeWidth = 1, ramp = [0, 4, 18, 18] }) => ({
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','count'], 0 ],
      ...ramp
    ],
    'circle-color': fill,
    'circle-stroke-color': stroke ,
    'circle-stroke-width': strokeWidth
  }
}); 
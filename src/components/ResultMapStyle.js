export const pointStyle = ({ fill = '#ff0000', stroke = '#000', strokeWidth = 1, ramp = [0, 4, 10, 18] }) => ({
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','count'], 1 ],
      ...ramp
    ],
    'circle-color': fill,
    'circle-stroke-color': stroke ,
    'circle-stroke-width': strokeWidth
  }
}); 
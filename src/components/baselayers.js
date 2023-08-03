import { MAP_STYLE } from '../config';

const STYLES = {
  'maptiler': MAP_STYLE,
  'dare': {
    'version': 8,
    'sources': {
      'dare': {
        'type': 'raster',
        'tiles': [
          'https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png'
        ],
        'tileSize': 256,
        'attribution': 'Digital Atlas of the Roman Empire © 2020 Johan Åhlfeldt, Centre for Digital Humanities, University of Gothenburg, Sweden'
      }
    },
    'layers': [{
      'id': 'dare-tiles',
      'type': 'raster',
      'source': 'dare'
    }]
  }
};

export const getStyle = id => STYLES[id];

import { 
  API_KEY, 
  STYLE
} from '../../../config';

const STYLES = {
  'maptiler': `https://api.maptiler.com/maps/${STYLE}/style.json?key=${API_KEY}`,
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

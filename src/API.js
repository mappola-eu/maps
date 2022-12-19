import ResultMap from './components/ResultMap.svelte';
import { results } from './store/results';
import { API_KEY } from './config';

export class API {

  constructor(container) {
    this.map = new ResultMap({
      target: container,
      props: {
        apiKey: API_KEY,
        style: 'streets',
        initialState: { 
          center: [17.0, 41.5], // lon/lat
          zoom: 6 
        }
      }
    });
  }

  setResults = r => results.set(r);

}
import ResultMap from './components/ResultMap.svelte';
import { results } from './store/results';
import { API_KEY } from './config';

export class API {

  constructor(container) {
    this.map = new ResultMap({
      target: container,
      props: {
        apiKey: API_KEY
      }
    });
  }

  setResults = r => results.set(r);

}
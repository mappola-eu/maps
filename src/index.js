import App from './App.svelte';
import { results } from './store/results';

import './index.css';

class API {

  constructor(container) {
    this.map = new App({
      target: container
    });
  }

  setResults = r => results.set(r);

}

export default API;
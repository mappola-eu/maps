import App from './App.svelte';
import { results } from './store';

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
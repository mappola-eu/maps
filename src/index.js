import SvelteSearchResultMap from './components/SearchResultMap';
import SvelteProfileMap from './components/ProfileMap';

export class SearchResultMap {

  constructor(container, results = []) {
    this.map = new SvelteSearchResultMap({
      target: container,
      props: { results }
    });
  }

  setResults = results =>
    this.map.$set({ results });

}

export class ProfileMap {

  constructor(container, data) {
    this.map = new SvelteProfileMap({
      target: container,
      props: { data }
    });
  }

}


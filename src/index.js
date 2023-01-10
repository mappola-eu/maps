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

  constructor(config) {
    if (!config.parent)
      console.error('Missing property \'parent\' in ProfileMap config');

    if (!config.parent.nodeType)
      console.error('ProfileMap parent must be a DOM node');    

    const { parent, ...rest } = config;

    this.map = new SvelteProfileMap({
      target: config.parent,
      props: { ...rest }
    });
  }

}


import SvelteSearchResultMap from './components/SearchResultMap';
import SvelteProfileMap from './components/ProfileMap';

const isValidConfig = config => {
  if (!config.parent)
    console.error('Missing property \'parent\' in ProfileMap config');

  if (!config.parent.nodeType)
    console.error('ProfileMap parent must be a DOM node');

  return Boolean(config?.parent?.nodeType);
}

export class SearchResultMap {

  constructor(config) {
    if (isValidConfig(config)) {
      const { parent, ...rest } = config;

      this.map = new SvelteSearchResultMap({
        target: config.parent,
        props: { ...rest }
      });
    }
  }

  setResults = results =>
    this.map.$set({ results });

}

export class ProfileMap {

  constructor(config) {
    if (isValidConfig(config)) {
      const { parent, ...rest } = config;

      this.map = new SvelteProfileMap({
        target: config.parent,
        props: { ...rest }
      });
    }
  }

}


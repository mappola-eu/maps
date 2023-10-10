import SvelteSearchResultMap from './components/SearchResultMap';
import SvelteProfileMap from './components/ProfileMap';

const isValidConfig = config => {
  if (!config.parent)
    console.error('Missing property \'parent\' in ProfileMap config');

  if (!config.parent.nodeType)
    console.error('ProfileMap parent must be a DOM node');

  return Boolean(config?.parent?.nodeType);
}

const filterResults = results => 
  results.filter(record => 
    record.coords?.length === 2 && (record.coords[0] && record.coords[1]));

export class SearchResultMap {

  constructor(config) {
    if (isValidConfig(config)) {
      const { parent, results, ...rest } = config;
      
      const filteredResults = results ? filterResults(results) : null;

      this.map = new SvelteSearchResultMap({
        target: config.parent,
        props: { results: filteredResults, ...rest }
      });
    }
  }

  setResults = results =>
    this.map.$set({ results: filterResults(results) });

  setSelected = id => 
    this.map.$set({ selected: id });

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


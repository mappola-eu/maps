import LayerSwitcher from './LayerSwitcher.svelte';

export default class LayerSwitcherControl {

  constructor(callbacks) {
    this.callbacks = callbacks || {};
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'maplibregl-ctrl';

    this.control = new LayerSwitcher({
      target: this._container,
      props: { map }
    });

    this.control.$on('change', () => 
      this.callbacks.onChange && this.callbacks.onChange());
    
    return this._container;
  }
   
  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }

};
<script>
  import { onMount, onDestroy } from 'svelte';
  import { Map, NavigationControl } from 'maplibre-gl';
  import { results } from '../store/results';
  import { toGeoJSON } from './ResultMapUtils';
  import { pointStyle, selectionStyle } from './ResultMapStyle';
  import { CLICK_THRESHOLD } from '../config';

  import 'maplibre-gl/dist/maplibre-gl.css';

  export let apiKey;

  export let style;

  export let initialState;

  // The map container DIV
  let container;

  // MapLibre map instance
  let map;

  const onClick = evt => {
    const bbox = [
      [evt.point.x - CLICK_THRESHOLD, evt.point.y - CLICK_THRESHOLD],
      [evt.point.x + CLICK_THRESHOLD, evt.point.y + CLICK_THRESHOLD]
    ];

    const selectedFeatures = map.queryRenderedFeatures(bbox, {
      layers: ['results']
    });

    map.getSource('selection-source').setData({
      type: 'FeatureCollection',
      features: selectedFeatures
    });
  }

  $: {
    if (map)
      map.getSource('results-source')?.setData($results);
  }

  onMount(() => {
    map = new Map({
      container,
      style: `https://api.maptiler.com/maps/${style}/style.json?key=${apiKey}`,
      ...initialState
    });

    map.addControl(new NavigationControl(), 'top-right');

    map.on('click', onClick);

    map.on('load', () => {
      map.addSource('results-source', { 
        type: 'geojson',
        data: toGeoJSON($results)
      });

      map.addSource('selection-source', {
        type: 'geojson',
        data: toGeoJSON([])
      });

      map.addLayer({
        ...pointStyle,
        id: 'results',
        source: 'results-source'
      });

      map.addLayer({
        ...selectionStyle,
        id: 'selection',
        source: 'selection-source'
      });
    });
  });

  onDestroy(() => map.remove());
</script>

<div class="map" id="map" bind:this={container}></div>

<style>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
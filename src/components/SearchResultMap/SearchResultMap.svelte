<script>
  import { onMount, onDestroy } from 'svelte';
  import { Map, NavigationControl } from 'maplibre-gl';
  import MapPopup from './MapPopup/MapPopup.svelte';
  import { getBounds, toGeoJSON } from './searchResultMapUtils';
  import { pointStyle, selectionStyle } from './searchResultMapStyles';
  import { 
    API_KEY, 
    CLICK_THRESHOLD,
    DEFAULT_LAT,
    DEFAULT_LON,
    DEFAULT_ZOOM, 
    STYLE
  } from '../../config';

  import 'maplibre-gl/dist/maplibre-gl.css';

  export let results;

  // The map container DIV
  let container;

  // MapLibre map instance
  let map;

  let selectedFeature = null;

  const initialState={
    center: [ DEFAULT_LON, DEFAULT_LAT ],
    zoom: DEFAULT_ZOOM
  }

  const onClick = evt => {
    const bbox = [
      [evt.point.x - CLICK_THRESHOLD, evt.point.y - CLICK_THRESHOLD],
      [evt.point.x + CLICK_THRESHOLD, evt.point.y + CLICK_THRESHOLD]
    ];

    const selectedFeatures = map.queryRenderedFeatures(bbox, {
      layers: ['results']
    });

    if (selectedFeatures.length === 0)
      selectedFeature = null;
    else 
      selectedFeature = selectedFeatures[0];

    map.getSource('selection-source').setData({
      type: 'FeatureCollection',
      features: selectedFeatures
    });
  }

  $: {
    if (map)
      map.getSource('results-source')?.setData(results);
  }

  onMount(() => {
    map = new Map({
      container,
      style: `https://api.maptiler.com/maps/${STYLE}/style.json?key=${API_KEY}`,
      ...initialState
    });

    map.addControl(new NavigationControl(), 'top-right');

    map.on('click', onClick);

    map.on('load', () => {
      map.addSource('selection-source', {
        type: 'geojson',
        data: toGeoJSON([])
      });

      map.addSource('results-source', { 
        type: 'geojson',
        data: toGeoJSON(results)
      });

      map.addLayer({
        ...selectionStyle,
        id: 'selection',
        source: 'selection-source'
      });

      map.addLayer({
        ...pointStyle,
        id: 'results',
        source: 'results-source'
      });

      map.fitBounds(getBounds(results), {
        padding: 50, 
        duration: 0
      });
    });
  });

  onDestroy(() => map.remove());
</script>

<div class="map" id="map" bind:this={container}>
  {#if (Boolean(selectedFeature))}
    <MapPopup selected={selectedFeature} map={map}/>
  {/if}
</div>

<style>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
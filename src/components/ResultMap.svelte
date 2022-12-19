<script>
  import { onMount, onDestroy } from 'svelte';
  import { Map, NavigationControl } from 'maplibre-gl';
  import { results } from '../store/results';
  import { toGeoJSON } from './ResultMapUtils';
  import { pointStyle } from './ResultMapStyle';

  import 'maplibre-gl/dist/maplibre-gl.css';

  export let apiKey;

  // The map container DIV
  let container;

  // MapLibre map instance
  let map;

  onMount(() => {
    if (!apiKey)
      throw new Error("You need to configure env API_KEY first, see README");

    const initialState = { 
      center: [17.0, 41.5], // lon/lat
      zoom: 6 
    };
  
    map = new Map({
      container,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      ...initialState
    });

    map.addControl(new NavigationControl(), 'top-right');

    map.on('load', () => {

      map.addSource('search', { 
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: toGeoJSON($results)
        }
      });

      console.log(pointStyle({}));

      map.addLayer({
        ...pointStyle({}),
        id: 'foobar',
        source: 'search'
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
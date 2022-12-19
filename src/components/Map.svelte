<script>
  import { onMount, onDestroy } from 'svelte';
  import { Map } from 'maplibre-gl';
  import { results } from '../store/results';

  import 'maplibre-gl/dist/maplibre-gl.css';

  export let apiKey;

  // The map container DIV
  let container;

  // MapLibre map instance
  let map;

  $: {
    console.log('results', $results);
  }

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
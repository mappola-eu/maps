<script>
  import { onMount, onDestroy } from 'svelte';
  import { Map } from 'maplibre-gl';

  import 'maplibre-gl/dist/maplibre-gl.css';

  export let apiKey;

  // The map container DIV
  let container;

  // MapLibre map instance
  let map;

  onMount(() => {
    if (!apiKey)
      throw new Error("You need to configure env API_KEY first, see README");

    const initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };
  
    map = new Map({
      container,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
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
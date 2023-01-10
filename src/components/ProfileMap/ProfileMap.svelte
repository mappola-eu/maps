<script>
  import { onMount, onDestroy } from 'svelte';
  import { Map, NavigationControl } from 'maplibre-gl';
  import { getStyle } from '../baselayers';
  import { pointStyle, selectionStyle } from '../styles';
  import { DEFAULT_ZOOM } from '../../config';

  import 'maplibre-gl/dist/maplibre-gl.css';
  
  export let lonlat = [0, 0];

  export let zoom = DEFAULT_ZOOM;

  let container; // Map container DIV

  let map; // MapLibre map instance

  $: geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [...lonlat]
    }
  }

  onMount(() => {
    map = new Map({
      container,
      style: getStyle('dare'),
      center: lonlat,
      attributionControl: false,
      zoom
    });

    map.addControl(new NavigationControl(), 'top-right');

    map.on('load', () => {
      map.addSource('halo-source', {
        type: 'geojson',
        data: geojson
      });

      map.addLayer({
        ...selectionStyle,
        id: 'halo',
        source: 'halo-source'
      });

      map.addSource('marker-source', { 
        type: 'geojson',
        data: geojson
      });

      map.addLayer({
        ...pointStyle,
        id: 'marker',
        source: 'marker-source'
      });
    });
  });

  onDestroy(() => map.remove());
</script>

<div class="map" bind:this={container}></div>

<style>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
<script>
  import { onMount, onDestroy } from 'svelte';
  import { Map, NavigationControl } from 'maplibre-gl';
  import Popup from '../Popup/Popup.svelte';
  import { getBounds, toGeoJSON, EMPTY_GEOJSON } from './utils';
  import { pointStyle, selectionStyle } from '../../styles';
  import { getStyle } from '../../baselayers';
  import LayerSwitcherControl from '../../LayerSwitcherControl';
  
  import { 
    CLICK_THRESHOLD,
    DEFAULT_LAT,
    DEFAULT_LON,
    DEFAULT_ZOOM, 
  } from '../../../config';

  import 'maplibre-gl/dist/maplibre-gl.css';

  export let results;

  let container; // Map container DIV

  let map; // MapLibre map instance

  let selectedFeature = null;

  const getResultsAt = selectedFeature => {
    const ids = new Set(JSON.parse(selectedFeature.properties.results));
    return results.filter(result => ids.has(result.id));
  }

  const onMapClicked = evt => {
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
      features: selectedFeature ? [ selectedFeature ] : []
    });
  }

  const onZoomEnd = evt => {
    map?.getSource('results-source')?.setData(toGeoJSON(results, map));
  }

  const onClosePopup = () => {
    selectedFeature = null;
    map.getSource('selection-source').setData(EMPTY_GEOJSON);
  }

  $: map?.getSource('results-source')?.setData(toGeoJSON(results, map));

  onMount(() => {
    map = new Map({
      container,
      style: getStyle('maptiler'),
      center: [ DEFAULT_LON, DEFAULT_LAT ],
      zoom: DEFAULT_ZOOM,
      bounds: getBounds(results), // Bounds override center and zoom if defined
      fitBoundsOptions: { padding: 50 }
    });

    map.addControl(new NavigationControl(), 'top-right');
    map.addControl(new LayerSwitcherControl(), 'top-right');

    map.on('click', onMapClicked);
    
    map.on('zoomend', onZoomEnd);

    map.on('load', () => {
      map.addSource('selection-source', {
        type: 'geojson',
        data: toGeoJSON([], map)
      });

      map.addLayer({
        ...selectionStyle,
        id: 'selection',
        source: 'selection-source'
      });

      map.addSource('results-source', { 
        type: 'geojson',
        data: toGeoJSON(results, map)
      });

      map.addLayer({
        ...pointStyle,
        id: 'results',
        source: 'results-source'
      });
    });
  });

  onDestroy(() => map.remove());
</script>

<div class="map" bind:this={container}>
  {#if selectedFeature}
    <Popup 
      selected={selectedFeature} 
      results={getResultsAt(selectedFeature)}
      map={map}
      on:close={onClosePopup} />
  {/if}
</div>

<style>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
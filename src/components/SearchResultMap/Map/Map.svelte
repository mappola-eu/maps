<script>
  import { onMount, onDestroy } from 'svelte';
  import { Map, NavigationControl } from 'maplibre-gl';
  import Popup from '../Popup/Popup.svelte';
  import { getBounds, toGeoJSON, EMPTY_GEOJSON } from './utils';
  import { pointStyle, selectionStyle } from '../../styles';
  import { getStyle } from '../../baselayers';
  import LayerSwitcherControl from '../../LayerSwitcherControl';
  import HoverTooltip from '../HoverTooltip/HoverTooltip.svelte';
  
  import { 
    CLICK_THRESHOLD,
    DEFAULT_LAT,
    DEFAULT_LON,
    DEFAULT_ZOOM, 
    MAX_ZOOM
  } from '../../../config';

  import 'maplibre-gl/dist/maplibre-gl.css';

  export let results;

  let container; // Map container DIV

  let map; // MapLibre map instance

  let selection = null;

  let hovered = null;

  const getResultsAt = f => new Promise(resolve => {
    const clusterId = f.properties.cluster_id;

    if (clusterId) {
      // This feature is a cluster
      const clusterSource = map.getSource('results-source');

      clusterSource.getClusterLeaves(clusterId, Infinity, 0, (error, features) => {
        resolve(features.map(f => f.properties));
      });
    } else {
      // This features is a single result
      resolve([ f.properties ]);
    }
  });

  const selectResultsAt = f => {
    const setHalo = f => map.getSource('selection-source').setData({
      type: 'FeatureCollection',
      features: [ f ]
    });

    getResultsAt(f).then(results => {
      setHalo(f);
      selection = { feature: f, results };
    });
  }

  const onMouseMove = evt => {
    const { offsetX, offsetY } = evt.originalEvent;

    const features = map.queryRenderedFeatures(evt.point, {
      layers: [ 'results' ]
    });

    if (features.length > 0) {
      getResultsAt(features[0]).then(results => hovered = {
        offsetX, offsetY, results
      });      
    } else {
      hovered = null;
    }
  }

  const onMapClicked = evt => {
    const bbox = [
      [evt.point.x - CLICK_THRESHOLD, evt.point.y - CLICK_THRESHOLD],
      [evt.point.x + CLICK_THRESHOLD, evt.point.y + CLICK_THRESHOLD]
    ];

    const selectedFeatures = map.queryRenderedFeatures(bbox, {
      layers: ['results']
    });

    if (selectedFeatures.length === 0) {
      selection = null;

      map.getSource('selection-source').setData({
        type: 'FeatureCollection',
        features: []
      });
    } else { 
      hovered = null;

      selectResultsAt(selectedFeatures[0]);
    }
  }

  const onClosePopup = () => {
    selection = null;
    map.getSource('selection-source').setData(EMPTY_GEOJSON);
  }

  $: map?.getSource('results-source')?.setData(toGeoJSON(results, map));

  // Adds result and selection data to map
  const addData = () => {
    map.addSource('selection-source', {
      type: 'geojson',
      data: selection?.feature || EMPTY_GEOJSON
    });

    map.addLayer({
      ...selectionStyle,
      id: 'selection',
      source: 'selection-source'
    });

    map.addSource('results-source', { 
      type: 'geojson',
      data: toGeoJSON(results, map),
      cluster: true,
      clusterRadius: 10
    });

    map.addLayer({
      ...pointStyle,
      id: 'results',
      source: 'results-source'
    });    
  }

  onMount(() => {
    map = new Map({
      container,
      style: getStyle('maptiler'),
      center: [ DEFAULT_LON, DEFAULT_LAT ],
      zoom: DEFAULT_ZOOM,
      bounds: getBounds(results), // Bounds override center and zoom if defined
      fitBoundsOptions: { 
        maxZoom: MAX_ZOOM,
        padding: 50 
      }
    });

    map.addControl(new NavigationControl(), 'top-right');

    // Note that MapLibre destroys custom layers when switching style!
    map.addControl(new LayerSwitcherControl({ onChange: addData }), 'top-right');
    
    map.on('mousemove', onMouseMove);

    map.on('click', onMapClicked);
    
    map.on('load', addData);
  });

  onDestroy(() => map.remove());
</script>

<div class="map" bind:this={container}>
  {#if selection}
    {#key JSON.stringify(selection)}
    <Popup 
      selected={selection.feature} 
      results={selection.results}
      map={map}
      on:close={onClosePopup} />
    {/key}
  {/if}

  {#if hovered}
    <HoverTooltip {...hovered} />
  {/if}
</div>


<style>
  .map {
    width: 100%;
    height: 100%;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif;
  }
</style>
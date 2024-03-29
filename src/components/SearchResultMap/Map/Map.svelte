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

  export let selected = undefined;

  let container; // Map container DIV

  let map; // MapLibre map instance

  let selection = null;

  let hovered = null;

  $: if (selected) {
    const isReady = map.getSource('results-source') && map.isSourceLoaded('results-source');

    if (isReady)
      showSelection();
    else
      map.once('idle', showSelection);
  }

  const showSelection = () => {
    // All features currently on the map
    const clusters = map.queryRenderedFeatures(undefined, {
      layers: [ 'results' ]
    });

    let selectedCluster; 

    clusters.reduce((promise, cluster) => {
      if (selectedCluster)
        return promise;
       
      return promise.then(() => getResultsAt(cluster).then(results => {
        const item = results.find(r => r.long_id === selected);
        if (item) 
          selectedCluster = cluster;
      }));
    }, Promise.resolve()).then(() => {
      if (selectedCluster)
        selectResultsAt(selectedCluster);
    });
  }

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

    const isReady = map.getSource('results-source')
    if (!isReady)
      return;

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

  const onMapZoomed = () => {
    if (selection) {
      const clusters = map.queryRenderedFeatures(undefined, {
        layers: [ 'results' ]
      });

      const selectedCluster = clusters.find(c => 
        c.properties.cluster_id 
          ? c.properties.cluster_id === selection.feature.properties.cluster_id
          : c.properties.long_id === selection.feature.properties.long_id);
      
      if (!selectedCluster) {
        // Need to re-assign
        const stickyFeatureId = 
          selected // there is a programmatic selection
            ? selection.results.find(i => i.long_id === selected) 
              ? selected // the current popup includes the programmatic selection!
              : selection.results[0].long_id 
            : selection.results[0].long_id ;
        
        let nextCluster;

        clusters.reduce((promise, cluster) => {       
          return promise.then(() => getResultsAt(cluster).then(results => {
            const item = results.find(r => r.long_id === stickyFeatureId);
            if (item) 
              nextCluster = cluster;
            }));
          }, Promise.resolve()).then(() => {
            if (nextCluster)
              selectResultsAt(nextCluster);
          });
      }
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

    map.on('zoomend', onMapZoomed);

    map.on('click', onMapClicked);
    
    map.on('load', addData);
  });

  onDestroy(() => map.remove());
</script>

<div class="map" bind:this={container}>
  {#if selection}
    {#key selection}
      <Popup 
        map={map}
        feature={selection.feature} 
        items={selection.results}
        selected={selected}
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
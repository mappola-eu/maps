<script>
  import { onMount } from 'svelte';
  import MapPopupCard from './MapPopupCard.svelte';
  import { EndlessList } from '../EndlessList';

  export let map;

  export let selected;

  let left;

  let bottom;

  const updatePosition = selected => {
    // Selected marker lon/lat
    const { coordinates } = selected.geometry;

    // Marker X/Y screen position
    const xy = map.project(coordinates);

    // Map container element height
    const { height } = map._container.getBoundingClientRect();

    left = xy.x;

    bottom = height - xy.y;
  }

  $: updatePosition(selected);

  onMount(() => {
    const onMove = () =>  updatePosition(selected);

    map.on('move', onMove);

    return () => map.off('move', onMove);
  });
</script>

<div 
  class="mappola-popup-container"
  style={`bottom: ${bottom + 20}px; left: ${left - 160}px;`}>

  {#if (selected.properties.count === 1)}
    <MapPopupCard />
  {:else}
    <EndlessList data={[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]} let:idx={idx}>
      <MapPopupCard delay={50 * idx} />
    </EndlessList>
  {/if}

</div>

<style>
  .mappola-popup-container {
    position: absolute;
  }
</style>
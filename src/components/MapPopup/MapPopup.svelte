<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
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
  style={`bottom: ${bottom + 20}px; left: ${left - 140}px;`}>

  {#if (selected.properties.count === 1)}
    <MapPopupCard />
  {:else}
    <div>
      <EndlessList data={[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]} let:delay={delay}>
        <MapPopupCard delay={delay} />
      </EndlessList>

      <div transition:fade={{ duration: 120 }} class="mappola-popup-controls right">
        <button>X</button>
        <button>U</button>
        <button>D</button>
      </div>
    </div>
  {/if}

</div>

<style>
  .mappola-popup-container {
    position: absolute;
    pointer-events: none;
  }

  .mappola-popup-controls.right {
    position: absolute;
    top: 60px;
    right: -22px;
    display: flex;
    flex-direction: column;
  }
</style>
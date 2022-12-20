<script>
  import { onMount } from 'svelte';
  import MapPopupCard from './Card.svelte';

  export let map;

  export let selected;

  let x;

  let y;

  const updatePosition = selected => {
    const { coordinates } = selected.geometry;
    const xy = map.project(coordinates);

    x = xy.x;
    y = xy.y;
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
  style={`top: ${y - 110}px; left: ${x - 160}px;`}>

  <MapPopupCard />

</div>

<style>
  .mappola-popup-container {
    position: absolute;
  }
</style>
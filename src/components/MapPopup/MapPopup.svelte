<script>
  import { onMount } from 'svelte';

  export let map;

  export let selected;

  let top;

  let left;

  const updatePosition = selected => {
    const { coordinates } = selected.geometry;
    const xy = map.project(coordinates);

    top = xy.y;
    left = xy.x;
  }

  $: updatePosition(selected);

  onMount(() => {
    const onMove = () =>  updatePosition(selected);

    map.on('move', onMove);

    return () => map.off('move', onMove);
  });
</script>

<div 
  class="mappola-popup"
  style={`top: ${top}px; left: ${left}px;`}>
  Hello World
</div>

<style>
  .mappola-popup {
    background-color: #fff;
    padding: 10px;
    position: absolute;
  }
</style>
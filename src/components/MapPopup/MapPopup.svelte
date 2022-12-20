<script>
  import { onMount } from 'svelte';

  export let map;

  export let selected;

  onMount(() => {
    const onMove = evt => {
      console.log(evt);
    }

    map.on('move', onMove);

    return () => map.off('move', onMove);
  });
</script>

<div class="mappola-popup">
  Hello World
</div>

<style>
  .mappola-popup {
    background-color: #fff;
    padding: 10px;
  }
</style>
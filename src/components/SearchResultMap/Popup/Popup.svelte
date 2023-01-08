<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import PopupCard from './PopupCard.svelte';
  import PopupList from './PopupList.svelte';
  import { moveIntoView } from './moveIntoView';

  export let map;

  export let selected;

  let el;

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

    moveIntoView(map, el.getBoundingClientRect());

    return () => map.off('move', onMove);
  });
</script>

{#key selected.properties.results}
  <div 
    bind:this={el}
    class="mappola-popup-container"
    style={`bottom: ${bottom + 20}px; left: ${left - 120}px;`}>

    {#if (selected.properties.count === 1)}
      <PopupCard />
    {:else}
      <div>
        <PopupList data={[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]} let:delay={delay}>
          <PopupCard delay={delay} />
        </PopupList>

        <div 
          class="mappola-popup-controls right"
          in:fade={{ duration: 200, delay: 170 }}
          out:fade={{ duration: 120 }}>

          <button>X</button>
          <button>U</button>
          <button>D</button>
        </div>
      </div>
    {/if}
  </div>
{/key}

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
    pointer-events: all;
  }
</style>
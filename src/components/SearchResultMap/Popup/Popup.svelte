<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import CgClose from 'svelte-icons-pack/cg/CgClose';
  import CgChevronDown from 'svelte-icons-pack/cg/CgChevronDown';
  import CgChevronUp from 'svelte-icons-pack/cg/CgChevronUp';
  import PopupCard from './PopupCard.svelte';
  import PopupList from './PopupList.svelte';
  import { moveIntoView } from './moveIntoView';

  export let map;

  export let selected;

  let el;

  let left;

  let bottom;

  let scrollBy; // Bound from PopupList

  // Scroll button states
  let isUpDisabled = true;

  let isDownDisabled = false;

  const dispatch = createEventDispatcher();

  $: updatePosition(selected);

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

  const onListScrolled = evt => {
    const { from, to } = evt.detail;
    
    isUpDisabled = from === 0;
    isDownDisabled = to === 100;
  }

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
      <div class="wrapper">
        <PopupCard />

        <div 
          class="mappola-popup-controls single"
          transition:fly={{ y: 50, duration: 120, easing: cubicOut }}>

          <button on:click={() => dispatch('close')}>
            <Icon src={CgClose} />
          </button>
        </div>
      </div>
    {:else}
      <div class="wrapper">
        <PopupList 
          data={[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]} 
          bind:scrollBy={scrollBy}
          on:scroll={onListScrolled}>
        </PopupList>

        <div 
          class="mappola-popup-controls right"
          in:fade={{ duration: 200, delay: 170 }}
          out:fade={{ duration: 120 }}>

          <button on:click={() => dispatch('close')}>
            <Icon src={CgClose} />
          </button>

          <button 
            disabled={isUpDisabled}
            on:click={() => scrollBy(-2)}>
            <Icon src={CgChevronUp} />
          </button>

          <button
            disabled={isDownDisabled}
            on:click={() => scrollBy(2)}>
            <Icon src={CgChevronDown} />
          </button>
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

  .mappola-popup-controls.single {
    position: absolute;
    top: 9px;
    right: -45px;
    pointer-events: auto;
  }

  .mappola-popup-controls.right {
    padding: 3px 0;
    position: absolute;
    top: 60px;
    right: -36px;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
  }

  .mappola-popup-controls button {
    align-items: center;
    background-color: #7c7c7c;
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15), 0 12px 12px -8px rgba(0, 0, 0, 0.2);
    color: #fff;
    cursor: pointer;
    display: flex;
    font-size: 21px;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin: 3px 0;
    outline: none;
    transition: background-color 0.2s;
  }

  .mappola-popup-controls button:not(:disabled):hover {
    background-color: #979797;
  } 

  .mappola-popup-controls button:disabled {
    background-color: #c8c8c8;
    color: #e2e2e2;
  }
</style>
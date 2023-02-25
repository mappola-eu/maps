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

  export let results;

  let el;

  let left;

  let bottom;

  // Bound from PopupList
  let scrollBy; 

  let scrollItem = 3;

  // Scroll button states
  let isUpDisabled = true;  
  
  let isDownDisabled = false;

  const dispatch = createEventDispatcher();

  $: {
    updatePosition(selected);
  
    if (el)
      moveIntoView(map, el.getBoundingClientRect());
  }

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
    
    scrollItem = to;

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
    style={`bottom: ${bottom + 20}px; left: ${left - 160}px;`}>

    {#if (results.length < 4)}
      <div class="wrapper">
        {#each results as result, idx}
          <div class="no-scroll">
            <PopupCard 
              item={result}
              delay={results.length === 1 ? 0 : 150 - 50 * idx} />
          </div>
        {/each}

        <div 
          class="mappola-popup-controls single"
          transition:fly={{ y: 50, duration: 120, delay: (results.length - 1) * 50, easing: cubicOut }}>

          <button on:click={() => dispatch('close')}>
            <Icon src={CgClose} />
          </button>
        </div>
      </div>
    {:else}
      <div class="wrapper">
        <PopupList 
          items={results} 
          bind:scrollBy={scrollBy}
          on:close
          on:scroll={onListScrolled}>
        </PopupList>

        <div 
          class="mappola-popup-controls right"
          in:fade={{ duration: 200, delay: 170 }}
          out:fade={{ duration: 120 }}>

          <button on:click={() => dispatch('close')}>
            <Icon src={CgClose} />
          </button>

          <span class="scroll-position">
            {Math.round(results.length * (scrollItem - 1) / 100) }/{results.length}
          </span>

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
  :root {
    --dark-brown: #472a2d;
  }

  .mappola-popup-container {
    position: absolute;
    pointer-events: none;
    z-index: 2;
  }

  .wrapper {
    padding-right: 45px;
  }

  .no-scroll {
    padding-bottom: 8px;
  }

  .mappola-popup-controls.single {
    position: absolute;
    top: 2px;
    right: 0;
    pointer-events: auto;
  }

  .mappola-popup-controls.single button {
    box-shadow: 0 0 8px rgb(0 0 0 / 15%), 0 12px 12px -8px rgb(0 0 0 / 20%);
  }

  .mappola-popup-controls.right {
    position: absolute;
    top: 110px;
    left: 340px;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: var(--dark-brown);
    box-shadow: 0 0 8px rgb(0 0 0 / 15%), 0 12px 12px -8px rgb(0 0 0 / 20%);
    border-radius: 23px;
    padding: 5px;
  }

  .mappola-popup-controls .scroll-position {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    padding: 4px 0;
  }

  .mappola-popup-controls button {
    align-items: center;
    background-color: #472a2d;
    border: none;
    border-radius: 50%;
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
    background-color: #674d50;
  } 

  .mappola-popup-controls button:disabled {
    color: #ffffff4f;
  }

  .mappola-popup-controls button:first-child {
    margin-top: 0;
  }

  .mappola-popup-controls button:last-child {
    margin-bottom: 0;
  }
</style>
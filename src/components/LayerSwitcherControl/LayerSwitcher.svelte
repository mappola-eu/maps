<script>
  import { onMount } from 'svelte';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import IoLayers from 'svelte-icons-pack/io/IoLayers';
  import FiCheck from 'svelte-icons-pack/fi/FiCheck';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { getStyle } from '../baselayers';

  export let map;

  let isMenuOpen = false;

  let selected = 'dare'; 

  const onSelect = style => () => {
    selected = style;
    isMenuOpen = false;
    map.setStyle(getStyle(style));
  }

  onMount(() => {
    try {
      selected = map?.getStyle()?.sources.dare ? 'dare' : 'maptiler';
    } catch {
      // Workaround for mapLibre bug!
    }
  });
</script>

<div class="mappola-layer-switcher">
  <button on:click={() => isMenuOpen = !isMenuOpen}>
    <Icon src={IoLayers} />
  </button>
</div>

{#if isMenuOpen}
  <div
    class="mappola-layer-dropdown"
    transition:fly={{ x: 50, duration: 120, easing: cubicOut }}>
    <ul>
      <li class:selected={selected === 'maptiler'}>
        <button on:click={onSelect('maptiler')}>
          <Icon src={FiCheck} /> OpenStreetMap
        </button>
      </li>
      
      <li class:selected={selected === 'dare'}>
        <button on:click={onSelect('dare')}>
          <Icon src={FiCheck} /> Digital Atlas of the Roman Empire
        </button>
      </li>
    </ul>
  </div>
{/if}

<style> 
  .mappola-layer-switcher {
    background-color: #fff;
    border-radius: 4px;
  }

  .mappola-layer-switcher button {
    background: none;
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    width: 29px;
    height: 29px;
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgb(0, 0, 0, 0.1);
  }

  .mappola-layer-switcher:hover button {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .mappola-layer-dropdown {
    position: absolute;
    right: 39px;
    top: 0;
    background-color: #fff;
    white-space: nowrap;
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgb(0, 0, 0, 0.1);
  }

  .mappola-layer-dropdown button {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  }

  .mappola-layer-dropdown:hover button {
    background: none;
  }

  .mappola-layer-dropdown ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .mappola-layer-dropdown li {
    cursor: pointer;
  }

  .mappola-layer-dropdown li:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .mappola-layer-dropdown li:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  :global(.mappola-layer-dropdown li svg) {
    font-size: 20px;
    padding-right: 5px;
    color: transparent;
  }

  :global(.mappola-layer-dropdown li.selected svg) {
    color: #000;
  }
</style>
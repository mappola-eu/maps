<script>
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import IoLayers from 'svelte-icons-pack/io/IoLayers';

  export let map;

  let isMenuOpen = false;
</script>

<div class="mappola-layerswitcher">
  <button on:click={() => isMenuOpen = !isMenuOpen}>
    <Icon src={IoLayers} />
  </button>
</div>

{#if isMenuOpen}
  <div class="mappola-layer-dropdown">
    <ul>
      <li>OpenStreetMap</li>
      <li>Digital Atlas of the Roman Empire</li>
    </ul>
  </div>
{/if}

<style> 
  .mappola-layerswitcher {
    background-color: #fff;
    border-radius: 4px;
  }

  .mappola-layerswitcher button {
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

  .mappola-layerswitcher:hover button {
    background-color: rgba(0, 0, 0, 0.05);
  }
</style>
<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BsBodyText from 'svelte-icons-pack/bs/BsBodyText';

  let element;

  export let delay = 0;

  /**
   * Item is supposed to contain:
   * - Inscription title
   * - Thumbnail URL
   * - Text preview snippet
   * - Mappola ID (for the link to the DB)
   */
  export let item;

  export let isSelected;

  onMount(() => {
    if (isSelected) {
      element.scrollIntoView({ block: 'start' });
    }
  });
</script>

<div 
  bind:this={element}
  class="mappola-popup-card" 
  class:selected={isSelected}
  in:fly="{{ y: 50, duration: 120, easing: cubicOut, delay }}"
  out:fly|local="{{ y: 50, duration: 120, easing: cubicOut, delay: delay ? 120 - delay : 0 }}">

  <aside class="thumbnail">
    {#if item.thumbnail_url}
      <img src={item.thumbnail_url} alt={`${item.title} preview`} />
    {:else}
      <Icon src={BsBodyText} />
    {/if}
  </aside>

  <section>
    <h1>{item.title}</h1>
    <p class="text">{item.text}</p>
    <a href={item.item_url} target="_blank" rel="noreferrer">{item.long_id}</a>
  </section>
</div>


<style>
  .mappola-popup-card {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25), 0 12px 12px -8px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    height: 114px;
    padding: 8px 14px 8px 82px;
    width: 320px;
    position: relative;
    pointer-events: auto;
    font-size: 13px;
    color: #472a2d;
    transition: all 0.01s;
  }

  .mappola-popup-card.selected {
    outline: 4px solid #472a2d;
    outline-offset: 2px;
  }

  .mappola-popup-card aside {
    position: absolute;
    top: 0;
    left: 0;
    width: 70px;
    height: 100%;
    background-color: #472a2d;
    border-radius: 3px 0 0 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    color: #fff;
  }

  .mappola-popup-card aside img {
    border-radius: 3px 0 0 3px;
    height: 100%;
    object-fit: cover;
    width: 100%; 
  }

  .mappola-popup-card section {
    overflow: hidden;
  }

  .mappola-popup-card section h1 {
    display: -webkit-box;
    font-size: 15px;
    font-weight: 600;
    margin: 0;
    padding: 0;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }

  .mappola-popup-card section p.text {
    display: -webkit-box;
    font-size: 14px;
    font-style: italic;
    margin: 0;
    padding: 0;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }

  .mappola-popup-card section a {
    color: #eb585b;
  }
</style>
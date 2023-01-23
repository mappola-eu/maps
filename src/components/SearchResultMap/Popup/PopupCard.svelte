<script>
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BsBodyText from 'svelte-icons-pack/bs/BsBodyText';

  export let delay = 0;

  /**
   * Item is supposed to contain:
   * - Inscription title
   * - Thumbnail URL
   * - Text preview snippet
   * - Mappola ID (for the link to the DB)
   */
  export let item;
</script>

<div 
  class="mappola-popup-card" 
  in:fly="{{ y: 50, duration: 120, easing: cubicOut, delay }}"
  out:fly="{{ y: 50, duration: 120, easing: cubicOut, delay: delay ? 120 - delay : 0 }}">

  <aside class="thumbnail">
    <Icon src={BsBodyText} />
  </aside>

  <main>
    <h3>{item.title}</h3>
    <p class="text">{item.text}</p>
    <a href="#dummy">{item.long_id}</a>
  </main>
</div>

<style>
  .mappola-popup-card {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25), 0 12px 12px -8px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    height: 96px;
    padding: 8px 14px 8px 82px;
    width: 320px;
    position: relative;
    pointer-events: auto;
    font-size: 13px;
    color: #472a2d;
    transition: all 0.01s;
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

  .mappola-popup-card main {
    overflow: hidden;
  }

  .mappola-popup-card main h3 {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    font-weight: 600;
  }

  .mappola-popup-card main p.text {
    margin: 0;
    padding: 0;
    font-style: italic;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }

  .mappola-popup-card main a {
    color: #eb585b;
  }
</style>
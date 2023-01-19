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
  <div class="thumbnail">
    <Icon src={BsBodyText} />
  </div>
  <p>{item.title}</p>
  <p>{item.text}</p>
  <p><a href="#dummy">Link</a></p>
</div>

<style>
  .mappola-popup-card {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15), 0 12px 12px -8px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    height: 90px;
    padding: 10px;
    width: 300px;
    pointer-events: auto;
  
    /** Temporary **/
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .mappola-popup-card p {
    margin: 0;
    padding: 0;
  }

  .mappola-popup-card a {
    color: #6565e5;
  }
</style>
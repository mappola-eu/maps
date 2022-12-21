<script>
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let delay;
</script>

<div 
  class="mappola-popup-card" 
  in:fly="{{ y: 50, duration: 120, easing: cubicOut, delay }}"
  out:fly="{{ y: 50, duration: 120, easing: cubicOut, delay: delay ? 120 - delay : 0 }}">
  <p>Search Result</p>
  <p><a href="#dummy">Link</a></p>
</div>

<style>
  .mappola-popup-card {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15), 0 12px 12px -8px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    height: 60px;
    margin-bottom: 5px;
    padding: 10px;
    width: 240px;
  
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
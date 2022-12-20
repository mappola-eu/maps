<script>
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let delay;
</script>

<div class="mappola-popup-card" transition:fly="{{ y: 50, duration: 160, easing: cubicOut, delay }}">
  <p>Search Result</p>
  <p><a href="#dummy">Link</a></p>
</div>

<style>
  .mappola-popup-card {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15), 0 12px 12px -8px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    height: 80px;
    margin-bottom: 6px;
    padding: 10px;
    width: 300px;
  
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
<script>
  import { fly } from 'svelte/transition';
  import { backInOut } from 'svelte/easing';
</script>

<div class="mappola-popup-card" transition:fly="{{ y: 50, duration: 250, easing: backInOut }}">
  ! Hello World !
</div>

<style>
  .mappola-popup-card {
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15), 0 12px 12px -8px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    height: 80px;
    padding: 10px;
    width: 300px;
  }
</style>
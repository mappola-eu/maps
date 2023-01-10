<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import PopupCard from './PopupCard.svelte';

  export let items;

  let container;

  // Size when entering/leaving
  const MIN_SCALE = 0.9;

  // Vertical offset when entering/leaving
  const MAX_DY = 18;

  // Pixel increment for one scroll step
  const SCROLL_STEP = 90;

  const dispatch = createEventDispatcher();

  // Index of the top-most visible element, so we can time the animation
  let topIdx = 0;

  export const scrollBy = step => {
    const container = document.querySelector('.endless-list-container');
    container.scrollTo({ top: container.scrollTop + SCROLL_STEP * step, behavior: 'smooth' });
  }

  // Intersection observer callback
  const callback = entries => {

    entries.forEach(entry => {
      const { style } = entry.target;
      const ratio = entry.intersectionRatio;

      if (entry.isIntersecting) {
        // Is this element exiting (top of container) or entering (bottom)
        const isExiting = entry.boundingClientRect.y < entry.rootBounds.y;

        if (isExiting && ratio < 0.9)
          topIdx = parseInt(entry.target.dataset.idx);

        style.opacity = Math.sqrt(ratio);

        // Scale factor as a function of intersection ratio
        const scale = ratio * (1 - MIN_SCALE) + MIN_SCALE;

        // Vertical offset
        const dy = MAX_DY - (ratio * MAX_DY);
        style.transform = `scale(${scale}) translateY(${isExiting ? dy : -dy}px)`;

        if (ratio > 0.9)
          style.zIndex = 1;
        else
          style.zIndex = 0;
      } else {
        style.opacity = 0;
      }
    });

    const from = Math.round(100 * container.scrollTop / container.scrollHeight);
    const to = Math.round(100 * (container.scrollTop + container.offsetHeight) / container.scrollHeight);

    dispatch('scroll', { from, to });
  }

  // Close the popup when clicking on transparent areas
  const onPointerDown = evt => {
    if (evt.target === container)
      dispatch('close');
  }

  onMount(() => {
    const options = {
      root: container,
      rootMargin: '0px',
      threshold: Array.from({ length: 51 }, (v, i) => i * 0.02)
    }

    const observer = new IntersectionObserver(callback, options);

    container.childNodes.forEach(el => observer.observe(el));

    return () =>
      observer.disconnect();
  });
</script>

<div 
  bind:this={container}
  on:pointerdown={onPointerDown}
  class="endless-list-container">
  
  {#each items as item, idx}
    <div 
      class="endless-list-item" 
      data-idx={idx}>

      <PopupCard
        item={item}
        delay={idx < topIdx ? 0 : 120 - 50 * (idx - topIdx)} />
    </div>
  {/each}

</div>

<style>
  .endless-list-container {
    overflow-y: scroll;
    position: relative;
    height: 320px;
    box-sizing: border-box;
    padding: 60px 10px;
    margin-bottom: -30px;
    pointer-events: auto;

    scrollbar-width: none;  /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
  }

  .endless-list-container::-webkit-scrollbar { 
    display: none; /* Safari and Chrome */
  }

  .endless-list-item {
    position: relative;
    transition: opacity 0.2s;
    pointer-events: auto;
    padding-bottom: 5px;
  }
</style>
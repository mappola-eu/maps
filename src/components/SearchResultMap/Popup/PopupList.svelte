<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import PopupCard from './PopupCard.svelte';

  export let items;

  export let selected;

  let container;

  // Size when entering/leaving
  const MIN_SCALE = 0.88;

  // Vertical offset when entering/leaving
  const MAX_DY = 50;

  // Pixel increment for one scroll step
  const SCROLL_STEP = 90;

  const dispatch = createEventDispatcher();

  // Index of the top-most visible element, so we can time the animation
  let topIdx = 0;

  const isFirefox = /firefox/i.test(navigator.userAgent);

  export const scrollBy = step => {
    const container = document.querySelector('.endless-list-container');
    container.scrollTo({ top: container.scrollTop + SCROLL_STEP * step, behavior: 'smooth' });
  }

  // Intersection observer callback
  const callback = entries => {
    entries.forEach(entry => {
      const { style } = entry.target;

      if (entry.isIntersecting) {
        // Is this element exiting (top of container) or entering (bottom)
        const isExiting = entry.boundingClientRect.top <= entry.rootBounds.top;
        const d =
          isExiting ? 
            entry.rootBounds.top - entry.boundingClientRect.top :
            entry.boundingClientRect.bottom - entry.rootBounds.bottom;

        const ratio = Math.min(1, 1 - (d / entry.boundingClientRect.height));

        if (isExiting && ratio < 0.9)
          topIdx = parseInt(entry.target.dataset.idx);

        style.opacity = ratio;

        // Scale factor as a function of intersection ratio
        const scale = ratio * (1 - MIN_SCALE) + MIN_SCALE;

        const rotate = isExiting ? 5 * (1- ratio) : - 5 * (1- ratio);

        // Vertical offset
        const dy = MAX_DY - Math.sqrt(ratio) * MAX_DY;
        style.transform = `scale(${scale}) perspective(500px) rotateX(${rotate}deg) translateY(${isExiting ? dy : -dy}px)`;
        
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

  const onClickCard = evt => {
    const item = evt.target.closest('.endless-list-item');
    const { opacity } = item.style;

    if (opacity < 0.99) {
      const bounds = item.getBoundingClientRect();
      
      const isEntering = item.offsetTop - item.parentElement.scrollTop > bounds.height;

      if (isEntering)
        scrollBy(2);
      else 
        scrollBy(-2);
    }
  }

  onMount(() => {
    const options = {
      root: container,
      rootMargin: isFirefox ? '-110px' : '0px',
      threshold: Array.from({ length: 51 }, (v, i) => i * 0.02)
    }

    const observer = new IntersectionObserver(callback, options);

    container.childNodes.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    }
  });
</script>

<div 
  bind:this={container}
  on:pointerdown={onPointerDown}
  class="endless-list-container">
  
  {#each items as item, idx}
    <div 
      class="endless-list-item" 
      data-idx={idx}
      on:pointerdown={onClickCard}>
      
      <PopupCard
        item={item}
        delay={idx < topIdx ? 0 : 120 - 50 * (idx - topIdx)}
        isSelected={item.long_id === selected} />
    </div>
  {/each}

</div>

<style>
  .endless-list-container {
    overflow-y: scroll;
    position: relative;
    height: 590px;
    box-sizing: border-box;
    padding: 110px 10px;
    margin-bottom: -30px;
    pointer-events: auto;
    scroll-padding: 180px 0 0 0;

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
    padding-bottom: 8px;
    opacity: 0;
  }
</style>
<script>
  import { onMount } from 'svelte';

  export let data;

  let container;

  let topIdx = 0;

  // Size when entering/leaving
  const MIN_SCALE = 0.9;

  // Vertical offset when entering/leaving
  const MAX_DY = 18;

  // Intersection observer callback
  const callback = entries => entries.forEach(entry => {
    const { style } = entry.target;
    const ratio = entry.intersectionRatio;

    if (entry.isIntersecting) {
      // Is this element exiting (top of container) or entering (bottom)
      const isExiting = entry.boundingClientRect.y < entry.rootBounds.y;

      if (isExiting && ratio < 1)
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

  onMount(() => {
    const options = {
      root: container,
      rootMargin: '0px',
      threshold: Array.from({ length: 51 }, (v, i) => i * 0.02)
    }

    var observer = new IntersectionObserver(callback, options);

    container.childNodes.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  });
</script>

<div 
  class={$$restProps.class ? `endless-list-container ${$$restProps.class}` : 'endless-list-container'}
  bind:this={container}>
  {#each data as item, idx}
    <div class="endless-list-item" data-idx={idx}>
      <slot item={item} delay={idx < topIdx ? 0 : 120 - 50 * (idx - topIdx)}/>
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
    pointer-events: all;

    scrollbar-width: none;  /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
  }

  .endless-list-container::-webkit-scrollbar { 
    display: none; /* Safari and Chrome */
  }

  .endless-list-item {
    position: relative;
    transition: opacity 0.2s;
  }
</style>
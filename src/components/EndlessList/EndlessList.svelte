<script>
  import { onMount } from 'svelte';

  export let data;
  export let padding;

  let container;

  // Size when entering/leaving
  const MIN_SCALE = 0.92;

  // Vertical offset when entering/leaving
  const MAX_DY = 14;

  // Intersection observer callback
  const callback = entries => entries.forEach(entry => {
    const { style } = entry.target;
    const ratio = entry.intersectionRatio;

    if (entry.isIntersecting) {
      style.opacity = Math.pow(ratio, 2);

      // Scale factor as a function of intersection ratio
      const scale = ratio * (1 - MIN_SCALE) + MIN_SCALE;

      // Vertical offset
      const isAbove = entry.boundingClientRect.y < entry.rootBounds.y;
      const dy = MAX_DY - (ratio * MAX_DY);

      style.transform = `scale(${scale}) translateY(${isAbove ? dy : -dy}px)`;
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
  style={`padding: ${padding ? padding.map(n => `${n}px`).join(' ') : '0'}`}
  bind:this={container}>
  {#each data as item, idx}
    <div class="endless-list-item">
      <slot item={item} idx={idx} />
    </div>
  {/each}
</div>

<style>
  .endless-list-container {
    overflow-y: scroll;
    position: relative;
    /* Firefox */
    scrollbar-width: none;  
    /* Internet Explorer 10+ */
    -ms-overflow-style: none;  
  } 

  .endless-list-container::-webkit-scrollbar { 
    /* Safari and Chrome */
    display: none; 
  }
</style>
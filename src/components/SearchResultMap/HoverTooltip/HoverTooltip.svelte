<script>
  export let offsetX;

  export let offsetY;

  export let results;

  const OFFSET_X = 14;

  const OFFSET_Y = 10;

  const getMostFrequentPlace = r => {
    const places = r.map(result => result.place);

    const frequency = places.reduce((stats, placename) => {
      stats[placename] = (stats[placename] || 0) + 1;
      return stats;
    }, {});

    return Object.keys(frequency).reduce((mostFrequent, placename) => {
      return frequency[placename] > frequency[mostFrequent] ? placename : mostFrequent;
    });
  }

  $: mostFrequentPlace = getMostFrequentPlace(results);
</script>

<div 
  class="mappola-hover-tooltip" 
  style={`top: ${offsetY + OFFSET_Y}px; left: ${offsetX + OFFSET_X}px;`}>
  <span class="placename">{mostFrequentPlace}</span>
  <span class="count">{results.length} Result{#if results.length > 1}s{/if}</span>
</div>

<style>
  .mappola-hover-tooltip {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25), 0 12px 12px -8px rgba(0, 0, 0, 0.2);
    font-size: 15px;
    left: 100px;
    pointer-events: none;
    position: absolute;
    top: 100px;
    white-space: nowrap;
    z-index: 1;
  }
 
  span {
    display: inline-block;
    padding: 6px 10px;
  }

  .placename {
    background-color: var(--dark-brown);
    border-radius: 3px 0 0 3px;
    color: #fff;
    font-weight: 600;
  }
</style>
<script>
  export let clientX;

  export let clientY;

  export let results;

  const OFFSET_X = 10;

  const OFFSET_Y = 10;

  const getMostFrequentPlace = results => {
    return 'Foo';
  }
</script>

<div 
  class="mappola-hover-tooltip" 
  style={`top: ${clientY + OFFSET_Y}px; left: ${clientX + OFFSET_X}px;`}>
  <span class="placename">{getMostFrequentPlace(results)}</span>
  <span class="count">{results.length} Result{#if results.length > 1}s{/if}</span>
</div>

<style>
  .mappola-hover-tooltip {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25), 0 12px 12px -8px rgba(0, 0, 0, 0.2);
    left: 100px;
    padding: 8px 12px;
    pointer-events: none;
    position: absolute;
    top: 100px;
  }

  .placename {

  }

  .count {

  }
</style>
const PADDING = 40;

export const moveIntoView = (map, popupBounds) => {    
  const mapBounds = map.getCanvasContainer().querySelector('canvas').getBoundingClientRect();

  let dx = 0;
  let dy = 0;

  if (popupBounds.left - PADDING < mapBounds.left) {
    dx = popupBounds.left - mapBounds.left - PADDING;
  } else if (popupBounds.right + PADDING > mapBounds.right) {
    dx = popupBounds.right - mapBounds.right + PADDING;
  }

  if (popupBounds.top - PADDING < mapBounds.top) {
    dy = popupBounds.top - mapBounds.top - PADDING;
  } else if (popupBounds.bottom + PADDING > mapBounds.bottom) {
    dy = popupBounds.bottom + PADDING - mapBounds.bottom;
  }

  if (dx !== 0 || dy !== 0)
    map.panBy([dx, dy]);
}
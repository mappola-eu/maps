import { writable } from 'svelte/store';

const createStore = () => {
  const { subscribe, set } = writable([]);

  // TODO might extend in the future!

  return { subscribe, set };
}

export const results = createStore();
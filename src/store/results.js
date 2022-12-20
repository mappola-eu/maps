import { writable } from 'svelte/store';

const createStore = () => {
  const { subscribe, set } = writable([]);
  return { subscribe, set };
}

export const results = createStore();
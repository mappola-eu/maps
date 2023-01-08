import { writable } from 'svelte/store';

export const createStore = () => {
  const { subscribe, set } = writable([]);
  return { subscribe, set };
}

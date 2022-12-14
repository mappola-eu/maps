import Map from './Map.svelte';

import './index.css';

const map = new Map({
	target: document.getElementById('root')
});

export default map;
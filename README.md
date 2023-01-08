# Mappola Maps

Map frontend components for the Mappola project.

## Search Result Map 

A map component for rendering search results.

```js
var results = [ ... ];

// Results can be set in init, or later via .setResults
var map = new SearchResultMap(document.getElementById('map-container', results));

// To change results
map.setResults([ ... ]);
```

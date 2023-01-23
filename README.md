# Mappola Maps

Map frontend components for the Mappola project.

## Search Result Map 

A map component for rendering search results. Online demo is [here](https://rsimon.github.io/mappola-maps).

### Usage

Add the Mappola utility script and CSS stylesheet to the `<head>` of your page or page template.

```html
<html>
  <head>
    <!-- ... -->
    <script src="mappola-maps.js"></script>
    <link rel="stylesheet" href="mappola-maps.css">
  </head>
</html>
```

Use the JavaScript API to mount a map into a DIV element of your choice. __Make sure the page 
has fully loaded when you create the map__, e.g. by calling the initialization code in the
`window.onload` event handler.

```html
<script>
  window.onload = function() {
    // A JavaScript array with the search results
    var results = [ ... ];

    // You can set in initialization...
    var map = new Mappola.SearchResultMap({
      // Mandatory: the container DIV
      parent: document.getElementById('map-container'), 

      // Optional: search results to show initially
      results: results
    ));

    // ...or later via the .setResults method
    map.setResults([ ... ]);
  }
</script>
```

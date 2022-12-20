<script>
  import { ResultMap, MapPopup } from './components';
  import { 
    API_KEY, 
    STYLE,
    DEFAULT_LON,
    DEFAULT_LAT,
    DEFAULT_ZOOM 
  } from './config';
</script>

<ResultMap 
  apiKey={API_KEY} 
  style={STYLE}
  initialState={{
    center: [ DEFAULT_LON, DEFAULT_LAT ],
    zoom: DEFAULT_ZOOM
  }}
  let:map={map} 
  let:selected={selected}>

  <MapPopup map={map} selected={selected} />
  
</ResultMap>
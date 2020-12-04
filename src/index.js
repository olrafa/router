const center = [-34.63, -58.43]; // BsAs as center
const zoom = 12; // starting zoom,

// eslint-disable-next-line no-undef
const leaflet = L;

const map = leaflet.map('mapid');
map.setView(center, zoom);
leaflet.control.scale({ imperial: false }).addTo(map);

const osmMapnik = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

leaflet.tileLayer(osmMapnik, {
  maxZoom: 18,
  // eslint-disable-next-line max-len
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

leaflet.Control.geocoder().addTo(map);

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

// const router = leaflet.Routing.control({
//   waypoints: [
//     leaflet.latLng(-34.75998928571429, -58.39461882653061),
//     leaflet.latLng(-34.6013566, -58.370832375605474)
//   ]
// });
// router.addTo(map);

const geocoder = leaflet.Control.geocoder({ defaultMarkGeocode: false });

const addresses = [];

geocoder.on('markgeocode', e => {
  addresses.push(e.geocode.center);
  console.log(e, e.geocode.center);
  // const waypoint = leaflet.latLng(e.geocode.center.lat, e.geocode.center.lng);
  // router.options.waypoints.push(waypoint);
  console.log(leaflet.marker([e.geocode.center.lat, e.geocode.center.lng]));
  leaflet.marker([e.geocode.center.lat, e.geocode.center.lng]).addTo(map);
  // console.log(e);
  // console.log(addresses);
  const bbox = e.geocode.bbox;
  const poly = leaflet.polygon([
    bbox.getSouthEast(),
    bbox.getNorthEast(),
    bbox.getNorthWest(),
    bbox.getSouthWest()
  ]);
  map.fitBounds(poly.getBounds());
});

geocoder.addTo(map);

// console.log(router);

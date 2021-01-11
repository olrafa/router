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
  const marker = leaflet.marker([e.geocode.center.lat, e.geocode.center.lng]);
  console.log(marker);

  marker.bindPopup(e.geocode.name);
  marker.addTo(map);
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

const createOrsRequest = () => {
  const [firstPoint] = addresses;

  const requestContent = {
    jobs: [],
    vehicles: [{
      id: 1,
      profile: 'driving-car',
      start: [firstPoint.lng, firstPoint.lat],
      end: [firstPoint.lng, firstPoint.lat]
    }],
    options: {
      g: false
    }
  };
  addresses.forEach((addr, i) => {
    requestContent.jobs.push({
      id: i + 1,
      location: [addr.lng, addr.lat]
    });
  });

  const myHeaders = new Headers();
  myHeaders.append('Authorization', '5b3ce3597851110001cf62487055caf6d3ff4a81af41b51b5fbbf037');
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(requestContent),
    redirect: 'follow'
  };

  fetch('https://api.openrouteservice.org/optimization', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

geocoder.addTo(map);

leaflet.Control.Watermark = leaflet.Control.extend({
  onAdd: function (map) {
    const img = leaflet.DomUtil.create('img');
    img.src = './images/cambalache.png';
    img.title = 'Armar ruta!';
    img.onclick = () => createOrsRequest();
    return img;
  }

});

leaflet.control.watermark = opts => new leaflet.Control.Watermark(opts);
const routeButton = leaflet.control.watermark({ position: 'topright' });
routeButton.addTo(map);

// routeButton.onclick = () => console.log(addresses);

// console.log(router);

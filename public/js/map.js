console.log(mapToken);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: "map",
center: listing.geometry.coordinates, 
style: "mapbox://styles/mapbox/streets-v12",
zoom: 8 
});

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h6>${listing.title}</h6><p>Welcome</p>`))
.addTo(map);

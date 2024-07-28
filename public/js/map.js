
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9// starting zoom
});


// Create a new marker.
const marker = new mapboxgl.Marker({
    color: "red",
    // draggable: true
})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(  new mapboxgl.Popup({offset: 25})
    .setHTML(`<h5>${listing.location}</h5>
        <h6>Exact location will be provided after booking!</h6>`))
    .addTo(map);


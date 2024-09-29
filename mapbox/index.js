import config from "./config.js";

const {
    MAPBOX_TOKEN,
    API_RESULT_LIMIT,
    MAP_STYLE,
    MY_COORDINATE,
    MAP_ZOOM,
    SUGGESTION_ID,
    LOCATION_INPUT_ID,
    MY_LOCATION_NAME,
    CARD_CLASSNAME,
} = config

const suggestionElement = document.getElementById(SUGGESTION_ID);
const locationInputElement = document.getElementById(LOCATION_INPUT_ID);

// Function to set Marker and Popup on the map
function setMarker(coordinate, locationName, map, popup, marker) {
    popup
        .setHTML(
            `<div class=${CARD_CLASSNAME}><h3>${locationName}</h3><p>Long: ${coordinate[0]} <br> Lat: ${coordinate[1]}</p></div>`
        )
        .setLngLat(coordinate)
        .addTo(map);
    marker.setLngLat(coordinate).addTo(map).setPopup(popup);
}

function initializeMap() {

    mapboxgl.accessToken = MAPBOX_TOKEN;
    // const { Map, Popup, Marker } = mapboxgl;
    const map = new mapboxgl.Map({
        container: "map",
        style: MAP_STYLE,
        center: MY_COORDINATE,
        zoom: MAP_ZOOM,
    });

    const popup = new mapboxgl.Popup();
    const marker = new mapboxgl.Marker();


    // Set default location
    setMarker(MY_COORDINATE, MY_LOCATION_NAME, map, popup, marker);

}

function onClickSuggestion(element) {
    element.addEventListener("click", function() {
        const coords = this.getAttribute("coordinates").split(",").map(Number);
        const placeName = this.getAttribute("placeName");

        setMarker(coords, placeName, );
        map.flyTo({ center: coords, zoom: MAP_ZOOM });

        suggestionElement.innerHTML = "";
        locationInputElement.value = placeName;
    });
}
// Get suggestions when searching for a location
function onSearchSuggestion(query) {
    if (query.length < 3) {
        suggestionElement.innerHTML = "";
        return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&limit=${
      API_RESULT_LIMIT
    }`;
    return fetch(url)
        .then((response) => response.json())
}

function createSuggestions(data) {
    const suggestions = data.features.map((suggestion) => {
            return `<li coordinates="${suggestion.center}" placeName="${suggestion.place_name}">${suggestion.place_name}</li>`;
        })
        .join("");

    suggestionElement.innerHTML = suggestions;

    document.querySelectorAll("li").forEach((li) => onClickSuggestion(li));
}

locationInputElement.addEventListener("input", async function() {
    const data = await onSearchSuggestion(this.value);
    if (data) createSuggestions(data)
});
// Call the function to initialize the map
initializeMap(config);
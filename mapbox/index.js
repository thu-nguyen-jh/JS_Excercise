import config from "./config.js";

// Function to set Marker and Popup on the map


function initializeMap(config) {
    const {
        MAPBOX_TOKEN,
        MAP_STYLE,
        MAP_ZOOM,
        MY_COORDINATE,
    } = config;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Set default location

    return new mapboxgl.Map({
        container: "map",
        style: MAP_STYLE,
        center: MY_COORDINATE,
        zoom: MAP_ZOOM,
    });

}

function useMap(config) {

    const map = initializeMap(config);
    const {
        MY_COORDINATE,
        MY_LOCATION_NAME,
        API_RESULT_LIMIT,
        SUGGESTION_ID,
        LOCATION_INPUT_ID
    } = config;

    const suggestionElement = document.getElementById(SUGGESTION_ID);
    const locationInputElement = document.getElementById(LOCATION_INPUT_ID);

    setMarker({ coordinate: MY_COORDINATE, locationName: MY_LOCATION_NAME, map: map });

    function onClickSuggestion({ element }) {
        element.addEventListener("click", function() {
            const coords = this.getAttribute("coordinates").split(",").map(Number);
            const placeName = this.getAttribute("placeName");

            map.flyTo({ center: coords, zoom: config.MAP_ZOOM });
            setMarker({ coordinate: coords, locationName: placeName, map: map });

            suggestionElement.innerHTML = "";
            locationInputElement.value = placeName;
        });
    }
    // Get suggestions when searching for a location
    function onSearchSuggestion({ query }) {

        if (query.length < 3) {
            suggestionElement.innerHTML = "";
            return;
        }

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
        )}.json?access_token=${
            mapboxgl.accessToken
        }&autocomplete=true&limit=${API_RESULT_LIMIT}`;
        return fetch(url).then((response) => response.json());
    }

    function createSuggestions({ data }) {
        const suggestions = data.features
            .map((suggestion) => {
                return `<li coordinates="${suggestion.center}" placeName="${suggestion.place_name}">${suggestion.place_name}</li>`;
            })
            .join("");

        suggestionElement.innerHTML = suggestions;

        document.querySelectorAll("li").forEach((li) => onClickSuggestion({ element: li }));
    }



    locationInputElement.addEventListener("input", async function() {

        const data = await onSearchSuggestion({ query: this.value });
        if (data) createSuggestions({ data: data });
    });

}

function setMarker({
    coordinate,
    locationName,
    map
}) {
    const popup = new mapboxgl.Popup();
    const marker = new mapboxgl.Marker();
    popup
        .setHTML(
            `<div class=${config.CARD_CLASSNAME}><h3>${locationName}</h3><p>Long: ${coordinate[0]} <br> Lat: ${coordinate[1]}</p></div>`
        )
        .setLngLat(coordinate)
        .addTo(map);
    marker.setLngLat(coordinate).addTo(map).setPopup(popup);
}

useMap(config)
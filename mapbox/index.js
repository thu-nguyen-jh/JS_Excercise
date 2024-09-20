(function() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiaHV5aGExNzA1IiwiYSI6ImNtMHdsbnF6NzAyemgybHExeG1hc3Z3djkifQ.HZG1Idf72pop2QSHkf7vug';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [106.66, 10.76],
    zoom: 11
  });

  const marker = new mapboxgl.Marker()
    .setLngLat([106.66, 10.76])
    .addTo(map);

  const popup = new mapboxgl.Popup()
    .setHTML('<div class="info-card"><h3>Ho Chi Minh City</h3><p>Long: 106.66 <br> Lat: 10.76</p></div>')
    .setLngLat([106.66, 10.76])
    .addTo(map);

  marker.setPopup(popup); 

  function updateLocation(longLat, placeName) {
    const infoCard = document.createElement('div');
    infoCard.className = 'info-card';
    infoCard.innerHTML = `<h3>${placeName}</h3><p>Long: ${longLat[0]} <br> Lat: ${longLat[1]}</p>`;
    console.log(longLat);
    
    popup.setDOMContent(infoCard); 
    popup.setLngLat(longLat); 

    marker.setLngLat(longLat)
      .setPopup(popup) 
      .addTo(map); 
    
    map.flyTo({ center: longLat, zoom: 11 });
  }

  function getSuggestion(query) {
    if (query.length < 3) {
      document.getElementById('suggestions').innerHTML = '';
      return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&limit=5`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const suggestions = data.features.map(sugesstion => {
          return `<li coordinates="${sugesstion.geometry.coordinates}" placeName="${sugesstion.place_name}">${sugesstion.place_name}</li>`;
        }).join('');

        document.getElementById('suggestions').innerHTML = suggestions;

        document.querySelectorAll('li').forEach(li => {
          li.addEventListener('click', function () {
            const coords = this.getAttribute('coordinates').split(',').map(Number);
            const placeName = this.getAttribute('placeName');
            updateLocation(coords, placeName);
            document.getElementById('suggestions').innerHTML = ''; 
            document.getElementById('location-input').value = placeName; 
          });
        });
      });
  }

  document.getElementById('location-input').addEventListener('input', function () {
    getSuggestion(this.value);
  });

})();
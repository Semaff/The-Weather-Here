async function getData() {
    const response = await fetch('/api');
    const data = await response.json();

    const mymap = L.map('map').setView([0, 0], 1);
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(mymap);

    for (item of data) {
        const marker = L.marker([item.latitudeCoords, item.longitudeCoords]).addTo(mymap);
        let txt = `The weather here at ${item.latitudeCoords} ; ${item.longitudeCoords}
        with a temperature of ${item.weather.temperature} degrees Celcius`

        if(item.air.value < 0){
            txt += `
            No air quality reading`
        } else {
            txt += `
            Concentration of particular matter (${item.air.parameter})
            is ${item.air.value} ${item.air.units}
            last read on ${item.air.lastUpdated}.`
        }

        marker.bindPopup(txt);
    }

    console.log(data)
}

getData()
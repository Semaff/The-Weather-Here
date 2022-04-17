
// Send Data to the server
async function sendData() {
    let latitudeCoords, longitudeCoords, weather, air;

    if ('geolocation' in navigator) {
        console.log("geolocation available");

        navigator.geolocation.getCurrentPosition(async function (position) {
            try {
                latitudeCoords = position.coords.latitude.toFixed(1);
                longitudeCoords = position.coords.longitude.toFixed(1);

                latitude.textContent = latitudeCoords;
                longitude.textContent = longitudeCoords;

                const api_url = `weather/${latitudeCoords},${longitudeCoords}`;
                const response = await fetch(api_url);
                const json = await response.json();
                console.log(json);

                weather = json.weather.main;
                document.getElementById("summary").textContent = weather.feels_like;
                document.getElementById("temp").textContent = weather.temp;
                
                air = json.airQuality.results[0].measurements[1];
                document.getElementById("aq_parameter").textContent = air.parameter;
                document.getElementById("aq_value").textContent = air.value;
                document.getElementById("aq_units").textContent = air.unit;
                document.getElementById("aq_date").textContent = air.lastUpdated;
            } catch (err) {
                air = {value: -1};
            }

            const data = { latitudeCoords, longitudeCoords, weather, air };
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };

            const dbResponse = await fetch('/api', options);
            const dbJSON = await dbResponse.json();
            console.log(dbJSON)
        })
    } else {
        console.log("geolocation isn't available")
    }
}

sendData();

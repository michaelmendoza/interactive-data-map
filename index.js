// Notes: World GeoJson adapted from https://bitbucket.org/voron-raven/maps/src/master/geojson/world.geojson
// Code is modified from Leafletjs example: https://leafletjs.com/examples/choropleth/

var map = L.map('map').setView([37.8, -96], 1);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

let data = window.data.mockData(1000)
data.forEach((point)=> {
    L.marker(point).addTo(map);
})

// get color depending on population density value
function getColor(d) {
    return d > 1000 ? '#800026' :
            d > 500  ? '#BD0026' :
            d > 200  ? '#E31A1C' :
            d > 100  ? '#FC4E2A' :
            d > 50   ? '#FD8D3C' :
            d > 20   ? '#FEB24C' :
            d > 10   ? '#FED976' :
                        '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.density)
    };
}

async function fetchJson(filename) {
    let response = await fetch(filename);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    else {
        return response.json() 
    }
}

async function processJson() {
    let countriesByContinent = await fetchJson('./json/country-by-continent.json').catch(e => console.log(e.message));
    let countriesGeoJson = await fetchJson('./json/world.geojson').catch(e => console.log(e.message));

    console.log(countriesByContinent);
    console.log(countriesGeoJson);
    
    filteredGeoJsons = filterCountryByContinent("Africa", countriesByContinent, countriesGeoJson);
    
    var geojson = L.geoJson(filteredGeoJsons, {
        style: style,
    }).addTo(map);
}

function filterCountryByContinent(continent, countriesByContinent, countriesGeoJson) {

    // Get continent from country
    var GetContinentFromCountry = (country) => {
        let results = countriesByContinent.find(item => { 
            return item.country === country; 
        })
        
        // Validate find results
        if(results === undefined) {
            console.log(country + ' not found');
            return '';
        }
        else {
            return results.continent;
        }
    }
    
    // Filter geoJson by continent
    let features = countriesGeoJson.features.filter((item) => {
        return GetContinentFromCountry(item.properties.name) == continent;
    })

    // Returns a filtered geoJson 
    return { 
        type:"FeatureCollection",
        features:features,
    }
}

function AddCountientToGeoJson(countriesByContinent, countriesGeoJson) {

    let updateGeoJson = countriesGeoJson.map((item) => {
        let results = countriesByContinent.find(item => { 
            return item.country === country; 
        })
        let continent = results.continent;

        return { geometry:item.geometry, properties: { name:item.properties.name, continent:continent } }

    })

    // { geometry, properties: {name, country}, type:Feature }
}

processJson();

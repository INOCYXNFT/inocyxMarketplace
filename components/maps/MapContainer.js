import { Map, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import GlobalData from "../../utility/grids.json";
import LandModal from "./LandModal";
import { useEffect, useState } from "react";
import { Close, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useRef } from "react";

const MapContainer = () => {
  const [currentLand, setCurrentLand] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [mapTheme, setMapTheme] = useState("mapbox/navigation-night-v1");
  const mapRef = useRef();
  const center = [13.093228, 80.257722];

  useEffect(() => {
    const theme = localStorage.getItem("maptheme");
    setMapTheme(theme ?? "mapbox/navigation-night-v1");
  }, []);

  const handleAutocomplete = async (e) => {
    setQuery(e.target.value);
    if (e.target.value) {
      await fetch(
        `https://api.mapbox.com/search/v1/suggest/${e.target.value}?access_token=pk.eyJ1Ijoic2VhcmNoLW1hY2hpbmUtdXNlci0xIiwiYSI6ImNrNnJ6bDdzdzA5cnAza3F4aTVwcWxqdWEifQ.RFF7CVFKrUsZVrJsFzhRvQ&session_token=c245b36c-ff83-4489-8cd1-c5c422fb89e6&language=en&limit=10&types=country%2Cregion%2Cdistrict%2Cpostcode%2Clocality%2Cplace%2Cneighborhood%2Caddress%2Cpoi%2Cstreet%2Ccategory&proximity=79.70487975999997%2C12.813581459999996`
      )
        .then((res) => {
          res.json().then((e) => {
            // console.log(e.suggestions.slice(0, 6))
            setSuggestions(e.suggestions.slice(0, 6));
          });
        })
        .catch(() => { });
    } else setSuggestions([]);
  };

  const handleRetrieval = async (e) => {
    if (e) {
      setQuery(e.feature_name);
      setSuggestions([]);
      await fetch(
        `https://api.mapbox.com/search/v1/retrieve?access_token=pk.eyJ1Ijoic2VhcmNoLW1hY2hpbmUtdXNlci0xIiwiYSI6ImNrNnJ6bDdzdzA5cnAza3F4aTVwcWxqdWEifQ.RFF7CVFKrUsZVrJsFzhRvQ&session_token=ed8cd814-bdcc-4cd9-9f70-0f8d055fec91`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(e.action.body),
        }
      )
        .then((res) => {
          res.json().then((e) => {
            const { current } = mapRef;
            const { leafletElement: map } = current;
            console.log(e)
            map.flyTo(e.features[0].geometry.coordinates.reverse(), 14);
          });
        })
        .catch(() => { });
    }
  };
  return (
    <div className="h-[100vh] w-full">
      <Map
        center={center}
        minZoom={4}
        animate
        zoom={18}
        ref={mapRef}
        // onzoom={e => setZoomLevel(e.sourceTarget.getZoom())}
        className="z-0"
        scrollWheelZoom
        zoomControl={false}
        style={{ width: "100%", height: "100vh" }}
      >
        <TileLayer
          attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url={`https://api.mapbox.com/styles/v1/${mapTheme}/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ29rdWx2YXJhZGFuIiwiYSI6ImNsMHBwNmdsNjF5N3kzYnB3eng2YTZrbnYifQ.Dra008J3X0rJfdIM_09fmg`}
        />
        {GlobalData.features.map((country, index) => {
          return (
            <Polygon
              clickable={true}
              key={index}
              onmouseover={(e) => {
                const layer = e.target;
                if (country.properties.id === currentLand) {
                  layer.setStyle({
                    color: "#DA1B9B",
                    fillColor: "#DA1B9B",
                    fillOpacity: 1,
                  });
                } else {
                  layer.setStyle({
                    color: "#06D2F5",
                    fillColor: "#06D2F5",
                    fillOpacity: 0.1,
                  });
                }
              }}
              onmouseout={(e) => {
                const layer = e.target;
                if (country.properties.id === currentLand) {
                  layer.setStyle({
                    color: "#DA1B9B",
                    fillColor: "#DA1B9B",
                    fillOpacity: 1,
                  });
                } else {
                  layer.setStyle({
                    color: "#DA1B9B",
                    fillColor: "#DA1B9B",
                    fillOpacity: 0.1,
                  });
                }
              }}
              color={country.properties.id === currentLand ? "#06D2F5" : "#DA1B9B"}
              fillOpacity={country.properties.id === currentLand ? "1" : "0.1"}


              onclick={() => {
                setCurrentLand(country.properties.id);
              }}
              positions={country.geometry.coordinates}
            />
          );
        })}
      </Map>

      <div className="absolute top-28 md:left-6 left-2 flex flex-row gap-4 items-center max-w-screen-2xl w-full ">
        <div className="relative z-50  w-auto rounded-xl bg-forground/30 border-2 border-white/20 hover:border-white/60 p-2  backdrop-blur-lg">
          <input
            className="ml-4 bg-transparent text-white outline-none "
            name="place"
            placeholder="Search Places"
            value={query}
            type="text"
            autoComplete="off"
            onChange={handleAutocomplete}
          />
          {query ? (
            <IconButton
              onClick={() => {
                setQuery("");
                setSuggestions([]);
              }}
            >
              <Close className="text-white text-md" />
            </IconButton>
          ) : (
            <IconButton>
              <Search className="text-white text-md" />
            </IconButton>
          )}
          <div className="absolute left-0 top-14 z-50 flex w-full flex-col items-start overflow-scroll rounded-xl bg-forground/70 backdrop-blur-lg ">
            {suggestions.map((sugg, index) => (
              <div
                key={index}
                className="w-full cursor-pointer rounded-xl p-4 hover:bg-white/20 border-b-2 border-white/20"
                onClick={() => handleRetrieval(sugg)}
              >
                <p className=" text-md">{sugg.feature_name}</p>
                <p className=" text-[12px] opacity-80 ">{sugg.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <select
            value={mapTheme}
            className="z-40 w-full overflow-hidden rounded-lg bg-forground/30 p-4 text-white backdrop-blur-lg border-2 border-white/20 hover:border-white/60"
            onChange={(e) => {
              localStorage.setItem("maptheme", e.target.value);
              setMapTheme(e.target.value);
            }}
          >
            <option
              className="p-2 text-black"
              value="gokulvaradan/cl6nnkzhg005y14ml7dgo0jxc"
            >
              Dark
            </option>
            <option
              className="p-2 text-black"
              value="gokulvaradan/cl6nnx8hc000214pqoj106ip0"
            >
              Light
            </option>
            <option
              className="p-2 text-black"
              value="gokulvaradan/cl6nnt5w8002c15o9jo4xt2z0"
            >
              Satellite
            </option>
            <option className="p-2 text-black" value="mapbox/navigation-day-v1">
              Navigation Day
            </option>
            <option
              className="p-2 text-black"
              value="mapbox/navigation-night-v1"
            >
              Navigation Night
            </option>
          </select>
        </div>
      </div>
      <LandModal landId={currentLand} />
    </div>
  );
};

export default MapContainer;

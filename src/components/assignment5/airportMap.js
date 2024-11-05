import React from "react";
import { geoPath, geoMercator } from "d3-geo";
import { Routes } from './routes';

function AirportMap(props) {
    const { width, height, countries, airports, routes, selectedAirlineID } = props;

    const projection = geoMercator()
        .scale(97)
        .translate([width / 2, height / 2 + 20]);

    const pathGenerator = geoPath().projection(projection);

    return (
        <g>
            {countries.features.map((country, index) => {
                const path = pathGenerator(country);
                return (
                    <path
                        key={index}
                        d={path}
                        fill="#eee"
                        stroke="#ccc"
                    />
                );
            })}

            {airports.map((airport, index) => {
                const latitude = airport.Latitude;
                const longitude = airport.Longitude;

                if (latitude !== undefined && longitude !== undefined) {
                    const [x, y] = projection([longitude, latitude]);
                    if (!isNaN(x) && !isNaN(y)) {
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r={1}
                                fill="#2a5599"
                            />
                        );
                    }
                }
                return null;
            })}

            <Routes projection={projection} routes={routes} selectedAirlineID={selectedAirlineID} />
        </g>
    );
}

export { AirportMap };
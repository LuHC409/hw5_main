import React from "react";
import { groupByCity } from "./utils";
import { forceSimulation, forceX, forceY, forceCollide, scaleLinear, min, max } from "d3";

function AirportBubble(props) {
    const { width, height, routes, selectedAirline } = props;

    const renderBubbles = (cities) => {
        const radiusScale = scaleLinear()
            .domain([min(cities, (d) => d.Count), max(cities, (d) => d.Count)])
            .range([2, width * 0.15]);

        const simulation = forceSimulation(cities)
            .velocityDecay(0.2)
            .force("x", forceX(width / 2).strength(0.02))
            .force("y", forceY(height / 2).strength(0.02))
            .force("collide", forceCollide((d) => radiusScale(d.Count)))
            .tick(200);

        return cities.map((city, idx) => {
            const isTop5 = idx >= cities.length - 5;
            return (
                <g key={idx}>
                    <circle
                        cx={city.x}
                        cy={city.y}
                        r={radiusScale(city.Count)}
                        fill={isTop5 ? "#ADD8E6" : "#2a5599"}
                        stroke="black"
                        strokeWidth="2"
                    />
                    {isTop5 && (
                        <text
                            x={city.x}
                            y={city.y}
                            style={{
                                textAnchor: "middle",
                                stroke: "pink",
                                strokeWidth: "0.5em",
                                fill: "#992a2a",
                                fontSize: 16,
                                fontFamily: "cursive",
                                paintOrder: "stroke",
                                strokeLinejoin: "round",
                            }}
                        >
                            {city.City}
                        </text>
                    )}
                </g>
            );
        });
    };

    if (selectedAirline) {
        let selectedRoutes = routes.filter((a) => a.AirlineID === selectedAirline);
        let cities = groupByCity(selectedRoutes);
        cities.sort((a, b) => a.Count - b.Count);
        return <g>{renderBubbles(cities)}</g>;
    } else {
        let cities = groupByCity(routes);
        cities.sort((a, b) => a.Count - b.Count);
        return <g>{renderBubbles(cities)}</g>;
    }
}

export { AirportBubble };
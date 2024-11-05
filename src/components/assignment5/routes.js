import React from "react";

function Routes(props) {
    const { projection, routes, selectedAirlineID } = props;


    if (selectedAirlineID === null) {
        return <g></g>;
    }


    const filteredRoutes = routes.filter(route => route.AirlineID === selectedAirlineID);

    console.log("Filtered Routes for selected airline:", filteredRoutes); 

    return (
        <g>
            {filteredRoutes.map((route, index) => {

                const sourceCoords = [route.SourceLongitude, route.SourceLatitude];
                const destCoords = [route.DestLongitude, route.DestLatitude];

                const [x1, y1] = projection(sourceCoords);
                const [x2, y2] = projection(destCoords);

                console.log(`Route ${index}: Source (${x1}, ${y1}), Destination (${x2}, ${y2})`); 

                if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
                    return (
                        <line
                            key={index}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#992a5b"
                            strokeWidth={0.5}
                        />
                    );
                }
                return null;
            })}
        </g>
    );
}

export { Routes };

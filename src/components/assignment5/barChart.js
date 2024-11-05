import React from "react";
import { max, scaleBand, scaleLinear } from "d3";
import { XAxis, YAxis } from "./axes";

export function BarChart(props) {
    const { offsetX, offsetY, data, height, width, selectedAirline, setSelectedAirline } = props;

    const maxCount = max(data, d => d.Count);

    const xScale = scaleLinear()
        .domain([0, maxCount])
        .range([0, width]);

    const yScale = scaleBand()
        .domain(data.map(d => d.AirlineName))
        .range([0, height])
        .padding(0.2);

    const color = d => {
        const barColor = d.AirlineID === selectedAirline ? "#992a5b" : "#2a5599";
        console.log(`Color for ${d.AirlineName}:`, barColor); // 调试颜色
        return barColor;
    };

    const onMouseOver = d => {
        console.log(`Mouse over ${d.AirlineName}`); // 调试悬停事件
        setSelectedAirline(d.AirlineID);
    };

    const onMouseOut = () => {
        console.log("Mouse out of bar"); // 调试移出事件
        setSelectedAirline(null);
    };

    return (
        <g transform={`translate(${offsetX}, ${offsetY})`}>
            {data.map(d => (
                <rect
                    key={d.AirlineID}
                    x={0}
                    y={yScale(d.AirlineName)}
                    width={xScale(d.Count)}
                    height={yScale.bandwidth()}
                    fill={color(d)}
                    onMouseOver={() => onMouseOver(d)}
                    onMouseOut={onMouseOut}
                />
            ))}
            
            <XAxis xScale={xScale} height={height} />
            <YAxis yScale={yScale} />
        </g>
    );
}

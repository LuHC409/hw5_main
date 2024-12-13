import React from "react";
import { max, scaleBand, scaleLinear } from "d3";
import { XAxis, YAxis } from "./axes";

export function BarChart(props) {
    const { offsetX, offsetY, data, height, width, selectedAirline, setSelectedAirline } = props;

    // 计算数据的最大值
    const maxCount = max(data, (d) => d.Count);

    // 定义 xScale 和 yScale
    const xScale = scaleLinear()
        .domain([0, maxCount + 100]) 
        .range([0, width]);

    const yScale = scaleBand()
        .domain(data.map((d) => d.AirlineName))
        .range([0, height])
        .padding(0.2);

    // 定义颜色函数
    const color = (d) =>
        d.AirlineID === selectedAirline ? "#992a5b" : "#2a5599";

    // 定义鼠标事件处理函数
    const onMouseOver = (d) => {
        console.log(`Mouse over AirlineID: ${d.AirlineID}`);
        setSelectedAirline(d.AirlineID);
    };

    const onMouseOut = () => {
        setSelectedAirline(null);
    };

    // 生成柱状图
    const bars = data.map((d) => (
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
    ));

    // 定义统一的轴样式
    const axisStyle = {
        fontSize: "12px",
        fontWeight: "bold",
    };

    // 返回柱状图和坐标轴
    return (
        <g transform={`translate(${offsetX}, ${offsetY})`}>
            {bars}
            <XAxis xScale={xScale} width={width} height={height} style={axisStyle} />
            <YAxis yScale={yScale} height={height} offsetX={offsetX - 5} style={axisStyle} />
        </g>
    );
}

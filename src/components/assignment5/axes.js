// import React from "react";

// export { XAxis, YAxis };
// //TODO: complete the YAxis
// // 1.Draw the y-axis, using <line>;
// // 2.Draw the ticks, using yScale.domain() to get the ticks (i.e., names of airlines);
// // For each tick line, we set x1={-5}, x2={0}, y1 and y2 are the half of yScale.bandwidth()
// // For the tick text, we set style={{textAnchor: 'start', fontSize:'10px'}}, x={-offsetX+10},y={yScale.bandwidth()/2}
// function YAxis (props) {
//     const { yScale, height, offsetX } = props;
//     return <g>
        
//     </g>
// }

// function XAxis(props) {
//     const { xScale, width, height} = props;

//     return <g transform={`translate(${0}, ${height})`}>
//         {<line x2={width} stroke='black'/>}
//         {xScale.ticks(5).map(tickValue => 
//             <g key={tickValue} transform={`translate(${xScale(tickValue)}, ${0})`}>
//                 <line y2={10} stroke='black' />
//                 <text style={{ textAnchor:'end', fontSize:'10px' }} x={5} y={20}>
//                     {tickValue}
//                 </text>
//             </g>
//         )}
//     </g>
    
// }


import React from "react";

export { XAxis, YAxis };

function YAxis(props) {
    const { yScale, height, offsetX } = props;

    return (
        <g>
            {/* y 轴主线 */}
            <line y2={height} stroke="black" />

            {/* y 轴的刻度和标签 */}
            {yScale.domain().map((tickValue) => (
                <g
                    key={tickValue}
                    transform={`translate(0, ${yScale(tickValue) + yScale.bandwidth() / 2})`}
                >
                    {/* 刻度线，缩短长度 */}
                    <line x1={-5} x2={0} stroke="black" />

                    {/* 刻度标签，调整位置 */}
                    <text
                        style={{ textAnchor: "end", fontSize: "10px" }} // 将 textAnchor 调整为 "end"
                        x={-10} // 将 x 位置调整到更靠近轴线的位置
                        y={0}
                        dy="0.32em" // 垂直居中
                    >
                        {tickValue}
                    </text>
                </g>
            ))}
        </g>
    );
}


function XAxis(props) {
    const { xScale, width, height } = props;

    return (
        <g transform={`translate(${0}, ${height})`}>
            {/* x 轴的主线 */}
            <line x2={width} stroke="black" />

            {/* x 轴的刻度和标签 */}
            {xScale.ticks(5).map((tickValue) => (
                <g key={tickValue} transform={`translate(${xScale(tickValue)}, ${0})`}>
                    {/* 刻度线 */}
                    <line y2={10} stroke="black" />
                    {/* 刻度标签 */}
                    <text style={{ textAnchor: "end", fontSize: "10px" }} x={5} y={20}>
                        {tickValue}
                    </text>
                </g>
            ))}
        </g>
    );
}

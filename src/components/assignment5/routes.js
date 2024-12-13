import React from "react";

function Routes(props) {
  const { projection, routes, selectedAirline } = props;
  console.log("Selected Airline ID in Routes component:", selectedAirline);

  // 如果没有选中的航空公司，则返回空的 <g></g>
  if (selectedAirline === null) {
    return <g></g>;
  }

  // 筛选出选中的航空公司航线
  const selectedRoutes = routes.filter(
    (route) => route.AirlineID === selectedAirline
  );

  // 绘制航线
  return (
    <g>
      {selectedRoutes.map((route, index) => {
        // 获取起点和终点的经纬度
        const sourceCoords = [route.SourceLongitude, route.SourceLatitude];
        const destCoords = [route.DestLongitude, route.DestLatitude];

        // 使用投影函数将经纬度转换为屏幕上的平面坐标
        const [x1, y1] = projection(sourceCoords);
        const [x2, y2] = projection(destCoords);

        // 如果坐标有效，则绘制航线
        if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#992a5b" 
              strokeWidth={0.25} // 将原来的 0.5 调小，例如 0.25 或 0.1
            />
          );
        }

        return null;
      })}
    </g>
  );
}

export { Routes };

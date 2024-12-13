import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import '../styles/assignment5_styles.module.css'; // 导入 styles 文件夹下的 test.css


export default function Home() {
    const [teamTotalScores, setTeamTotalScores] = useState([]);
    const [seasonData, setSeasonData] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null); // 用于存储选中的球员
    const [tablePosition, setTablePosition] = useState({ left: 0, top: 0 }); // 表格的位置
    const [topScores, setTopScores] = useState({ points: [], rebounds: [], assists: [] }); // 保存Top5的得分、篮板和助攻数据
    const [selectedComparison, setSelectedComparison] = useState([]); // 存储对比的球员
    const [comparisonData, setComparisonData] = useState(null); // 用于存储对比数据
  useEffect(() => {
    // 使用 fetch 获取 CSV 文件
    fetch('/all_seasons.csv') // 这里是你的 CSV 文件路径
      .then(response => response.text()) // 获取文件内容
      .then(csvData => {
        // 使用 PapaParse 解析 CSV 数据
        Papa.parse(csvData, {
          header: true, // 自动解析第一行作为字段名
          skipEmptyLines: true, // 跳过空行
          complete: (result) => {
            const data = result.data;

            // 获取所有不同的赛季
            const seasons = [...new Set(data.map(player => player.season))];
            setSeasonData(data); // 保存所有的原始数据
            setSelectedSeason(seasons[0]); // 默认选择第一个赛季

            // 初次加载时也根据第一个赛季显示数据
            handleSeasonChange(seasons[0], data);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching the CSV file:', error);
      });
  }, []);

  // 处理赛季选择变化
  const handleSeasonChange = (season, data) => {
    setSelectedSeason(season);

    // 筛选出对应赛季的数据
    const filteredData = data.filter(player => player.season === season);

    // 按球队分组并计算每个球员的总得分
    const teamScores = {};
    const playerScores = {};

    filteredData.forEach(player => {
        const team = player.team_abbreviation;
        const points = parseFloat(player.pts); // 平均得分
        const rebounds = parseFloat(player.reb); // 篮板
        const assists = parseFloat(player.ast); // 助攻
        const gamesPlayed = parseInt(player.gp); // 场次
  
      // 计算每个球员的总得分
      const totalPoints = Math.round(points * gamesPlayed); // 四舍五入得分

      // 存储每个球员的详细信息
      playerScores[player.player_name] = {
        playerName: player.player_name,
        totalPoints: totalPoints,
        pointsPerGame: points,
        gamesPlayed: gamesPlayed,
        team: team,
        age: player.age,
        height: player.player_height,
        weight: player.player_weight,
        college: player.college,
        country: player.country,
        draftYear: player.draft_year,
        draftRound: player.draft_round,
        draftNumber: player.draft_number,
        netRating: player.net_rating,
        offensiveRebPct: player.oreb_pct,
        defensiveRebPct: player.dreb_pct,
        usagePct: player.usg_pct,
        tsPct: player.ts_pct,
        assistPct: player.ast_pct,
        season: player.season
      };

      // 按队伍分组球员
      if (!teamScores[team]) {
        teamScores[team] = [];
      }

      // 确保该球员未在此队伍中出现（防止重复）
      if (!teamScores[team].some(p => p.player === player.player_name)) {
        teamScores[team].push({ player: player.player_name, totalPoints });
      }
    });

    // 计算每个队伍的总得分，并按得分排序
    const teamTotalScores = Object.keys(teamScores).map(team => {
      const totalScore = teamScores[team].reduce((acc, player) => acc + player.totalPoints, 0);
      return {
        team,
        totalScore,
        players: teamScores[team]
      };
    });

    // 按照队伍总得分进行排序
    teamTotalScores.sort((a, b) => b.totalScore - a.totalScore);

    // 对每个球队的球员按得分排序
    teamTotalScores.forEach(team => {
      // 按得分排序
      team.players.sort((a, b) => b.totalPoints - a.totalPoints);

      // 为每个球员分配颜色
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // 使用 D3 的颜色方案

      // 给每个球员分配不同的颜色
      team.players.forEach((player, index) => {
        // 每个球员都分配不同的颜色，不论得分是否相同
        player.color = colorScale(index); // 使用球员的索引作为颜色的映射依据
      });
    });

    // 更新状态以触发可视化
    setTeamTotalScores(teamTotalScores);
    const topPoints = filteredData.sort((a, b) => b.pts - a.pts).slice(0, 5);
    const topRebounds = filteredData.sort((a, b) => b.reb - a.reb).slice(0, 5);
    const topAssists = filteredData.sort((a, b) => b.ast - a.ast).slice(0, 5);

    setTopScores({
      points: topPoints,
      rebounds: topRebounds,
      assists: topAssists
    });

    // 可视化部分
    const width = 700 * 1.8;  // 宽度增加1.3倍
    const height = 600 * 1.3; // 高度增加1.3倍
    const margin = { top: 20 * 1.3, right: 100 * 1.3, bottom: 40 * 1.3, left: 100 * 1.3 }; // 边距增加1.3倍

    const maxBarHeight = height - margin.top - margin.bottom;
    const maxScore = d3.max(teamTotalScores, d => d.totalScore);
    const barHeight = maxBarHeight / teamTotalScores.length;

    const xScale = d3.scaleLinear()
      .domain([0, maxScore * 1.1])
      .range([0, width - margin.left - margin.right]);

    const svg = d3.select('#chart')
      .attr('width', width)
      .attr('height', height);

    // 清空旧的图表
    svg.selectAll("*").remove();

    // 绘制条形图
    const bars = svg.selectAll('.bar')
      .data(teamTotalScores)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${margin.left}, ${margin.top + i * barHeight})`); // 确保从 margin.top 开始

    bars.append('rect')
      .attr('width', d => xScale(d.totalScore))
      .attr('height', barHeight - 2)
      .attr('fill', '#69b3a2');

    bars.append('text')
      .attr('x', d => xScale(d.totalScore) + 5)
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text(d => `${d.team}: ${d.totalScore.toFixed(0)}`) // 四舍五入总得分
      .attr('font-size', '12px')
      .attr('fill', 'black');

      bars.each(function(d) {
        let cumulativeWidth = 0; // 累加的宽度
        const playerBars = d3.select(this).selectAll('.player-bar')
          .data(d.players)
          .enter()
          .append('rect')
          .attr('class', 'player-bar')
          .attr('x', (player) => {
            const width = xScale(player.totalPoints);
            const currentX = cumulativeWidth;
            cumulativeWidth += width;
            return currentX;
          })
          .attr('y', 0)
          .attr('width', (player) => xScale(player.totalPoints))
          .attr('height', barHeight - 2)
          .attr('fill', (player) => player.color);
      
        // 获取前五名球员并绘制名字
        const topPlayers = d.players.slice(0, 5);  // 获取得分前五的球员
      
        let cumulativeX = 0;  // 记录当前绘制位置
        topPlayers.forEach((player, index) => {
          const playerBarWidth = xScale(player.totalPoints); // 获取球员的条形图宽度
      
          // 计算字体大小（动态调整）
          const fontSize = Math.max(8, Math.min(playerBarWidth / player.player.length, 12)); // 字体大小不会小于8px，不会大于12px
          const playerNameX = cumulativeX + 5;  // 名字从每个条形图的起始位置开始
          const playerNameY = barHeight / 2;  // 垂直居中
      
          // 检查当前条形图宽度是否足够容纳名字
          if (fontSize * player.player.length <= playerBarWidth) {
            // 如果名字的空间足够，才绘制名字
            d3.select(this).append('text')
              .attr('x', playerNameX)  // 计算名字的起始位置
              .attr('y', playerNameY)  // 垂直居中
              .attr('dy', '.35em')  // 微调文本位置，确保它垂直居中
              .text(player.player)  // 显示球员名字
              .attr('font-size', fontSize + 'px')  // 动态调整字体大小
              .attr('fill', 'white')  // 使用白色字体
              .style('pointer-events', 'none');  // 确保不会干扰鼠标事件
          }
          // 如果名字不能显示，跳过此球员
          cumulativeX += playerBarWidth;  // 更新累积的宽度
        });


      // 点击事件处理
      d3.select(this).selectAll('.player-bar').on('click', function(event, player) {
        const playerInfo = playerScores[player.player];
        setSelectedPlayer(playerInfo); // 更新选中的球员
        // 更新表格的位置
        const chartBounds = svg.node().getBoundingClientRect();
        const tableLeft = chartBounds.right + 20;
        const tableTop = chartBounds.top + 300;
        setTablePosition({ left: tableLeft, top: tableTop });
      });



    });

    // 添加X轴
    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // 添加Y轴
    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(d3.scaleBand().domain(teamTotalScores.map(d => d.team)).range([0, maxBarHeight])).tickSize(0));
  };




  

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h1>篮球队总得分展示</h1>
        <select
          value={selectedSeason}
          onChange={(e) => handleSeasonChange(e.target.value, seasonData)}
          style={{
            position: 'absolute',
            top: '10%',   // 距离Y轴的上方
            left: '8%',  // 居中
            transform: 'translateX(-50%)',
            zIndex: 10,   // 确保不被其他元素遮挡
          }}
        >
          {Array.from(new Set(seasonData.map(player => player.season))).map((season, index) => (
            <option key={index} value={season}>{season}</option>
          ))}
        </select>
  
        <svg id="chart"></svg>
      </div>
  
      {/* 选中的球员信息表格 */}
      <div>
        {selectedPlayer && (
          <div style={{ position: 'absolute', left: tablePosition.left, top: tablePosition.top }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '400px' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      background: '#f4f4f4',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textTransform: 'uppercase', // 表头文字大写
                    }}
                  >
                    详细信息
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>球员名字</td>
                  <td>{selectedPlayer.playerName}</td>
                </tr>
                <tr>
                  <td>球队</td>
                  <td>{selectedPlayer.team}</td>
                </tr>
                <tr>
                  <td>总得分</td>
                  <td>{selectedPlayer.totalPoints}</td>
                </tr>
                <tr>
                  <td>场次</td>
                  <td>{selectedPlayer.gamesPlayed}</td>
                </tr>
                <tr>
                  <td>每场得分</td>
                  <td>{selectedPlayer.pointsPerGame}</td>
                </tr>
                <tr>
                  <td>身高</td>
                  <td>{selectedPlayer.height}</td>
                </tr>
                <tr>
                  <td>体重</td>
                  <td>{selectedPlayer.weight}</td>
                </tr>
                <tr>
                  <td>年龄</td>
                  <td>{selectedPlayer.age}</td>
                </tr>
                <tr>
                  <td>大学</td>
                  <td>{selectedPlayer.college}</td>
                </tr>
                <tr>
                  <td>国家</td>
                  <td>{selectedPlayer.country}</td>
                </tr>
                <tr>
                  <td>选秀年份</td>
                  <td>{selectedPlayer.draftYear}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
  
        {/* 排行榜展示 */}
        <div style={{ marginTop: '50px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          {/* 得分榜 */}
          <div style={{ width: '30%' }}>
            <h3>得分 Top 5</h3>
            <ul>
              {topScores.points.map((player, index) => (
                <li 
                  key={index} 
                  className="ranking-item"
                  onClick={(e) => {
                    const playerInfo = playerScores[player.player];
                    setSelectedPlayer(playerInfo); // Update selected player info
  
                    // Get chart bounds to position the table and rankings
                    const chartBounds = document.getElementById('chart').getBoundingClientRect();
  
                    // Calculate new table position
                    const tableLeft = chartBounds.right + 20;
                    const tableTop = chartBounds.top + 300; // Adjust for vertical placement
                    setTablePosition({ left: tableLeft, top: tableTop });
                  }}
                >
                  {player.player_name} ({player.team_abbreviation}): {player.pts}
                </li>
              ))}
            </ul>
          </div>
  
          {/* 篮板榜 */}
          <div style={{ width: '30%' }}>
            <h3>篮板 Top 5</h3>
            <ul>
              {topScores.rebounds.map((player, index) => (
                <li 
                  key={index} 
                  className="ranking-item"
                  onClick={(e) => {
                    const playerInfo = playerScores[player.player];
                    setSelectedPlayer(playerInfo);
  
                    const chartBounds = document.getElementById('chart').getBoundingClientRect();
                    const tableLeft = chartBounds.right + 20;
                    const tableTop = chartBounds.top + 300;
                    setTablePosition({ left: tableLeft, top: tableTop });
                  }}
                >
                  {player.player_name} ({player.team_abbreviation}): {player.reb}
                </li>
              ))}
            </ul>
          </div>
  
          {/* 助攻榜 */}
          <div style={{ width: '30%' }}>
            <h3>助攻 Top 5</h3>
            <ul>
              {topScores.assists.map((player, index) => (
                <li 
                  key={index} 
                  className="ranking-item"
                  onClick={(e) => {
                    const playerInfo = playerScores[player.player];
                    setSelectedPlayer(playerInfo);
  
                    const chartBounds = document.getElementById('chart').getBoundingClientRect();
                    const tableLeft = chartBounds.right + 20;
                    const tableTop = chartBounds.top + 300;
                    setTablePosition({ left: tableLeft, top: tableTop });
                  }}
                >
                  {player.player_name} ({player.team_abbreviation}): {player.ast}
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* 球员对比 */}
        {comparisonData && (
          <div style={{ marginTop: '20px' }}>
            <h3>球员对比</h3>
  
            {/* 球员对比的下拉框 */}
            <select
              value={selectedComparisonPlayer}
              onChange={(e) => handlePlayerComparisonChange(e.target.value)}
              style={{
                position: 'absolute',
                left: tablePosition.left + 80, // 使用 chartBounds.right + 80 作为位置
                top: tablePosition.top + 300,  // 使用 chartBounds.top + 300 作为位置
                zIndex: 20,
              }}
            >
              {playerList.map((player, index) => (
                <option key={index} value={player.id}>{player.name}</option>
              ))}
            </select>
  
            {/* 对比结果 */}
            <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '600px' }}>
              <thead>
                <tr>
                  <th>统计</th>
                  <th>{comparisonData.player1.name}</th>
                  <th>{comparisonData.player2.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>得分</td>
                  <td>{comparisonData.player1.points}</td>
                  <td>{comparisonData.player2.points}</td>
                </tr>
                <tr>
                  <td>篮板</td>
                  <td>{comparisonData.player1.rebounds}</td>
                  <td>{comparisonData.player2.rebounds}</td>
                </tr>
                <tr>
                  <td>助攻</td>
                  <td>{comparisonData.player1.assists}</td>
                  <td>{comparisonData.player2.assists}</td>
                </tr>
                <tr>
                  <td>效率值 (TS%)</td>
                  <td>{comparisonData.player1.efficiency}</td>
                  <td>{comparisonData.player2.efficiency}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}  
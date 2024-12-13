import * as d3 from 'd3';

export const createStackedBarChart = (teamTotalScores) => {
    const width = 700 * 1.8;
    const height = 600 * 1.3;
    const margin = { top: 20 * 1.3, right: 100 * 1.3, bottom: 40 * 1.3, left: 100 * 1.3 };

    const maxBarHeight = height - margin.top - margin.bottom;
    const maxScore = d3.max(teamTotalScores, d => d.totalScore);
    const barHeight = maxBarHeight / teamTotalScores.length;

    const xScale = d3.scaleLinear().domain([0, maxScore * 1.1]).range([0, width - margin.left - margin.right]);

    const svg = d3.select('#chart').attr('width', width).attr('height', height);

    svg.selectAll("*").remove(); // 清空旧的图表

    const bars = svg.selectAll('.bar')
        .data(teamTotalScores)
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(${margin.left}, ${margin.top + i * barHeight})`);

    bars.append('rect')
        .attr('width', d => xScale(d.totalScore))
        .attr('height', barHeight - 2)
        .attr('fill', '#69b3a2');

    bars.append('text')
        .attr('x', d => xScale(d.totalScore) + 5)
        .attr('y', barHeight / 2)
        .attr('dy', '.35em')
        .text(d => `${d.team}: ${d.totalScore.toFixed(0)}`)
        .attr('font-size', '12px')
        .attr('fill', 'black');

    bars.each(function(d) {
        let cumulativeWidth = 0;
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
    });

    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(d3.scaleBand().domain(teamTotalScores.map(d => d.team)).range([0, maxBarHeight])).tickSize(0));
};

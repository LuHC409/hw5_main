const PlayerComparison = ({ comparisonData }) => {
    return (
        <div>
            <h3>球员对比</h3>
            <table>
                <thead>
                    <tr>
                        <th>统计</th>
                        <th>{comparisonData.player1.name}</th>
                        <th>{comparisonData.player2.name}</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 显示对比数据 */}
                </tbody>
            </table>
        </div>
    );
}

export default PlayerComparison;

export const PlayerDetailTable = ({ player, tablePosition }) => {
    return (
        <div style={{ position: 'absolute', left: tablePosition.left, top: tablePosition.top }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '400px' }}>
                <thead>
                    <tr>
                        <th
                            style={{
                                padding: '10px',
                                backgroundColor: '#f2f2f2',
                                fontSize: '18px',
                                textAlign: 'center',
                            }}
                        >
                            {player.playerName}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>球队</td><td>{player.team}</td></tr>
                    <tr><td>得分</td><td>{player.totalPoints}</td></tr>
                    <tr><td>场均得分</td><td>{player.pointsPerGame}</td></tr>
                    {/* 其他字段... */}
                </tbody>
            </table>
        </div>
    );
};

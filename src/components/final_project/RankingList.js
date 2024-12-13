export const RankingList = ({ topScores, playerScores, setSelectedPlayer }) => {
    const renderRankings = (type) => {
        return topScores[type].map((player, index) => (
            <li key={index} onClick={() => setSelectedPlayer(playerScores[player.player_name])}>
                {player.player_name} ({player.team_abbreviation}): {player[type]}
            </li>
        ));
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <h2>得分排行榜</h2>
                <ul>{renderRankings('points')}</ul>
            </div>
            <div>
                <h2>篮板排行榜</h2>
                <ul>{renderRankings('rebounds')}</ul>
            </div>
            <div>
                <h2>助攻排行榜</h2>
                <ul>{renderRankings('assists')}</ul>
            </div>
        </div>
    );
};

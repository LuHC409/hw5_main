import Papa from 'papaparse';

export const fetchSeasonData = (setSeasonData, setSelectedSeason, setTeamTotalScores, setTopScores) => {
    fetch('/all_seasons.csv')
        .then(response => response.text())
        .then(csvData => {
            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const data = result.data;
                    const seasons = [...new Set(data.map(player => player.season))];
                    setSeasonData(data);
                    setSelectedSeason(seasons[0]);
                    handleSeasonChange(seasons[0], data, setTeamTotalScores, setTopScores);
                }
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
};

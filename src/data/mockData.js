export const LIVE_MATCHES = [
  {
    id: 1,
    homeTeam: "Argentina",
    awayTeam: "Brazil",
    homeScore: 2,
    awayScore: 1,
    time: "75'",
    status: "LIVE",
    league: "World Cup Qualifiers"
  },
  {
    id: 2,
    homeTeam: "France",
    awayTeam: "Germany",
    homeScore: 0,
    awayScore: 0,
    time: "12'",
    status: "LIVE",
    league: "International Friendly"
  },
  {
    id: 3,
    homeTeam: "Spain",
    awayTeam: "Italy",
    homeScore: 1,
    awayScore: 1,
    time: "HT",
    status: "LIVE",
    league: "Nations League"
  }
];

export const LEAGUES = [
  {
    id: 'PL',
    name: "Premier League",
    emblem: "https://crests.football-data.org/PL.png",
    standings: [
      { rank: 1, team: "Manchester City", played: 20, won: 16, draw: 4, lost: 0, gd: 35, points: 52, teamLogo: "https://crests.football-data.org/65.png" },
      { rank: 2, team: "Arsenal", played: 20, won: 15, draw: 3, lost: 2, gd: 28, points: 48, teamLogo: "https://crests.football-data.org/57.png" },
      { rank: 3, team: "Liverpool", played: 20, won: 13, draw: 6, lost: 1, gd: 25, points: 45, teamLogo: "https://crests.football-data.org/64.png" },
      { rank: 4, team: "Aston Villa", played: 20, won: 13, draw: 3, lost: 4, gd: 15, points: 42, teamLogo: "https://crests.football-data.org/58.png" },
      { rank: 5, team: "Tottenham", played: 20, won: 12, draw: 3, lost: 5, gd: 12, points: 39, teamLogo: "https://crests.football-data.org/73.png" }
    ]
  },
  {
    id: 'PD',
    name: "La Liga",
    emblem: "https://crests.football-data.org/PD.png",
    standings: [
      { rank: 1, team: "Real Madrid", played: 19, won: 15, draw: 3, lost: 1, gd: 29, points: 48, teamLogo: "https://crests.football-data.org/86.png" },
      { rank: 2, team: "Girona", played: 19, won: 15, draw: 3, lost: 1, gd: 22, points: 48, teamLogo: "https://crests.football-data.org/298.png" },
      { rank: 3, team: "Barcelona", played: 19, won: 12, draw: 5, lost: 2, gd: 15, points: 41, teamLogo: "https://crests.football-data.org/81.png" }
    ]
  }
];

export const CUPS = [
  {
    id: 'CL',
    name: "Champions League",
    stage: "Upcoming Matches",
    matches: [
      { home: "Real Madrid", away: "Man City", date: "Apr 15" },
      { home: "Bayern München", away: "Arsenal", date: "Apr 15" },
      { home: "Barcelona", away: "PSG", date: "Apr 16" },
      { home: "Inter Milan", away: "Atlético Madrid", date: "Apr 16" }
    ]
  },
  {
    id: 'CLI',
    name: "Copa Libertadores",
    stage: "Upcoming Matches",
    matches: [
      { home: "Flamengo", away: "River Plate", date: "Apr 22" },
      { home: "Boca Juniors", away: "Palmeiras", date: "Apr 22" },
      { home: "Athletico PR", away: "Nacional", date: "Apr 23" },
      { home: "Fluminense", away: "Peñarol", date: "Apr 23" }
    ]
  }
];

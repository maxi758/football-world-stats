import { LIVE_MATCHES, LEAGUES, CUPS } from '../data/mockData';

const API_KEY = import.meta.env.VITE_API_KEY;

// Always use /api — Vite proxy handles it in dev, Vercel function handles it in prod
const BASE_URL = '/api';

const headers = {
  'X-Auth-Token': API_KEY
};

const LEAGUE_CODES = {
  PREMIER_LEAGUE: 'PL',
  LA_LIGA: 'PD',
  BUNDESLIGA: 'BL1',
  SERIE_A: 'SA',
  LIGUE_1: 'FL1',
  CHAMPIONS_LEAGUE: 'CL',
  COPA_LIBERTADORES: 'CLI'
};

const CACHE_DURATION = {
  SHORT: 60 * 1000, // 1 minute
  LONG: 24 * 60 * 60 * 1000 // 24 hours
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp, duration } = JSON.parse(cached);
    if (Date.now() - timestamp > duration) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
};

const setCachedData = (key, data, duration) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
      duration
    }));
  } catch (e) {
    console.warn("Failed to save to cache", e);
  }
};

const fetchData = async (endpoint, cacheDuration = CACHE_DURATION.SHORT) => {
  const cacheKey = `api_cache_${endpoint}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    console.warn("No API Key found, using mock data");
    throw new Error("No API Key");
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    if (!response.ok) {
        if (response.status === 429) {
            console.warn("API Rate Limit Reached");
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    setCachedData(cacheKey, data, cacheDuration);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const fetchLiveMatches = async () => {
  try {
    const data = await fetchData('/matches?status=LIVE', CACHE_DURATION.SHORT);
    
    if (!data.matches) return [];

    return data.matches.map(match => ({
      id: match.id,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeScore: match.score.fullTime.home ?? match.score.halfTime.home ?? 0,
      awayScore: match.score.fullTime.away ?? match.score.halfTime.away ?? 0,
      time: `${match.minute || 'Live'}'`, 
      status: 'LIVE',
      league: match.competition.name
    }));
  } catch (error) {
    return LIVE_MATCHES;
  }
};

export const fetchLeagues = async () => {
  try {
    const leaguesToFetch = [
      { name: "Premier League", code: LEAGUE_CODES.PREMIER_LEAGUE },
      { name: "La Liga", code: LEAGUE_CODES.LA_LIGA },
      { name: "Bundesliga", code: LEAGUE_CODES.BUNDESLIGA },
      { name: "Serie A", code: LEAGUE_CODES.SERIE_A },
      { name: "Ligue 1", code: LEAGUE_CODES.LIGUE_1 }
    ];

    const results = [];
    
    for (const league of leaguesToFetch) {
        try {
            if (getCachedData(`api_cache_/competitions/${league.code}/standings`)) {
                const data = await fetchData(`/competitions/${league.code}/standings`, CACHE_DURATION.LONG);
                results.push({ league, data });
            } else {
                const data = await fetchData(`/competitions/${league.code}/standings`, CACHE_DURATION.LONG);
                results.push({ league, data });
                await delay(2000); 
            }
        } catch (e) {
            console.warn(`Failed to fetch ${league.name}`, e);
        }
    }

    const transformStandings = (data) => {
      if (!data || !data.standings || data.standings.length === 0) return { table: [], emblem: null };
      const table = data.standings.find(s => s.type === 'TOTAL')?.table || [];
      const emblem = data.competition.emblem; 
      
      return {
        table: table.map(item => ({
            rank: item.position,
            team: item.team.name,
            played: item.playedGames,
            won: item.won,
            draw: item.draw,
            lost: item.lost,
            gd: item.goalDifference,
            points: item.points,
            teamLogo: item.team.crest
        })),
        emblem
      };
    };

    return results.map((item, index) => {
      const transformed = transformStandings(item.data);
      return {
        id: leaguesToFetch[index].code, // Use Code (PL, PD) as ID
        name: item.league.name,
        emblem: transformed.emblem,
        standings: transformed.table
      };
    });
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
    return LEAGUES;
  }
};

export const fetchTopScorers = async (leagueCode, limit = 10) => {
  try {
    const data = await fetchData(
      `/competitions/${leagueCode}/scorers?limit=${limit}`,
      CACHE_DURATION.LONG
    );

    if (!data || !data.scorers) return [];

    return data.scorers.map((entry, i) => ({
      rank: i + 1,
      name: entry.player.name,
      team: entry.team?.name ?? '—',
      teamLogo: entry.team?.crest ?? null,
      goals: entry.goals ?? 0,
      assists: entry.assists ?? 0,
      played: entry.playedMatches ?? 0,
    }));
  } catch (error) {
    console.error(`Failed to fetch top scorers for ${leagueCode}:`, error);
    return [];
  }
};

export const fetchCups = async () => {
  try {
    const transformMatches = (data) => {
        if (!data || !data.matches) return [];
        return data.matches.slice(0, 6).map(match => ({
            home: match.homeTeam.name,
            away: match.awayTeam.name,
            date: new Date(match.utcDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }));
    };

    const [clData, cliData] = await Promise.allSettled([
      fetchData(`/competitions/${LEAGUE_CODES.CHAMPIONS_LEAGUE}/matches?status=SCHEDULED&limit=10`, CACHE_DURATION.LONG),
      fetchData(`/competitions/${LEAGUE_CODES.COPA_LIBERTADORES}/matches?status=SCHEDULED&limit=10`, CACHE_DURATION.LONG)
    ]);

    return [
      {
        id: 'CL',
        name: "Champions League",
        stage: "Upcoming Matches",
        matches: clData.status === 'fulfilled' ? transformMatches(clData.value) : CUPS[0].matches
      },
      {
        id: 'CLI',
        name: "Copa Libertadores",
        stage: "Upcoming Matches",
        matches: cliData.status === 'fulfilled' ? transformMatches(cliData.value) : CUPS[1].matches
      }
    ];
  } catch (error) {
    console.error("Failed to fetch cups:", error);
    return CUPS;
  }
};

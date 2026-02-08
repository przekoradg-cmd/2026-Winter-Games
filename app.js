// ===============================
// TEAM SETUP (ISO-2 country codes)
// ===============================
const teams = {
  "Team DiRezze": ["us", "cn", "fi"],
  "Team Przekora": ["no", "ch", "at"],
  "Team Farner": ["ca", "jp", "fr"],
  "Team Diehl": ["it", "de", "se"]
};

// ===============================
// MEDAL STORAGE
// ===============================
const medalCounts = {};

// Optional fallback so site never looks broken
const fallbackMedals = {
  us: { gold: 0, silver: 0, bronze: 0, total: 0 },
  cn: { gold: 0, silver: 0, bronze: 0, total: 0 },
  fi: { gold: 0, silver: 0, bronze: 0, total: 0 },
  no: { gold: 0, silver: 0, bronze: 0, total: 0 },
  ch: { gold: 0, silver: 0, bronze: 0, total: 0 },
  at: { gold: 0, silver: 0, bronze: 0, total: 0 },
  ca: { gold: 0, silver: 0, bronze: 0, total: 0 },
  jp: { gold: 0, silver: 0, bronze: 0, total: 0 },
  fr: { gold: 0, silver: 0, bronze: 0, total: 0 },
  it: { gold: 0, silver: 0, bronze: 0, total: 0 },
  de: { gold: 0, silver: 0, bronze: 0, total: 0 },
  se: { gold: 0, silver: 0, bronze: 0, total: 0 }
};

// ===============================
// FETCH MEDAL DATA (JSON SOURCE)
// ===============================
async function fetchMedals() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/openfootball/olympics/master/2026/medals.json"
    );

    if (!response.ok) throw new Error("Medal data unavailable");

    const data = await response.json();

    data.forEach(country => {
      const code = country.code.toLowerCase();
      const gold = country.gold || 0;
      const silver = country.silver || 0;
      const bronze = country.bronze || 0;

      medalCounts[code] = {
        gold,
        silver,
        bronze,
        total: gold + silver + bronze
      };
    });

    renderTeams();
    renderLeaderboard();
  } catch (error) {
    console.warn("Using f

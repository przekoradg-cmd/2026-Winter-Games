const teams = {
  "Team DiRezze": ["us","cn","fi"],
  "Team Przekora": ["no","ch","at"],
  "Team Farner": ["ca","jp","fr"],
  "Team Diehl": ["it","de","se"]
};

const medalDataUrl =
  "https://whereig.com/olympics/winter-olympics/2026-winter-olympics-medal-table-milan-cortina.html";

const medalCounts = {};

async function fetchMedals() {
  try {
    const res = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(medalDataUrl)}`
    );
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const rows = doc.querySelectorAll("table tr");
    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 5) {
        const country = cells[1].textContent.trim().toLowerCase();
        const gold = parseInt(cells[2]) || 0;
        const silver = parseInt(cells[3]) || 0;
        const bronze = parseInt(cells[4]) || 0;
        medalCounts[country] = {
          gold,
          silver,
          bronze,
          total: gold + silver + bronze
        };
      }
    });

    displayTeams();
    buildLeaderboard();
  } catch (err) {
    console.warn("Medal fetch failed:", err);
  }
}

function getMedals(code) {
  return medalCounts[code] || { gold: 0, silver: 0, bronze: 0, total: 0 };
}

function displayTeams() {
  const container = document.getElementById("teams");
  container.innerHTML = "";

  Object.entries(teams).forEach(([teamName, countries]) => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `<div class="team-title">${teamName}</div>`;

    countries.forEach(code => {
      const m = getMedals(code);
      card.innerHTML += `
        <div class="medals">
          <img src="https://flagcdn.com/w40/${code}.png" alt="${code} flag">
          🥇 ${m.gold} 🥈 ${m.silver} 🥉 ${m.bronze}
          <strong>Total: ${m.total}</strong>
        </div>
      `;
    });

    container.appendChild(card);
  });
}

function buildLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";

  const scores = Object.entries(teams).map(([team, countries]) => {
    const total = countries.reduce(
      (sum, c) => sum + getMedals(c).total,
      0
    );
    return { team, total };
  });

  scores.sort((a, b) => b.total - a.total);

  scores.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.team}: ${s.total} medals`;
    list.appendChild(li);
  });
}

fetchMedals();
setInterval(fetchMedals, 60000);

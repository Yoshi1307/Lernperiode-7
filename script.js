const API_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY1NzcwMmYyLWQ5YmUtNDFmNS1iNGNkLTM5YjUyYzJjZTQwZSIsImlhdCI6MTc2MjUwODQwNywic3ViIjoiZGV2ZWxvcGVyL2Y1ZjU0M2U4LTZhMjQtNzc5Mi05ZmIyLWMyM2ZhNjkzODZiZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0NS43OS4yMTguNzkiLCI4NC43NC45MC4zOCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.nYBRqkSupsahIdk-macnZ0oVqxDdeLunFEEUj3OVKugz5qD2vUxDYTMlztqxthCVjemlcIUwHD7MCXfXZDaA-w";

const apiHeaders = {
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
};

const cleanTag = (tag) => tag.replace(/^#|^%23/, "");


function getRealCardLevel(card) {
  const base = card.level;
  const max = card.maxLevel;

  return (
    base +
    (max === 14
      ? 2
      : max === 11
      ? 5
      : max === 8
      ? 8
      : max === 6
      ? 10
      : 0)
  );
}

const getCardImage = (c) =>
  c.evolutionLevel > 0 && c.evolutionIconUrls
    ? c.evolutionIconUrls.medium
    : c.iconUrls.medium;

const renderCards = (cards, cls) =>
  cards
    .map(
      (c) => `
        <div class="${cls}">
            <img src="${getCardImage(c)}">
            <small>Lvl ${getRealCardLevel(c)}</small>
        </div>
    `
    )
    .join("");

// ====================================================
// 1. KARTEN-SEITE
// ====================================================

const cardsContainer = document.getElementById("cards");

if (cardsContainer) {
  const API_URL = "https://proxy.royaleapi.dev/v1/cards";
  let cardsData = [];

  async function loadCards() {
    try {
      const res = await fetch(API_URL, apiHeaders);
      const data = await res.json();
      cardsData = data.items;
      displayCards(cardsData);
    } catch {
      cardsContainer.innerHTML = "<p>Fehler beim Laden der Karten 😢</p>";
    }
  }

  function displayCards(cards) {
    cardsContainer.innerHTML = cards
      .map(
        (card) => `
        <div class="card">
            <img src="${card.iconUrls.medium}" alt="${card.name}">
            <h3>${card.name}</h3>
            <p>Seltenheit: ${card.rarity}</p>
            <p>Elixier: ${card.elixirCost ?? "?"}</p>
        </div>
    `
      )
      .join("");
  }

  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    let sorted = [...cardsData];
    const v = e.target.value;

    const rarityOrder = ["Common", "Rare", "Epic", "Legendary", "Champion"];

    const sorts = {
      elixirAsc: (a, b) => (a.elixirCost ?? 0) - (b.elixirCost ?? 0),
      elixirDesc: (a, b) => (b.elixirCost ?? 0) - (a.elixirCost ?? 0),
      rarity: (a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity),
    };

    if (sorts[v]) sorted.sort(sorts[v]);
    displayCards(sorted);
  });

  loadCards();
}

// ====================================================
// 2. SPIELERPROFIL + BATTLELOG
// ====================================================

const playerOutput = document.getElementById("playerOutput");
const battleOutput = document.getElementById("battlelogOutput");
const playerInput = document.getElementById("playerTag");

if (playerOutput && battleOutput && playerInput) {
  function initPlayerTag() {
    if (!playerInput.value.trim()) {
      const params = new URLSearchParams(location.search);
      let tag =
        params.get("tag") || localStorage.getItem("lastPlayerTag") || "";
      if (tag) playerInput.value = "#" + cleanTag(tag);
    }
  }

  // Hauptfunktion
  function loadPlayerAndBattlelog() {
    let raw = cleanTag(playerInput.value.trim());

    if (!raw) {
      playerOutput.innerHTML = `
          <div style="text-align:center;padding:20px;">Bitte Spieler-Tag eingeben.</div>
      `;
      battleOutput.innerHTML = "";
      return;
    }

    const displayTag = "#" + raw;
    const apiTag = "%23" + raw;

    playerInput.value = displayTag;
    localStorage.setItem("lastPlayerTag", displayTag);

    history.pushState({}, "", `${location.pathname}?tag=${displayTag}`);

    // Auto-Redirect auf Profile.html
    const file = location.pathname.split("/").pop().toLowerCase();
    if (!file.startsWith("profile")) {
      location.href = `Profile.html?tag=${displayTag}`;
      return;
    }

    // URLs
    const playerURL = `https://proxy.royaleapi.dev/v1/players/${apiTag}`;
    const battleURL = `https://proxy.royaleapi.dev/v1/players/${apiTag}/battlelog`;

    // ---------- Profil ----------
    fetch(playerURL, apiHeaders)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        playerOutput.innerHTML = `
            <div class="profile-box">
                <h2>${data.name} <span style="color:#888">(${data.tag})</span></h2>
                
                <div class="profile-stats">
                    <p><strong>Trophäen:</strong> ${data.trophies}</p>
                    <p><strong>Höchste Trophäen:</strong> ${data.bestTrophies}</p>
                    <p><strong>Level:</strong> ${data.expLevel}</p>
                    <p><strong>Clan:</strong> ${data.clan?.name || "Kein Clan"}</p>
                </div>

                <h3>Deck</h3>
                <div class="player-deck">${renderCards(data.currentDeck, "deck-card")}</div>
            </div>
        `;
      })
      .catch(() => (playerOutput.innerHTML = "Fehler beim Laden des Profils"));

    // ---------- Battlelog ----------
    fetch(battleURL, apiHeaders)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((battles) => {
        if (!Array.isArray(battles) || !battles.length) {
          battleOutput.innerHTML = `
              <div style="text-align:center;color:red;">Kein Kampflog gefunden!</div>
          `;
          return;
        }

        battleOutput.innerHTML = battles
          .slice(0, 15)
          .map((b) => {
            const my = b.team[0];
            const opp = b.opponent[0];

            const result =
              my.crowns > opp.crowns
                ? { text: "Sieg", color: "green" }
                : my.crowns < opp.crowns
                ? { text: "Niederlage", color: "red" }
                : { text: "Unentschieden", color: "#555" };

            return `
                <div class="battle-entry">
                    <h3 class="battle-header">${b.gameMode?.name || "Modus unbekannt"}</h3>

                    <p class="battle-result" style="color:${result.color}">
                        ${result.text} (${my.crowns} : ${opp.crowns})
                    </p>

                    <div class="battle-decks">

                        <div class="deck-column">
                            <p class="deck-player-name">
                                <a href="Profile.html?tag=${encodeURIComponent(
                                  "#" + my.tag.replace("#", "")
                                )}">
                                    <strong>${my.name}</strong> (${my.tag})
                                </a>
                            </p>
                            <div class="deck-row">${renderCards(
                              my.cards,
                              "battle-card"
                            )}</div>
                        </div>

                        <div class="deck-column">
                            <p class="deck-player-name">
                                <a href="Profile.html?tag=${encodeURIComponent(
                                  "#" + opp.tag.replace("#", "")
                                )}">
                                    <strong>${opp.name}</strong> (${opp.tag})
                                </a>
                            </p>
                            <div class="deck-row">${renderCards(
                              opp.cards,
                              "battle-card"
                            )}</div>
                        </div>

                    </div>
                </div>
            `;
          })
          .join(`<div class="battle-spacer"></div>`);
      })
      .catch(
        () => (battleOutput.innerHTML = "Fehler beim Laden des Kampflogs")
      );
  }

  initPlayerTag();
  loadPlayerAndBattlelog();

  playerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadPlayerAndBattlelog();
  });
}

// ====================================================
// 3. LEADERBOARD
// ====================================================

async function loadLeaderboard() {
  const container = document.getElementById("leaderboard");
  const seasonSelect = document.getElementById("seasonSelect");

  if (!container) return;

  const seasonId = seasonSelect?.value || "2025-10";

  try {
    const res = await fetch(
      `https://proxy.royaleapi.dev/v1/locations/global/pathoflegend/${seasonId}/rankings/players?limit=100`,
      apiHeaders
    );

    if (!res.ok) throw new Error();

    const data = await res.json();

    container.innerHTML = `
        <h2>Path of Legend – Top Spieler (Season ${seasonId})</h2>

        <table class="leaderboard-table">
            <tr>
                <th>Rang</th>
                <th>Name</th>
                <th>ELO</th>
                <th>Clan</th>
                <th>Profil</th>
            </tr>

            ${data.items
              .map(
                (p) => `
                <tr>
                    <td>${p.rank}</td>
                    <td>${p.name}</td>
                    <td>${p.eloRating}</td>
                    <td>${p.clan?.name || "-"}</td>
                    <td><a href="Profile.html?tag=${cleanTag(
                      p.tag
                    )}">Öffnen</a></td>
                </tr>
                `
              )
              .join("")}
        </table>
    `;
  } catch {
    container.innerHTML = "Fehler beim Laden der Daten.";
  }
}

// Dropdown → Reload Leaderboard
document.getElementById("seasonSelect")?.addEventListener("change", loadLeaderboard);

if (location.pathname.endsWith("leaderboard.html")) {
  document.addEventListener("DOMContentLoaded", loadLeaderboard);
}

// ====================================================
// 4. DEIN ACCOUNT
// ====================================================
document.addEventListener("DOMContentLoaded", () => {
    const savedTag = localStorage.getItem("myPlayerTag");

    if (!savedTag) {
        document.getElementById("idPrompt").style.display = "block";
    } else {
        document.getElementById("accountInfo").style.display = "block";
        loadAccount(savedTag);
    }
});


document.getElementById("saveTagBtn").addEventListener("click", () => {
    const input = document.getElementById("inputTag").value.trim();

    if (input.length < 3) {
        alert("Bitte gültige Spieler-ID eingeben!");
        return;
    }

    const tag = input.replace("#", "");
    localStorage.setItem("myPlayerTag", tag);

    document.getElementById("idPrompt").style.display = "none";
    document.getElementById("accountInfo").style.display = "block";

    loadAccount(tag);
});


document.getElementById("changeTagBtn").addEventListener("click", () => {
    localStorage.removeItem("myPlayerTag");

    document.getElementById("accountInfo").style.display = "none";
    document.getElementById("idPrompt").style.display = "block";
});



async function loadAccount(tag) {
    const output = document.getElementById("profileData");
    output.innerHTML = "Lade…";

    try {
        const res = await fetch(
            `https://proxy.royaleapi.dev/v1/players/%23${tag}`,
            apiHeaders
        );

        if (!res.ok) throw new Error("API Fehler");

        const data = await res.json();


        let html = `
            <h2>${data.name} <small>(${data.tag})</small></h2>
            <p><strong>Level:</strong> ${data.expLevel}</p>
            <p><strong>Trophäen:</strong> ${data.trophies}</p>
            <p><strong>Beste Trophäen:</strong> ${data.bestTrophies}</p>
            <p><strong>Siege:</strong> ${data.wins}</p>
            <p><strong>Niederlagen:</strong> ${data.losses}</p>
            <p><strong>3-Kronen Siege:</strong> ${data.threeCrownWins}</p>
            <p><strong>Spiele insgesamt:</strong> ${data.battleCount}</p>
            
            <h3>Clan</h3>
        `;

        if (data.clan) {
            html += `
                <p><strong>Clan:</strong> ${data.clan.name} (${data.clan.tag})</p>
            `;
        } else {
            html += `<p>Kein Clan</p>`;
        }

        html += `
            <h3>League Statistik</h3>
            <p><strong>Aktuelle Season:</strong> ${data.leagueStatistics?.currentSeason?.trophies ?? "-"}</p>
            <p><strong>Letzte Season:</strong> ${data.leagueStatistics?.previousSeason?.id ?? "-"} — ${data.leagueStatistics?.previousSeason?.trophies ?? "-"}</p>
            <p><strong>Beste Season:</strong> ${data.leagueStatistics?.bestSeason?.id ?? "-"} — ${data.leagueStatistics?.bestSeason?.trophies ?? "-"}</p>
        `;

        if (data.cards?.length > 0) {
            html += `<h3>Karten</h3><div style="display:flex;flex-wrap:wrap;gap:15px;">`;

            data.cards.forEach(card => {
                const icon = (card.evolutionLevel && card.evolutionLevel > 0)
                    ? card.iconUrls.evolutionMedium
                    : card.iconUrls.medium;

                html += `
                    <div style="width:110px;text-align:center;">
                        <img src="${icon}" width="80">
                        <div>${card.name}</div>
                        <div>Lvl ${getRealCardLevel(card)}</div>

                    </div>
                `;
            });

            html += `</div>`;
        }

        output.innerHTML = html;

    } catch (err) {
        output.innerHTML = `<p style="color:red;">Fehler beim Laden.</p>`;
        console.error(err);
    }
}

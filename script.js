const API_TOKEN = "Mein Token";

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

    const sorts = {
      elixirAsc: (a, b) => (a.elixirCost ?? 0) - (b.elixirCost ?? 0),
      elixirDesc: (a, b) => (b.elixirCost ?? 0) - (a.elixirCost ?? 0),
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

    const file = location.pathname.split("/").pop().toLowerCase();
    if (!file.startsWith("profile")) {
      location.href = `Profile.html?tag=${displayTag}`;
      return;
    }

    const playerURL = `https://proxy.royaleapi.dev/v1/players/${apiTag}`;
    const battleURL = `https://proxy.royaleapi.dev/v1/players/${apiTag}/battlelog`;

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
                <p><strong>Clan:</strong> 
                    ${data.clan 
                        ? `<a href="clan.html?tag=${encodeURIComponent(data.clan.tag)}" class="clan-link">${data.clan.name}</a>` 
                        : "Kein Clan"
                    }
                </p>
            </div>

            <h3>Deck</h3>
            <div class="player-deck">${renderCards(data.currentDeck, "deck-card")}</div>
        </div>
    `;
})
      .catch(() => (playerOutput.innerHTML = "Fehler beim Laden des Profils"));

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
        <h2>Ranked Rangliste (Season ${seasonId})</h2>

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

document.getElementById("seasonSelect")?.addEventListener("change", loadLeaderboard);

if (location.pathname.endsWith("leaderboard.html")) {
  document.addEventListener("DOMContentLoaded", loadLeaderboard);
}
// ====================================================
// 4. DEIN ACCOUNT
// ====================================================
let accountCards = []; 

document.addEventListener("DOMContentLoaded", () => {
    const savedTag = localStorage.getItem("myPlayerTag");
    if (savedTag) {
        const accInfo = document.getElementById("accountInfo");
        if (accInfo) accInfo.style.display = "block";
        loadAccount(savedTag);
    } else {
        const idPrompt = document.getElementById("idPrompt");
        if (idPrompt) idPrompt.style.display = "block";
    }
});

document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    if (accountCards.length === 0) return;

    let sorted = [...accountCards];
    const v = e.target.value;

    const sorts = {
        level: (a, b) => getRealCardLevel(b) - getRealCardLevel(a),
        elixir: (a, b) => (a.elixirCost ?? 0) - (b.elixirCost ?? 0),
    };

    if (sorts[v]) sorted.sort(sorts[v]);
    displayAccountCards(sorted); 
});

document.getElementById("saveTagBtn")?.addEventListener("click", () => {
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

document.getElementById("changeTagBtn")?.addEventListener("click", () => {
    localStorage.removeItem("myPlayerTag");
    document.getElementById("accountInfo").style.display = "none";
    document.getElementById("idPrompt").style.display = "block";
});async function loadAccount(tag) {
    const output = document.getElementById("profileData");
    if (!output) return;
    output.innerHTML = "Lade…";

    try {
        const res = await fetch(
            `https://proxy.royaleapi.dev/v1/players/%23${tag}`,
            apiHeaders
        );
        if (!res.ok) throw new Error("API Fehler");
        const data = await res.json();
        
        let rawCards = data.cards || [];
        accountCards = rawCards.sort((a, b) => getRealCardLevel(b) - getRealCardLevel(a));

        let html = `
            <h2>${data.name} <small>(${data.tag})</small></h2>
            <p><strong>Level:</strong> ${data.expLevel}</p>
            <p><strong>Trophäen:</strong> ${data.trophies}</p>
            <p><strong>Beste Trophäen:</strong> ${data.bestTrophies}</p>
            <p><strong>Siege:</strong> ${data.wins}</p>
            <p><strong>Niederlagen:</strong> ${data.losses}</p>
            <p><strong>3-Kronen Siege:</strong> ${data.threeCrownWins}</p>
            <p><strong>Spiele insgesamt:</strong> ${data.battleCount}</p>
            <br>
            <h3>Clan</h3>
            <p>
                ${data.clan 
                    ? `<a href="clan.html?tag=${encodeURIComponent(data.clan.tag)}" class="clan-link">
                          ${data.clan.name} (${data.clan.tag})
                       </a>` 
                    : "Kein Clan"
                }
            </p>
            <br>

            <h3>League Statistik</h3>
            <p><strong>Aktuelle Season:</strong> ${data.leagueStatistics?.currentSeason?.trophies ?? "-"}</p>
            <p><strong>Letzte Season:</strong> ${data.leagueStatistics?.previousSeason?.id ?? "-"} — ${data.leagueStatistics?.previousSeason?.trophies ?? "-"}</p>
            <p><strong>Beste Season:</strong> ${data.leagueStatistics?.bestSeason?.id ?? "-"} — ${data.leagueStatistics?.bestSeason?.trophies ?? "-"}</p>
            
            <br> <h3>Aktuelles Deck</h3>
            <div class="player-deck">
                ${renderCards(data.currentDeck, "deck-card")}
            </div>

            <br>
        `;

        if (data.badges && data.badges.length > 0) {
            const sortedBadges = [...data.badges].sort((a, b) => (b.level ?? 0) - (a.level ?? 0));

            html += `<h3>Abzeichen</h3><div class="badge-container">`;
            sortedBadges.forEach(badge => {
                html += `
                    <div class="badge-wrapper">
                        <img src="${badge.iconUrls.large}" title="${badge.name}">
                        <div class="badge-level">Lvl ${badge.level ?? 1}</div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `<div id="cardsContainer"></div>`;
        output.innerHTML = html;

        if (accountCards.length > 0) {
            displayAccountCards(accountCards);
        }

    } catch (err) {
        output.innerHTML = `<p style="color:red;">Fehler beim Laden.</p>`;
        console.error(err);
    }
}

function displayAccountCards(cards) {
    const container = document.getElementById("cardsContainer");
    if (!container) return;

    const sortBar = document.getElementById("cardSortBar");
    
    let html = `
        <div class="account-cards-header">
            <h3>Karten (${cards.length})</h3>
            <div id="sortPlacement"></div>
        </div>
        <div class="account-cards-grid">`;

    cards.forEach(card => {
        html += `
            <div class="account-card-item">
                <img src="${getCardImage(card)}">
                <div>${card.name}</div>
                <div>Lvl ${getRealCardLevel(card)}</div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;

    const placement = document.getElementById("sortPlacement");
    if (placement && sortBar) {
        placement.appendChild(sortBar);
        sortBar.style.display = "block";
        sortBar.style.margin = "0";
    }
}

// ====================================================
// 5. Clan
// ====================================================

let clanDebounceTimer;

document.getElementById("clanSearchInput")?.addEventListener("input", (e) => {
    clearTimeout(clanDebounceTimer);
    const query = e.target.value.trim();
    
    if (query.length < 3) {
        document.getElementById("clanSuggestions").innerHTML = "";
        return;
    }

    clanDebounceTimer = setTimeout(() => {
        searchClans(query);
    }, 400); 
});

async function searchClans(query) {
    if (query.startsWith("#")) {
        const cleanTag = query.replace("#", "%23");
        loadClanDetails(cleanTag);
        return;
    }

    try {
        const res = await fetch(`https://proxy.royaleapi.dev/v1/clans?name=${encodeURIComponent(query)}&limit=6`, apiHeaders);
        const data = await res.json();
        displayClanSuggestions(data.items);
    } catch (err) {
        console.error("Clan Suche Fehler:", err);
    }
}

function displayClanSuggestions(clans) {
    const container = document.getElementById("clanSuggestions");
    if (!clans || clans.length === 0) {
        container.innerHTML = '<div class="suggestion-item">Keine Clans gefunden</div>';
        return;
    }

    container.innerHTML = clans.map(clan => `
        <div class="suggestion-item" onclick="loadClanDetails('${clan.tag.replace("#", "%23")}')">
            <img src="https://cdn.royaleapi.com/static/img/badge/${clan.badgeId}.png">
            <div>
                <strong>${clan.name}</strong> <span class="clan-tag-small">${clan.tag}</span><br>
                <small>${clan.members}/50 Mitgl. •  ${clan.clanScore} •  ${clan.clanWarTrophies}</small>
            </div>
        </div>
    `).join("");
}

async function loadClanDetails(apiTag) {
    document.getElementById("clanSuggestions").innerHTML = "";
    document.getElementById("clanSearchInput").value = "";

    try {
        const res = await fetch(`https://proxy.royaleapi.dev/v1/clans/${apiTag}`, apiHeaders);
        const clan = await res.json();

        document.getElementById("clanHeader").innerHTML = `
            <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
                <img src="https://cdn.royaleapi.com/static/img/badge/${clan.badgeId}.png" width="100">
                <div style="flex:1; min-width:200px;">
                    <h2 style="margin:0;">${clan.name}</h2>
                    <p style="color:#666; margin:5px 0;">${clan.tag}</p>
                    <p>${clan.description || "<i>Keine Clanbeschreibung vorhanden.</i>"}</p>
                    <p><strong>Clankrieg-Trophäen:</strong>  ${clan.clanWarTrophies}</p>
                </div>
            </div>
        `;

        const sortedMembers = clan.memberList.sort((a, b) => b.trophies - a.trophies);


        document.getElementById("memberList").innerHTML = sortedMembers.map((member, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><a href="Profile.html?tag=${encodeURIComponent(member.tag)}" style="color:#047857; font-weight:bold; text-decoration:none;">${member.name}</a></td>
                <td> ${member.trophies}</td>
            </tr>
        `).join("");


        document.getElementById("clanDetailView").style.display = "block";
        window.scrollTo({ top: 200, behavior: 'smooth' });

    } catch (err) {
        console.error("Clandetails Fehler:", err);
        alert("Clan konnte nicht geladen werden.");
    }
}
// ========================================
// 1. KARTEN-SEITE
// ========================================

const cardsContainer = document.getElementById("cards");

if (cardsContainer) {

  const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY1NzcwMmYyLWQ5YmUtNDFmNS1iNGNkLTM5YjUyYzJjZTQwZSIsImlhdCI6MTc2MjUwODQwNywic3ViIjoiZGV2ZWxvcGVyL2Y1ZjU0M2U4LTZhMjQtNzc5Mi05ZmIyLWMyM2ZhNjkzODZiZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0NS43OS4yMTguNzkiLCI4NC43NC45MC4zOCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.nYBRqkSupsahIdk-macnZ0oVqxDdeLunFEEUj3OVKugz5qD2vUxDYTMlztqxthCVjemlcIUwHD7MCXfXZDaA-w"; 
  const API_URL = "https://proxy.royaleapi.dev/v1/cards";

  let cardsData = [];

  async function loadCards() {
    try {
      const response = await fetch(API_URL, {
        headers: { "Authorization": `Bearer ${API_TOKEN}` }
      });

      const data = await response.json();
      cardsData = data.items;
      displayCards(cardsData);

    } catch (err) {
      cardsContainer.innerHTML = `<p>Fehler beim Laden der Karten 😢</p>`;
    }
  }

  function displayCards(cards) {
    cardsContainer.innerHTML = cards.map(card => `
      <div class="card">
        <img src="${card.iconUrls.medium}" alt="${card.name}">
        <h3>${card.name}</h3>
        <p>Seltenheit: ${card.rarity}</p>
        <p>Elixier: ${card.elixirCost ?? "?"}</p>
      </div>
    `).join("");
  }

  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    let sorted = [...cardsData];
    const value = e.target.value;

    if (value === "elixirAsc") {
      sorted.sort((a, b) => (a.elixirCost ?? 0) - (b.elixirCost ?? 0));
    } else if (value === "elixirDesc") {
      sorted.sort((a, b) => (b.elixirCost ?? 0) - (a.elixirCost ?? 0));
    } else if (value === "rarity") {
      const rarityOrder = ["Common", "Rare", "Epic", "Legendary", "Champion"];
      sorted.sort((a, b) =>
        rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
      );
    }

    displayCards(sorted);
  });

  loadCards();
}
// ========================================
// 2. SPIELERPROFIL + BATTLELOG 
// ========================================

const playerOutput = document.getElementById("playerOutput");
const battleOutput = document.getElementById("battlelogOutput");
const playerInput = document.getElementById("playerTag");
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY1NzcwMmYyLWQ5YmUtNDFmNS1iNGNkLTM5YjUyYzJjZTQwZSIsImlhdCI6MTc2MjUwODQwNywic3ViIjoiZGV2ZWxvcGVyL2Y1ZjU0M2U4LTZhMjQtNzc5Mi05ZmIyLWMyM2ZhNjkzODZiZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0NS43OS4yMTguNzkiLCI4NC43NC45MC4zOCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.nYBRqkSupsahIdk-macnZ0oVqxDdeLunFEEUj3OVKugz5qD2vUxDYTMlztqxthCVjemlcIUwHD7MCXfXZDaA-w";

if (playerOutput && battleOutput && playerInput) {

  // Kartenlevel-Umrechnung
  function getRealCardLevel(card) {
    const base = card.level;
    switch (card.maxLevel) {
      case 16: return base;
      case 14: return base + 2;
      case 11: return base + 5;
      case 8:  return base + 8;
      case 6:  return base + 10;
    }
    return base;
  }

  // Kartenbild wählen
  const getCardImage = c =>
    (c.evolutionLevel > 0 && c.evolutionIconUrls ? c.evolutionIconUrls.medium : c.iconUrls.medium);

  // Kartenrendering für Decks
  const renderCards = (cards, className) => cards.map(c => `
    <div class="${className}">
      <img src="${getCardImage(c)}">
      <small>Lvl ${getRealCardLevel(c)}</small>
    </div>
  `).join("");


  // Tag initialisieren
  function initPlayerTag() {
    if (playerInput.value.trim() === "") {
      const params = new URLSearchParams(window.location.search);
      let tag = params.get('tag') || localStorage.getItem('lastPlayerTag') || "";
      if (tag) {
        tag = tag.replace(/^#|^%23/, '');
        playerInput.value = '#' + tag;
      }
    }
  }


  // HAUPTFUNKTION
  function loadPlayerAndBattlelog() {

    // --- TAG EINLESEN ---
    let raw = playerInput.value.trim().replace(/^#|^%23/, '');

    if (!raw) {
      playerOutput.innerHTML = `<div style="text-align:center;padding:20px;">Bitte Spieler-Tag eingeben.</div>`;
      battleOutput.innerHTML = "";
      return;
    }

    const displayTag = "#" + raw;
    const apiTag = "%23" + raw;

    playerInput.value = displayTag;
    localStorage.setItem("lastPlayerTag", displayTag);

    // URL aktualisieren
    const newUrl = `${location.protocol}//${location.host}${location.pathname}?tag=${encodeURIComponent(displayTag)}`;
    history.pushState({ path: newUrl }, '', newUrl);

    // Weiterleitung, falls falsche Seite
    const path = location.pathname.split('/').pop().toLowerCase();
    if (path !== 'profile.html' && path !== 'profile.htm') {
      location.href = `Profile.html?tag=${encodeURIComponent(displayTag)}`;
      return;
    }

    // URLs
    const playerURL = `https://proxy.royaleapi.dev/v1/players/${apiTag}`;
    const battleURL = `https://proxy.royaleapi.dev/v1/players/${apiTag}/battlelog`;

    // ===========================================
    //  ---- PROFIL LADEN (Fetch 1) ----
    // ===========================================
    fetch(playerURL, { headers: { Authorization: `Bearer ${API_TOKEN}` } })
      .then(r => r.ok ? r.json() : Promise.reject("Spieler nicht gefunden"))
      .then(data => {

        playerOutput.innerHTML = `
          <div class="profile-box">
            <h2>${data.name} <span style="color:#888">(${data.tag})</span></h2>

            <div class="profile-stats">
              <p><strong>Trophäen:</strong> ${data.trophies}</p>
              <p><strong>Höchste Trophäen:</strong> ${data.bestTrophies}</p>
              <p><strong>Level:</strong> ${data.expLevel}</p>
              <p><strong>Clan:</strong> ${data.clan ? data.clan.name : "Kein Clan"}</p>
            </div>

            <h3>Deck</h3>
            <div class="player-deck">
              ${renderCards(data.currentDeck, "deck-card")}
            </div>
          </div>
        `;
      })
      .catch(() => playerOutput.innerHTML = "Fehler beim Laden des Profils");


    // ===========================================
    //  ---- BATTLELOG LADEN (Fetch 2) ----
    // ===========================================
    fetch(battleURL, { headers: { Authorization: `Bearer ${API_TOKEN}` } })
      .then(r => r.ok ? r.json() : Promise.reject("Battlelog nicht gefunden"))
      .then(battles => {

        if (!Array.isArray(battles) || battles.length === 0) {
          battleOutput.innerHTML = `<div style="text-align:center;color:red;">Kein Kampflog gefunden!</div>`;
          return;
        }

        battleOutput.innerHTML = battles.slice(0, 15).map(b => {

          const my = b.team[0];
          const opp = b.opponent[0];

          let resultText = "Unentschieden";
          let resultColor = "#555";

          if (my.crowns > opp.crowns) { resultText = "Sieg"; resultColor = "green"; }
          if (my.crowns < opp.crowns) { resultText = "Niederlage"; resultColor = "red"; }

          return `
            <div class="battle-entry">

              <h3 class="battle-header">${b.gameMode?.name || "Modus unbekannt"}</h3>
              <p class="battle-result" style="color:${resultColor}">
                ${resultText} (${my.crowns} : ${opp.crowns})
              </p>

              <div class="battle-decks">

                <div class="deck-column">
                  <p class="deck-player-name">
                    <a href="Profile.html?tag=${encodeURIComponent('#' + my.tag.replace(/^#/, ''))}"><strong>${my.name}</strong> (${my.tag})</a>
                  </p>
                  <div class="deck-row">
                    ${renderCards(my.cards, "battle-card")}
                  </div>
                </div>

                <div class="deck-column">
                  <p class="deck-player-name">
                    <a href="Profile.html?tag=${encodeURIComponent('#' + opp.tag.replace(/^#/, ''))}"><strong>${opp.name}</strong> (${opp.tag})</a>
                  </p>
                  <div class="deck-row">
                    ${renderCards(opp.cards, "battle-card")}
                  </div>
                </div>

              </div>
            </div>
          `;

        }).join("<div class='battle-spacer'></div>");

      })
      .catch(() => battleOutput.innerHTML = "Fehler beim Laden des Kampflogs");
  }


  // Initial laden
  initPlayerTag();
  loadPlayerAndBattlelog();


  // ENTER-Key Listener
  playerInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      loadPlayerAndBattlelog();
    }
  });

}


// ========================================
// 3. LEADERBOARD-SEITE
// ========================================
async function loadLeaderboard() {
    const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY1NzcwMmYyLWQ5YmUtNDFmNS1iNGNkLTM5YjUyYzJjZTQwZSIsImlhdCI6MTc2MjUwODQwNywic3ViIjoiZGV2ZWxvcGVyL2Y1ZjU0M2U4LTZhMjQtNzc5Mi05ZmIyLWMyM2ZhNjkzODZiZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0NS43OS4yMTguNzkiLCI4NC43NC45MC4zOCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.nYBRqkSupsahIdk-macnZ0oVqxDdeLunFEEUj3OVKugz5qD2vUxDYTMlztqxthCVjemlcIUwHD7MCXfXZDaA-w"; // <-- hier API Token einfügen
    const container = document.getElementById("leaderboard");

    try {

        const res = await fetch(
            `https://proxy.royaleapi.dev/v1/locations/global/pathoflegend/2025-10/rankings/players?limit=100`,
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`
                }
            }
        );

        if (!res.ok) {
            throw new Error("HTTP Fehler: " + res.status);
        }

        const data = await res.json();
        console.log("Leaderboard Data:", data);

        if (!data.items || data.items.length === 0) {
            container.innerHTML = "Keine Daten gefunden.";
            return;
        }

        container.innerHTML = `
            <h2>Path of Legend – Top Spieler (Season ${seasonId})</h2>
            <table class="leaderboard-table">
                <tr>
                    <th>Rang</th>
                    <th>Name</th>
                    <th>ELO</th>
                    <th>Level</th>
                    <th>Clan</th>
                    <th>Profil</th>
                </tr>
                ${data.items.map(p => `
                    <tr>
                        <td>${p.rank}</td>
                        <td>${p.name}</td>
                        <td>${p.eloRating}</td>
                        <td>${p.expLevel}</td>
                        <td>${p.clan ? p.clan.name : "-"}</td>
                        <td>
                            <a href="Profile.html?tag=${encodeURIComponent(p.tag.replace('#', ''))}">
                                Öffnen
                            </a>
                        </td>
                    </tr>
                `).join("")}
            </table>
        `;

    } catch (err) {
        console.error("Leaderboard konnte nicht geladen werden:", err);
        container.innerHTML = "Fehler beim Laden der Daten.";
    }
}

if (window.location.pathname.endsWith("leaderboard.html")) {
    document.addEventListener("DOMContentLoaded", loadLeaderboard);
}

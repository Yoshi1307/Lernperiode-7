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

if (playerOutput && battleOutput) {

  const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY1NzcwMmYyLWQ5YmUtNDFmNS1iNGNkLTM5YjUyYzJjZTQwZSIsImlhdCI6MTc2MjUwODQwNywic3ViIjoiZGV2ZWxvcGVyL2Y1ZjU0M2U4LTZhMjQtNzc5Mi05ZmIyLWMyM2ZhNjkzODZiZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0NS43OS4yMTguNzkiLCI4NC43NC45MC4zOCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.nYBRqkSupsahIdk-macnZ0oVqxDdeLunFEEUj3OVKugz5qD2vUxDYTMlztqxthCVjemlcIUwHD7MCXfXZDaA-w";

  // IMMER dieser Spieler
  const PLAYER_TAG = "%23J22G8YGC9";

  const playerURL = `https://proxy.royaleapi.dev/v1/players/${PLAYER_TAG}`;
  const battleURL = `https://proxy.royaleapi.dev/v1/players/${PLAYER_TAG}/battlelog`;

  // ---- Level richtig berechnen ----
  function getRealCardLevel(card) {
    const base = card.level;
    switch (card.maxLevel) {
      case 14: return base;          // Common
      case 12: return base + 2;      // Rare → startet bei 3
      case 9:  return base + 5;      // Epic → startet bei 6
      case 6:  return base + 8;      // Legendary → startet bei 9
      case 4:  return base + 10;     // Champion → startet bei 11
    }
    return base;
  }

  // ---- Evolution Bild wählen ----
  function getCardImage(card) {
    if (card.evolutionLevel > 0 && card.evolutionIconUrls)
      return card.evolutionIconUrls.medium;

    return card.iconUrls.medium;
  }

  // ---- PROFIL LADEN ----
  fetch(playerURL, {
    headers: { Authorization: `Bearer ${API_TOKEN}` }
  })
    .then(r => r.json())
    .then(data => {

      playerOutput.innerHTML = `
        <h2>${data.name} <span style="color:#888">(${data.tag})</span></h2>

        <div class="profile-stats">
          <p><strong>Trophäen:</strong> ${data.trophies}</p>
          <p><strong>Höchste Trophäen:</strong> ${data.bestTrophies}</p>
          <p><strong>Level:</strong> ${data.expLevel}</p>
          <p><strong>Clan:</strong> ${data.clan ? data.clan.name : "Kein Clan"}</p>
        </div>

        <h3>Deck</h3>
        <div class="player-deck">
          ${data.currentDeck.map(c => `
            <div class="deck-card">
              <img src="${getCardImage(c)}">
              <small>Lvl ${getRealCardLevel(c)}</small>
            </div>
          `).join("")}
        </div>
      `;
    })
    .catch(() => playerOutput.innerHTML = "Fehler beim Laden des Profils");



  // ---- BATTLELOG LADEN ----
  fetch(battleURL, {
    headers: { Authorization: `Bearer ${API_TOKEN}` }
  })
    .then(r => r.json())
    .then(battles => {

      battleOutput.innerHTML = battles.slice(0, 8).map(b => {
        const my = b.team[0];
        const opp = b.opponent[0];

        return `
          <div class="battle-entry">

            <h3>${b.gameMode.name}</h3>
            <p><strong>Gegner:</strong> ${opp.name} (${opp.tag})</p>

            <div class="battle-decks">

              <div class="deck-column">
                <h4>Dein Deck</h4>
                <div class="deck-row">
                  ${my.cards.map(c => `
                    <div class="battle-card">
                      <img src="${getCardImage(c)}">
                      <small>Lvl ${getRealCardLevel(c)}</small>
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="deck-column">
                <h4>Gegner Deck</h4>
                <div class="deck-row">
                  ${opp.cards.map(c => `
                    <div class="battle-card">
                      <img src="${getCardImage(c)}">
                      <small>Lvl ${getRealCardLevel(c)}</small>
                    </div>
                  `).join("")}
                </div>
              </div>

            </div>
          </div>
        `;
      }).join("");

    })
    .catch(() => battleOutput.innerHTML = "Fehler beim Laden des Kampflogs");
}
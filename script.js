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

if (playerOutput && battleOutput) {

  const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY1NzcwMmYyLWQ5YmUtNDFmNS1iNGNkLTM5YjUyYzJjZTQwZSIsImlhdCI6MTc2MjUwODQwNywic3ViIjoiZGV2ZWxvcGVyL2Y1ZjU0M2U4LTZhMjQtNzc5Mi05ZmIyLWMyM2ZhNjkzODZiZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0NS43OS4yMTguNzkiLCI4NC43NC45MC4zOCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.nYBRqkSupsahIdk-macnZ0oVqxDdeLunFEEUj3OVKugz5qD2vUxDYTMlztqxthCVjemlcIUwHD7MCXfXZDaA-w";

  // Hilfsfunktion: Tag korrekt encoden
  function getPlayerTag() {
    // 1) Quelle: Eingabefeld, dann URL-Parameter 'tag', dann localStorage
    let raw = "";
    if (playerInput && playerInput.value && playerInput.value.trim()) {
      raw = playerInput.value.trim();
    } else {
      const params = new URLSearchParams(window.location.search);
      raw = params.get('tag') || localStorage.getItem('lastPlayerTag') || "";
    }

    // Falls aus URL kommt, decode
    try {
      raw = decodeURIComponent(raw);
    } catch (e) {
      // ignore
    }

    if (!raw) return "";

    // Normalisiere: wir erwarten später ein URL-encoded Tag wie %23XXXX
    if (!raw.startsWith('#') && !raw.startsWith('%23')) raw = '#'+raw.replace('%23','').replace('#','');
    // speichere lesbare Form im localStorage für andere Seiten
    try { localStorage.setItem('lastPlayerTag', raw); } catch (e) {}

    // gebe URL-encoded Form zurück (%23 statt #)
    if (raw.startsWith('#')) return '%23' + raw.slice(1);
    return raw;
  }

  // Wenn ein Tag per URL übergeben wurde oder im localStorage ist, fülle das Eingabefeld
  (function initPlayerInputFromUrlOrStorage(){
    if (!playerInput) return;
    const params = new URLSearchParams(window.location.search);
    let tag = params.get('tag') || localStorage.getItem('lastPlayerTag') || "";
    if (tag) {
      try { tag = decodeURIComponent(tag); } catch(e) {}
      // Falls als %23xxx kommt, ersetze durch '#'
      if (tag.startsWith('%23')) tag = '#' + tag.slice(3);
      playerInput.value = tag;
    }

    // Eingabe: Enter → Suche auslösen; auf anderen Seiten zu Profile navigieren
    playerInput.addEventListener('keydown', function(e){
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const raw = playerInput.value.trim();
      if (!raw) return;
      // sichere lesbare Form
      const readable = raw.startsWith('#') ? raw : ('#'+raw.replace('%23','').replace('#',''));
      try { localStorage.setItem('lastPlayerTag', readable); } catch(e) {}

      // Wenn wir bereits auf der Profilseite sind, lade neu, sonst navigiere dorthin mit param
      const path = window.location.pathname.split('/').pop().toLowerCase();
      if (path === 'profile.html' || path === 'profile.htm') {
        loadPlayerAndBattlelog();
      } else {
        const encoded = encodeURIComponent(readable);
        window.location.href = `Profile.html?tag=${encoded}`;
      }
    });
  })();

  // Hilfsfunktion: echte Kartenlevel berechnen
  function getRealCardLevel(card) {
    const base = card.level;
    switch (card.maxLevel) {
      case 14: return base;
      case 12: return base + 2;
      case 9:  return base + 5;
      case 6:  return base + 8;
      case 4:  return base + 10;
    }
    return base;
  }

  // Hilfsfunktion: Bild-URL für Karten
  function getCardImage(card) {
    if (card.evolutionLevel > 0 && card.evolutionIconUrls)
      return card.evolutionIconUrls.medium;
    return card.iconUrls.medium;
  }

  // Hauptfunktion: Spielerprofil + Battlelog laden
  function loadPlayerAndBattlelog() {
    const PLAYER_TAG = getPlayerTag();
    const playerURL = `https://proxy.royaleapi.dev/v1/players/${PLAYER_TAG}`;
    const battleURL = `https://proxy.royaleapi.dev/v1/players/${PLAYER_TAG}/battlelog`;

    // ---- PROFIL LADEN ----
    fetch(playerURL, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    })
      .then(r => {
        if (!r.ok) throw new Error('Spieler nicht gefunden oder API-Fehler!');
        return r.json();
      })
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
              ${data.currentDeck.map(c => `
                <div class="deck-card">
                  <img src="${getCardImage(c)}">
                  <small>Lvl ${getRealCardLevel(c)}</small>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      })
      .catch(err => playerOutput.innerHTML = `<div style='color:red;text-align:center;'>${err.message}</div>`);

    // ---- BATTLELOG LADEN ----
    fetch(battleURL, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    })
      .then(r => {
        if (!r.ok) throw new Error('Kampflog nicht gefunden oder API-Fehler!');
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          battleOutput.innerHTML = `<div style='color:red;text-align:center;'>Kein Kampflog gefunden!</div>`;
          return;
        }

        battleOutput.innerHTML = data.slice(0, 15).map(entry => {
          const my = entry.team[0];
          const opp = entry.opponent[0];

          // Ergebnis berechnen
          const teamCrowns = my.crowns;
          const oppCrowns = opp.crowns;
          let resultText = "";
          let resultColor = "";

          if (teamCrowns > oppCrowns) {
            resultText = "Sieg";
            resultColor = "#22c55e";
          } else if (teamCrowns < oppCrowns) {
            resultText = "Niederlage";
            resultColor = "#ef4444";
          } else {
            resultText = "Unentschieden";
            resultColor = "#888";
          }

          // Spielmodus
          const mode = entry.gameMode?.name || "Modus unbekannt";

          // HTML für einen Kampf
          return `
            <div class="battle-entry">

              <!-- Spielmodus oben -->
              <h3 class="battle-header">${mode}</h3>

              <!-- Ergebnis darunter -->
              <div class="battle-result" style="color:${resultColor};">
                ${teamCrowns} : ${oppCrowns} – ${resultText}
              </div>

              <!-- Decks -->
              <div class="battle-decks">
                <div class="deck-column">
                  <p class="deck-player-name"><strong>${my.name}</strong> (${my.tag})</p>
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
                  <p class="deck-player-name"><strong>${opp.name}</strong> (${opp.tag})</p>
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

              <!-- Abstand zwischen Kämpfen -->
              <div class="battle-spacer"></div>
            </div>
          `;
        }).join("");
      })
      .catch(err => battleOutput.innerHTML = `<div style='color:red;text-align:center;'>${err.message}</div>`);
  }

  // Initiales Laden
  loadPlayerAndBattlelog();

  // Eingabe-Events
  playerInput.addEventListener("change", loadPlayerAndBattlelog);
  playerInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") loadPlayerAndBattlelog();
  });
}
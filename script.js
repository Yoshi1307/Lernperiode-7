const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY1NzcwMmYyLWQ5YmUtNDFmNS1iNGNkLTM5YjUyYzJjZTQwZSIsImlhdCI6MTc2MjUwODQwNywic3ViIjoiZGV2ZWxvcGVyL2Y1ZjU0M2U4LTZhMjQtNzc5Mi05ZmIyLWMyM2ZhNjkzODZiZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0NS43OS4yMTguNzkiLCI4NC43NC45MC4zOCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.nYBRqkSupsahIdk-macnZ0oVqxDdeLunFEEUj3OVKugz5qD2vUxDYTMlztqxthCVjemlcIUwHD7MCXfXZDaA-w"; // <-- hier dein Token einfügen
const API_URL = "https://proxy.royaleapi.dev/v1/cards";

let cardsData = []; // hier speichern wir alle Karten

async function loadCards() {
  try {
    const response = await fetch(API_URL, {
      headers: { "Authorization": `Bearer ${API_TOKEN}` }
    });

    if (!response.ok) throw new Error(`Fehler: ${response.status}`);

    const data = await response.json();
    cardsData = data.items;
    displayCards(cardsData);

  } catch (err) {
    console.error(err);
    document.getElementById("cards").innerHTML = `<p>Fehler beim Laden der Karten 😢</p>`;
  }
}

function displayCards(cards) {
  const container = document.getElementById("cards");
  container.innerHTML = cards.map(card => `
    <div class="card">
      <img src="${card.iconUrls.medium}" alt="${card.name}">
      <h3>${card.name}</h3>
      <p>Seltenheit: ${card.rarity}</p>
      <p>Elixier: ${card.elixirCost ?? "?"}</p>
    </div>
  `).join("");
}

document.getElementById("sortSelect").addEventListener("change", (e) => {
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
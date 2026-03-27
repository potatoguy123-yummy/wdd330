const games = [
    { title: "Placeholder", platform: "PC", img: "https://placehold.co/200x250" },
    { title: "Placeholder", platform: "PSP", img: "https://placehold.co/200x250" },
    { title: "Placeholder", platform: "N64", img: "https://placehold.co/200x250" },
    { title: "Placeholder", platform: "Switch", img: "https://placehold.co/200x250" },
];

const gameGrid = document.getElementById('gameGrid');
const searchInput = document.getElementById('gameSearch');
const platformFilter = document.getElementById('platformFilter');

function displayGames(filteredGames) {
    gameGrid.innerHTML = filteredGames.map(game => `
        <div class="game-card">
            <img src="${game.img}" alt="${game.title}">
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>Platform: ${game.platform}</p>
            </div>
        </div>
    `).join('');
}

function filterGames() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedPlatform = platformFilter.value;

    const filtered = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm);
        const matchesPlatform = selectedPlatform === 'all' || game.platform === selectedPlatform;
        return matchesSearch && matchesPlatform;
    });

    displayGames(filtered);
}

// Event Listeners
searchInput.addEventListener('input', filterGames);
platformFilter.addEventListener('change', filterGames);

// Initial Load
displayGames(games);

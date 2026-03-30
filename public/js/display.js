import { query } from "./igdb.mjs";

const gameGrid = document.getElementById('gameGrid');
const searchInput = document.getElementById('gameSearch');
const platformFilter = document.getElementById('platformFilter');
const NO_IMAGE_URL = "https://placehold.co/200x250?text=No+Cover+Available";

function renderState(state, data = []) {
    gameGrid.innerHTML = '';

    if (state === 'loading') {
        gameGrid.innerHTML = '<div class="loader"></div>';
    } else if (state === 'empty') {
        gameGrid.innerHTML = '<div class="status-message">No games found. Try a different search or platform!</div>';
    } else {
        displayGames(data);
    }
}

function formatGames(gameData) {
    return gameData.map(g => ({
        title: g.name,
        platform: g.platforms?.map(p => p.name).join(', ') || "N/A",
        img: g.cover?.url 
            ? `https:${g.cover.url.replace('t_thumb', 't_cover_big')}` 
            : NO_IMAGE_URL
    }));
}

function displayGames(gamesList) {
    gameGrid.innerHTML = gamesList.map(game => `
        <div class="game-card">
            <img src="${game.img}" alt="${game.title}" onerror="this.src='${NO_IMAGE_URL}'">
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>Platform: ${game.platform}</p>
            </div>
        </div>
    `).join('');
}

async function updateGameList() {
    const searchTerm = searchInput.value.trim();
    const platformId = platformFilter.value;
    
    renderState('loading');

    let apicalypseQuery = `fields name, platforms.name, cover.url; limit 24;`;
    let whereClause = `where cover != null & platforms != null`;

    if (platformId !== 'all') {
        whereClause += ` & platforms = (${platformId})`;
    }

    if (searchTerm) {
        apicalypseQuery = `search "${searchTerm}"; ${apicalypseQuery} ${whereClause};`;
    } else {
        apicalypseQuery += `${whereClause}; sort hypes desc;`;
    }

    try {
        const data = await query('games', apicalypseQuery);
        
        if (!data || data.length === 0) {
            renderState('empty');
        } else {
            renderState('results', formatGames(data));
        }
    } catch (err) {
        console.error("API Error:", err);
        gameGrid.innerHTML = '<div class="status-message">Error connecting to IGDB. Please try again later.</div>';
    }
}

function debounce(func, delay = 400) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function populatePlatformFilter(platforms) {
    let html = '<option value="all">All Platforms</option>';
    platforms.sort((a, b) => a.name.localeCompare(b.name)).forEach(p => {
        html += `<option value="${p.id}">${p.name}</option>`;
    });
    platformFilter.innerHTML = html;
}

async function initPage() {
    try {
        const platformData = await query('platforms', 'fields name; limit 100; where generation >= 8;');
        populatePlatformFilter(platformData);
        updateGameList();
    } catch (err) {
        console.error("Init Error:", err);
    }
}

searchInput.addEventListener('input', debounce(updateGameList));
platformFilter.addEventListener('change', updateGameList);

initPage();


import { query } from "./igdb.mjs";

function getGameIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('gameId');
}

function formatGameDetails(gameData) {
    const game = gameData[0] || {};

    const imageUrl = game.cover?.url
        ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
        : "https://placehold.co/400x600?text=No+Cover+Available";

    const releaseDate = game.first_release_date
        ? new Date(game.first_release_date * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "Unknown";

    const genres = game.genres?.map(g => g.name).join(', ') || "N/A";
    const platforms = game.platforms?.map(p => p.name).join(', ') || "N/A";
    const developers = game.involved_companies?.map(c => c.company.name).join(', ') || "N/A";
    const rating = game.rating ? `${game.rating.toFixed(1)}/100` : "N/A";
    const summary = game.summary || "No summary available.";
    const name = game.name || "Unknown Game";
    const aggregatedRating = game.aggregated_rating ? `${game.aggregated_rating.toFixed(1)}/100` : "N/A";
    const ratingCount = game.rating_count ? game.rating_count : "N/A";
    const storyline = game.storyline || "No storyline available.";
    const totalRating = game.total_rating ? `${game.total_rating.toFixed(1)}/100` : "N/A";
    const totalRatingCount = game.total_rating_count ? game.total_rating_count : "N/A";
    const screenshots = game.screenshots?.slice(0, 3).map(s =>
        `<img src="https:${s.url.replace('t_thumb', 't_screenshot_big')}" alt="Screenshot" onerror="this.src='https://placehold.co/200x120?text=No+Screenshot'" draggable="false">`
    ).join('') || "";

    const gameId = game.id || null;

    return `
        <div class="game-detail-header">
            <img src="${imageUrl}" alt="${name}" onerror="this.src='https://placehold.co/400x600?text=No+Cover+Available'">
            <div class="game-detail-info">
                <h1>${name}</h1>
                <p><strong>Release Date:</strong> ${releaseDate}</p>
                <p><strong>Genres:</strong> ${genres}</p>
                <p><strong>Platforms:</strong> ${platforms}</p>
                <p><strong>Developers:</strong> ${developers}</p>
                <p><strong>Rating:</strong> ${rating}</p>
                <p><strong>Aggregated Rating:</strong> ${aggregatedRating}</p>
                <p><strong>Rating Count:</strong> ${ratingCount}</p>
                <p><strong>Total Rating:</strong> ${totalRating}</p>
                <p><strong>Total Rating Count:</strong> ${totalRatingCount}</p>
                <button id="wishlistButton" class="wishlist-button" data-game-id="${gameId}">
                    Add to Wishlist
                </button>
            </div>
        </div>
        <div class="game-detail-description">
            <h2>Description</h2>
            <p>${summary}</p>
        </div>
        <div class="game-detail-storyline">
            <h2>Storyline</h2>
            <p>${storyline}</p>
        </div>
        <div class="game-detail-screenshots">
            <h2>Screenshots</h2>
            <div class="screenshot-grid">
                ${screenshots}
            </div>
        </div>
    `;
}

function renderGameDetails(gameData) {
    const gameDetail = document.getElementById('gameDetail');

    if (!gameData || gameData.length === 0) {
        gameDetail.innerHTML = '<div class="status-message">Game not found.</div>';
        return;
    }

    gameDetail.innerHTML = formatGameDetails(gameData);
}

import { getWishlist, saveWishlist, isInWishlist, addToWishlist, removeFromWishlist } from './wishlist-utils.js';

async function loadGameDetails() {
    const gameId = getGameIdFromUrl();

    if (!gameId) {
        document.getElementById('gameDetail').innerHTML = '<div class="status-message">Game not found.</div>';
        return;
    }

    try {
        const apiQuery = `
            fields
                name,
                first_release_date,
                genres.name,
                platforms.name,
                involved_companies.company.name,
                rating,
                summary,
                cover.url,
                aggregated_rating,
                rating_count,
                storyline,
                total_rating,
                total_rating_count,
                screenshots.url,
                id;
            where id = ${gameId};
        `;

        const data = await query('games', apiQuery);
        //console.log("games", data);

        if (!data || !data.length) {
            document.getElementById('gameDetail').innerHTML = '<div class="status-message">Game not found.</div>';
            return;
        }

        renderGameDetails(data);

        updateWishlistButton(gameId);
        setupWishlistButtonEvent(gameId);
    } catch (err) {
        console.error("API Error:", err.message);
        document.getElementById('gameDetail').innerHTML = '<div class="status-message">Server error or Game not found.</div>';
    }
}

function setupWishlistButtonEvent(gameId) {
    const button = document.getElementById('wishlistButton');
    if (button) {
        button.addEventListener('click', () => {
            handleWishlistToggle(gameId);
        });
    }
}

function handleWishlistToggle(gameId) {
    const button = document.getElementById('wishlistButton');
    if (isInWishlist(gameId)) {
        removeFromWishlist(gameId);
        button.textContent = 'Add to Wishlist';
        button.classList.remove('in-wishlist');
    } else {
        addToWishlist(gameId);
        button.textContent = 'Remove from Wishlist';
        button.classList.add('in-wishlist');
    }
}

function updateWishlistButton(gameId) {
    const button = document.getElementById('wishlistButton');
    if (button) {
        if (isInWishlist(gameId)) {
            button.textContent = 'Remove from Wishlist';
            button.classList.add('in-wishlist');
        } else {
            button.textContent = 'Add to Wishlist';
            button.classList.remove('in-wishlist');
        }
    }
}

loadGameDetails();
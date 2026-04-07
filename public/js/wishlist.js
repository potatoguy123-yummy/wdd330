import { getWishlist, saveWishlist, isInWishlist, addToWishlist, removeFromWishlist } from './wishlist-utils.js';
import { query } from './igdb.mjs';

async function displayWishlist() {
    const wishlistContainer = document.getElementById('wishlistContent');
    const wishlist = getWishlist();

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty. Add some games to your wishlist!</p>';
        return;
    }

    try {
        wishlistContainer.innerHTML = '<div class="loader"></div>';

        const games = await fetchGameDetails(wishlist);

        if (games.length === 0) {
            wishlistContainer.innerHTML = '<p>No games found in your wishlist.</p>';
            return;
        }

        let wishlistHTML = '<div class="game-grid">';
        games.forEach(game => {
            wishlistHTML += `
                <div class="game-card" data-game-id="${game.id}">
                    <img src="${game.img}" alt="${game.title}" onerror="this.src='https://placehold.co/400x600?text=No+Cover+Available'" loading="lazy">
                    <div class="game-info">
                        <a href="/product.html?gameId=${game.id}" class="game-title-link">
                            <h3>${game.title}</h3>
                        </a>
                        <p>Platform: ${game.platform}</p>
                        <button class="wishlist-button in-wishlist" data-game-id="${game.id}">
                            Remove from Wishlist
                        </button>
                    </div>
                </div>
            `;
        });
        wishlistHTML += '</div>';

        wishlistContainer.innerHTML = wishlistHTML;

        document.querySelectorAll('.wishlist-button').forEach(button => {
            button.addEventListener('click', function() {
                const gameId = this.getAttribute('data-game-id');
                removeFromWishlist(gameId);
                this.closest('.game-card').remove();

                const updatedWishlist = getWishlist();
                if (updatedWishlist.length === 0) {
                    wishlistContainer.innerHTML = '<p>Your wishlist is empty. Add some games to your wishlist!</p>';
                }
            });
        });

    } catch (error) {
        console.error('Error loading wishlist:', error);
        wishlistContainer.innerHTML = '<p>Error loading wishlist. Please try again later.</p>';
    }
}

async function fetchGameDetails(gameIds) {
    try {
        const idsString = gameIds.join(', ');
        const queryText = `
            fields name, platforms.name, cover.url, id;
            where id = (${idsString});
            sort hypes desc;
        `;

        const data = await query('games', queryText);

        if (!data) {
            return [];
        }

        return data.map(game => ({
            id: game.id,
            title: game.name,
            platform: game.platforms?.map(p => p.name).join(', ') || "N/A",
            img: game.cover?.url
                ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
                : "https://placehold.co/400x600?text=No+Cover+Available"
        }));
    } catch (error) {
        console.error('Error fetching game details:', error);
        return [];
    }
}
displayWishlist();

import { query } from './igdb.mjs';

export function getWishlist() {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

export function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

export function isInWishlist(gameId) {
    const wishlist = getWishlist();
    return wishlist.includes(gameId);
}

export function addToWishlist(gameId) {
    const wishlist = getWishlist();
    if (!wishlist.includes(gameId)) {
        wishlist.push(gameId);
        saveWishlist(wishlist);
        return true;
    }
    return false;
}

export function removeFromWishlist(gameId) {
    const wishlist = getWishlist();
    const index = wishlist.indexOf(gameId);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlist(wishlist);
        return true;
    }
    return false;
}

export async function getGameDetails(gameId) {
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
                id;
            where id = ${gameId};
        `;

        const games = await query('games', apiQuery);
        return games && games.length > 0 ? games[0] : null;
    } catch (error) {
        console.error(`Error fetching game details for ID ${gameId}:`, error);
        return null;
    }
}
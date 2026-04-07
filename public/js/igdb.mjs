const API_URL = '/api/igdb';

export async function query(endpoint, query) {
    const response = await fetch(`${API_URL}/v4/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query
    });
    if (!response.ok) {
        throw new Error({ message: await response.text() });
    }
    return response.json();
}

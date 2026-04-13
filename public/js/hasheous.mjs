const API_URL = '/api/hasheous';

export async function lookupSHA1(sha1sum) {
    //console.log("lookup", sha1sum);
    const response = await fetch(`${API_URL}/api/v1/Lookup/ByHash/sha1/${sha1sum}`);
    if (!response.ok) {
        throw new Error({ message: await response.text() });
    }
    return response.json();
}

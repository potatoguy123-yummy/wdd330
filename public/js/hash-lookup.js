import { lookupSHA1 } from "./hasheous.mjs";

const hashForm = document.getElementById('hashForm');
const fileInput = document.getElementById('fileInput');
const hashButton = document.getElementById('hashButton');
const resultContainer = document.getElementById('resultContainer');
const hashResult = document.getElementById('hashResult');
const loader = document.getElementById('loader');

hashForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
        hashResult.innerHTML = `<p>Error: Please select a file</p>`;
        return;
    }

    loader.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    hashForm.classList.add("hidden");

    try {
        const hash = await calculateSHA1(file);

        const apiResult = await lookupSHA1(hash);

        displayResult(hash, apiResult);
    } catch (error) {
        console.error('Error:', error);
        hashResult.innerHTML = `<p>Error: ${error.message}</p>`;
    } finally {
        loader.classList.add('hidden');
        resultContainer.classList.remove('hidden');
    }
});

function calculateSHA1(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async function(e) {
            try {
                const arrayBuffer = e.target.result;
                const uint8Array = new Uint8Array(arrayBuffer);

                const hash = await sha1(uint8Array);
                resolve(hash);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = function() {
            reject(new Error('Failed to read file'));
        };

        reader.readAsArrayBuffer(file.slice(0, file.size));
    });
}

async function sha1(data) {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
        try {
            const hashBuffer = await crypto.subtle.digest('SHA-1', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.error("Could not generate hash: ", error);
            hashResult.innerHTML = `<p>Error: SHA-1 hashing is not supported in this browser.</p>
                                    <p>Please try using a modern browser that supports the Web Crypto API.</p>`;
            return null;
        }
    } else {
        hashResult.innerHTML = `<p>Error: SHA-1 hashing is not supported in this browser.</p>
                                <p>Please try using a modern browser that supports the Web Crypto API.</p>`;
        return null;
    }
}

function displayResult(hash, apiResult) {
    console.log(hash, apiResult);

    if (!apiResult.id || apiResult.error) {
        hashResult.innerHTML = `
            <p><strong>Calculated Hash:</strong> ${hash}</p>
            <p><strong>Could not match hash to any games</strong></p>
        `;
        return;
    }

    let resultHTML = `
        <p><strong>Calculated Hash:</strong> ${hash}</p>
        <p><strong>Game Name:</strong> ${apiResult.name}</p>
    `;

    if (apiResult.platform && apiResult.platform.name) {
        resultHTML += `<p><strong>Platform:</strong> ${apiResult.platform.name}</p>`;
    }

    if (apiResult.publisher && apiResult.publisher.name) {
        resultHTML += `<p><strong>Publisher:</strong> ${apiResult.publisher.name}</p>`;
    }

    if (apiResult.signature && apiResult.signature.game && apiResult.signature.game.description) {
        resultHTML += `<p><strong>Game Description:</strong> ${apiResult.signature.game.description}</p>`;
    }

    if (apiResult.signature && apiResult.signature.game && apiResult.signature.game.year) {
        resultHTML += `<p><strong>Release Year:</strong> ${apiResult.signature.game.year}</p>`;
    }

    if (apiResult.metadata && apiResult.metadata.length > 0) {
        const igdb = apiResult.metadata.filter(val => val.source === "IGDB");
        if (igdb.length > 0) {
            const thisSiteLink = "/product.html?gameId=" + igdb[0].id;
            resultHTML += `<p><a href="${thisSiteLink}">View More Details</a></p>`;
        }
        resultHTML += `<h3>External Links</h3>`;
        apiResult.metadata.forEach(meta => {
            if (meta.link && meta.source) {
                resultHTML += `<p><a href="${meta.link}" target="_blank">${meta.source}</a></p>`;
            }
        });
    }

    hashResult.innerHTML = resultHTML;
}

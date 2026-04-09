import { lookupMd5 } from "./hasheous.mjs";

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
        const hash = await calculateMD5(file);

        const apiResult = await lookupMd5(hash);

        displayResult(hash, apiResult);
    } catch (error) {
        console.error('Error:', error);
        hashResult.innerHTML = `<p>Error: ${error.message}</p>`;
    } finally {
        loader.classList.add('hidden');
        resultContainer.classList.remove('hidden');
    }
});

function calculateMD5(file) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("THIS IS PRE-FILLED DATA FOR TESTING USE. NOT CURRENTLY IMPLEMENTED");
        }, 2000); // wait for testing the loader
    });
}

function displayResult(hash, apiResult) {
    if (!apiResult.found) {
        hashResult.innerHTML = `
            <p><strong>Calculated Hash:</strong> ${hash}</p>
            <p><strong>Could not match hash to any games</strong></p>
        `;
        return;
    }
    hashResult.innerHTML = `
        <p><strong>Calculated Hash:</strong> ${hash}</p>
        <p><strong>Game Name:</strong> ${apiResult.name}</p>
        <p><strong>Game Description:</strong> ${apiResult.description}</p>
    `;
}

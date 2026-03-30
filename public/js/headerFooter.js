async function loadTemplate(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load template: ${path} (${response.status})`);
    }
    return await response.text();
}

async function loadHeaderFooter() {
    try {
        const headerTemplate = await loadTemplate("/partials/header.html");
        const footerTemplate = await loadTemplate("/partials/footer.html");

        const headerElement = document.querySelector("header");
        const footerElement = document.querySelector("footer");

        if (headerElement) {
            renderWithTemplate(headerTemplate, headerElement);
        }

        if (footerElement) {
            renderWithTemplate(footerTemplate, footerElement);
        }
    } catch (error) {
        console.error("Header/footer load failed:", error);
    }
}

function renderWithTemplate(template, parentElement, data, callback) {
    const fragment = document.createRange().createContextualFragment(template);
    parentElement.replaceChildren(fragment);

    if (callback) {
        callback(data);
    }
}

await loadHeaderFooter();

const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const darkMode = newTheme === 'dark';

    sunIcon.classList.toggle('hidden', darkMode);
    moonIcon.classList.toggle('hidden', !darkMode);
});

loadTheme();

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

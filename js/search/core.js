import { normalizeText, escapeRegExp } from "./utils.js";
import { getTranslation } from "./config.js";

export const searchItems = (query, lang, idx) => {
    const normQuery = normalizeText(query);
    if (!normQuery) return [];

    const terms = normQuery.split(/\s+/).filter(Boolean);

    return idx
        .filter((i) => i.lang === lang)
        .map((item) => {
            const haystack = normalizeText(`${item.title} ${item.id}`);
            const matchesAll = terms.every((t) => haystack.includes(t));
            if (!matchesAll) return null;

            const firstPos = terms.reduce((min, t) => {
                const pos = haystack.indexOf(t);
                return pos === -1 ? min : Math.min(min, pos);
            }, Infinity);

            return { item, score: firstPos };
        })
        .filter(Boolean)
        .sort((a, b) => a.score - b.score)
        .slice(0, 50)
        .map((x) => x.item);
};

export const highlightText = (text, terms) => {
    if (!terms.length) return text;

    const pattern = terms
        .map((t) => escapeRegExp(t))
        .join("|");

    if (!pattern) return text;

    const regex = new RegExp(`(${pattern})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
};

export const renderResults = (results, terms, lang) => {
    const box = document.getElementById("search-results");
    if (!box) return;

    if (!results.length) {
        const msg = getTranslation("no_results_found", lang);
        box.innerHTML = `
      <div class="list-group-item disabled text-muted">
        ${msg}
      </div>
    `;
        box.classList.remove("d-none");
        return;
    }

    box.innerHTML = results
        .map((r, i) => {
            const highlightedTitle = highlightText(r.title, terms);
            const highlightedId = highlightText(r.id, terms);

            return `
        <a href="${r.url}" class="list-group-item list-group-item-action" data-index="${i}">
          <strong>${highlightedTitle}</strong>
          <div class="small text-muted">${highlightedId}</div>
        </a>
      `;
        })
        .join("");

    box.classList.remove("d-none");
};

export const clearResults = () => {
    const box = document.getElementById("search-results");
    if (!box) return;
    box.classList.add("d-none");
    box.innerHTML = "";
};

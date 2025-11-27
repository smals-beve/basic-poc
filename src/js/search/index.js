import {SEARCH_INDEX_URL} from "./config.js";
import {normalizeText} from "./utils.js";
import {searchItems, renderResults, clearResults} from "./core.js";

let indexCache = null;

const loadIndex = async () => {
    if (indexCache) return indexCache;
    const res = await fetch(SEARCH_INDEX_URL);
    indexCache = await res.json();
    return indexCache;
};

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-input");
    const box = document.getElementById("search-results");
    if (!input || !box) return;

    let resultsCache = [];
    let activeIndex = -1;
    let currentTerms = [];

    const updateActiveItem = () => {
        const items = box.querySelectorAll(".list-group-item");
        items.forEach((item, i) => {
            if (i === activeIndex) {
                item.classList.add("active");
                item.scrollIntoView({block: "nearest"});
            } else {
                item.classList.remove("active");
            }
        });
    };

    // Text input: search + render
    input.addEventListener("input", async () => {
        const q = input.value.trim();
        const lang = input.dataset.lang;
        activeIndex = -1;

        // trigger on 3rd character
        if (q.length < 3) {
            resultsCache = [];
            currentTerms = [];
            clearResults();
            return;
        }

        const idx = await loadIndex();
        resultsCache = searchItems(q, lang, idx);
        currentTerms = normalizeText(q).split(/\s+/).filter(Boolean);

        renderResults(resultsCache, currentTerms, lang);
        updateActiveItem();
    });

    // Keyboard navigation
    input.addEventListener("keydown", (e) => {
        if (!resultsCache.length) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                activeIndex = Math.min(activeIndex + 1, resultsCache.length - 1);
                updateActiveItem();
                break;

            case "ArrowUp":
                e.preventDefault();
                activeIndex = Math.max(activeIndex - 1, 0);
                updateActiveItem();
                break;

            case "Enter":
                if (activeIndex >= 0) {
                    e.preventDefault();
                    window.location.href = resultsCache[activeIndex].url;
                }
                break;

            case "Escape":
                e.preventDefault();
                resultsCache = [];
                currentTerms = [];
                activeIndex = -1;
                clearResults();
                input.blur();
                break;
        }
    });

    // Mouse click on a result
    box.addEventListener("click", (e) => {
        const item = e.target.closest(".list-group-item[data-index]");
        if (!item) return;

        const index = Number(item.dataset.index);
        if (!Number.isNaN(index) && resultsCache[index]) {
            window.location.href = resultsCache[index].url;
        }
    });

    // Close results when clicking outside input + results
    document.addEventListener("click", (e) => {
        const isClickInsideInput = input.contains(e.target);
        const isClickInsideResults = box.contains(e.target);

        if (!isClickInsideInput && !isClickInsideResults) {
            resultsCache = [];
            currentTerms = [];
            activeIndex = -1;
            clearResults();
        }
    });
});

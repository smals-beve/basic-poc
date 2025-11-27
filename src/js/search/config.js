export const SEARCH_INDEX_URL = "/searchIndex.json";

const translations = {
    nl: {
        no_results_found: "Geen resultaten gevonden.",
    },
    fr: {
        no_results_found: "Aucun résultat trouvé.",
    },
};

export const getTranslation = (key, lang) => {
    const table = translations[lang] || translations.nl;
    return table[key] || "";
};

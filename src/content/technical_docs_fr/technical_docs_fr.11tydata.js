const LANG = "fr";
const FOLDER = "technical_docs_fr";

export default {
    lang: LANG,
    eleventyComputed: {
        layout: (data) => {
            return (data.page.fileSlug || "").toLowerCase() === "0__overview"
                ? "landing.njk"
                : "doc.njk";
        },
        permalink: (data) => {
            const stem = data.page.filePathStem.replace(/\\/g, "/");
            const rel = stem.replace(new RegExp(`.*/${FOLDER}`), "");
            const isOverview = /^\/?0__overview$/i.test(rel);
            return isOverview ? `/${LANG}/` : `/${LANG}${rel}/`;
        },
        title: (data) => {
            const isOverview =
                (data.page.fileSlug || "").toLowerCase() === "0__overview";
            if (isOverview) return data.categoryLabels.overview[LANG];

            const stem = data.page.filePathStem.replace(/\\/g, "/");
            const rel = stem.replace(new RegExp(`.*/${FOLDER}`), "");
            for (const cat of data.docCategories || []) {
                if (rel.startsWith("/" + cat + "/")) {
                    return data.categoryLabels[cat][LANG];
                }
            }
            return data.title || data.page.fileSlug || "Documentation";
        },
        navLabel: (data) => data.navLabel || data.page.fileSlug,
    },
};

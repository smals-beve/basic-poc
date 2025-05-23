export default {
    lang: "nl",
    eleventyComputed: {
        layout: data => {
            return data.page.fileSlug.toLowerCase() === "readme"
                ? "landing.njk"
                : "doc.njk";
        },
        permalink: data => {
            let stem = data.page.filePathStem.replace(/\\/g, "/");
            let rel = stem.replace(/.*\/technical_docs_nl/, "");
            let isOverview = /^\/?readme$/i.test(rel);

            return isOverview
                ? "/nl/"
                : `/nl${rel}/`;
        }
    }
};

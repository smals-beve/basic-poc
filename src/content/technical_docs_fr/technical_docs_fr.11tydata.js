export default {
    lang: "fr",
    eleventyComputed: {
        layout: data => {
            return data.page.fileSlug.toLowerCase() === "0__overview"
                ? "landing.njk"
                : "doc.njk";
        },
        permalink: data => {
            let stem = data.page.filePathStem.replace(/\\/g, "/");
            let rel = stem.replace(/.*\/technical_docs_fr/, "");
            let isOverview = /^\/?0__overview$/i.test(rel);

            return isOverview
                ? "/fr/"
                : `/fr${rel}/`;
        }
    }
};

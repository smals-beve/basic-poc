export default {
    layout: "default",
    pagination: {
        data: "collections.apiSpecsByLang",
        size: 1,
        alias: "entry",
        addAllPagesToCollections: true,
    },
    eleventyComputed: {
        lang: (data) => data.entry.lang,
        spec: (data) => data.entry.spec,
        title: (data) =>
            data.entry?.spec?.data?.info?.title ||
            data.entry?.spec?.fileSlug ||
            "API",
        permalink: (data) => `/${data.entry.lang}/api/${data.entry.spec.fileSlug}/`,
    },
};

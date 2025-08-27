export default {
    layout: "default",
    pagination: {
        data: "site.supportedLangs",
        size: 1,
        alias: "lang",
        addAllPagesToCollections: true,
    },
    permalink: (data) => `/${data.lang}/api/`,
    eleventyComputed: {
        title: (data) => {
            const key = "api_specs";
            const i18n = data.i18n || {};
            const entry = i18n[key] || {};
            return (
                entry[data.lang] ??
                entry[data.site?.defaultLang] ??
                entry.en ??
                "API Specifications"
            );
        },
    },
};

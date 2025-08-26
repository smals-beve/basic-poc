export default {
    eleventyComputed: {
        title: (data) => {
            const translate = (key) => {
                const translations = data.i18n || {};
                const siteMeta = data.site || {};
                const language = data.lang || siteMeta.defaultLang || "en";
                const entry = translations[key] || {};
                return (
                    entry[language] ??
                    entry[siteMeta.defaultLang] ??
                    entry.en ??
                    key
                );
            };

            return translate("api_specs");
        },
    },
};

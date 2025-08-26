export default {
    layout: "default",
    pagination: {
        data: "collections.apiSpecs",
        size: 1,
        alias: "spec",
    },
    permalink: (data) => `/api/${data.spec.fileSlug}/`,
    eleventyComputed: {
        title: (data) => data.spec?.data?.info?.title || data.spec?.fileSlug,
    },
};

module.exports = function(eleventyConfig) {
    // … your passthroughCopy etc. …

    // Per-language Markdown collections
    eleventyConfig.addCollection("docs_en", coll =>
        coll.getFilteredByGlob("src/content/technical_docs_en/**/*.md")
    );
    eleventyConfig.addCollection("docs_fr", coll =>
        coll.getFilteredByGlob("src/content/technical_docs_fr/**/*.md")
    );
    eleventyConfig.addCollection("docs_nl", coll =>
        coll.getFilteredByGlob("src/content/technical_docs_nl/**/*.md")
    );

    // OpenAPI specs collection
    eleventyConfig.addCollection("apiSpecs", coll =>
        coll.getFilteredByGlob("src/content/technical_specs/*.yaml")
    );

    // Alias default → base.njk
    eleventyConfig.addLayoutAlias("default","base.njk");

    return {
        dir: {
            input:  "src",
            includes: "layouts",
            output: "_site"
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine:    "njk",
    };
};

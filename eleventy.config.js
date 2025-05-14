import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import yaml from "js-yaml";
import {InputPathToUrlTransformPlugin} from "@11ty/eleventy";

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (eleventyConfig) {
    // 1) Rewrite .md links → folder URLs
    eleventyConfig.addPlugin(InputPathToUrlTransformPlugin, {
        extensions: "html"
    });

    // 2) Passthrough copy for Swagger UI, assets, and specs
    eleventyConfig.addPassthroughCopy({
        "public/lib4ui": "lib4ui",
        "src/assets": "assets",
        "src/content/technical_specs": "content/technical_specs"
    });

    // 3) Language‐specific Markdown collections
    eleventyConfig.addCollection("docs_en", coll =>
        coll.getFilteredByGlob("src/content/technical_docs_en/**/*.md")
    );
    eleventyConfig.addCollection("docs_fr", coll =>
        coll.getFilteredByGlob("src/content/technical_docs_fr/**/*.md")
    );
    eleventyConfig.addCollection("docs_nl", coll =>
        coll.getFilteredByGlob("src/content/technical_docs_nl/**/*.md")
    );

    // 4) Build API specs collection from YAML files
    eleventyConfig.addCollection("apiSpecs", () => {
        const specsDir = path.join(__dirname, "src", "content", "technical_specs");
        return fs.readdirSync(specsDir)
            .filter(f => f.endsWith(".yaml") || f.endsWith(".yml"))
            .map(filename => {
                const filePath = path.join(specsDir, filename);
                const doc = yaml.load(fs.readFileSync(filePath, "utf8"));
                return {
                    fileSlug: path.parse(filename).name,
                    data: doc
                };
            });
    });

    // 5) Layout alias
    eleventyConfig.addLayoutAlias("default", "base.njk");

    // 6) Final Eleventy configuration
    return {
        dir: {
            input: "src",
            includes: "layouts",
            output: "_site"
        }
    };
}

import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import yaml from "js-yaml";
import {InputPathToUrlTransformPlugin, HtmlBasePlugin} from "@11ty/eleventy";

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (eleventyConfig) {
    // 1) Automatically inject <base> tag and rewrite all URLs by pathPrefix
    eleventyConfig.addPlugin(HtmlBasePlugin);

    // 2) Convert Markdown links (folder URLs) using Eleventy’s plugin
    eleventyConfig.addPlugin(InputPathToUrlTransformPlugin, {
        extensions: "html"
    });

    // 3) Copy static assets directly into output
    eleventyConfig.addPassthroughCopy({
        "public/lib4ui": "lib4ui",
        "src/assets": "assets",
        "src/content/technical_specs": "content/technical_specs"
    });

    // 4) Bootstrap passthrough
    eleventyConfig.addPassthroughCopy({
        "node_modules/bootstrap/dist/css/bootstrap.min.css": "assets/css/bootstrap.min.css",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js": "assets/js/bootstrap.bundle.min.js"
    });

    // 5) Create language‐specific doc collections from Markdown
    ["en", "fr", "nl"].forEach(lang => {
        eleventyConfig.addCollection(`docs_${lang}`, coll =>
            coll.getFilteredByGlob(`src/content/technical_docs_${lang}/**/*.md`)
        );
    });

    // 6) Build API specs collection by loading YAML files
    eleventyConfig.addCollection("apiSpecs", () => {
        const specsDir = path.join(__dirname, "src", "content", "technical_specs");
        return fs.readdirSync(specsDir)
            .filter(f => /\.(ya?ml)$/.test(f))
            .map(file => ({
                fileSlug: path.parse(file).name,
                data: yaml.load(fs.readFileSync(path.join(specsDir, file), "utf8"))
            }));
    });

    // 7) Alias default layout and prevent GitHub Pages from ignoring files
    eleventyConfig.addLayoutAlias("default", "base.njk");
    eleventyConfig.addPassthroughCopy({".nojekyll": ".nojekyll"});

    // 8) Core directory settings; pathPrefix is handled via CLI flag
    return {
        dir: {
            input: "src",
            includes: "layouts",
            output: "_site"
        }
    };
}

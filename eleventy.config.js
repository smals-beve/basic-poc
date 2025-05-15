import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import yaml from "js-yaml";
import {InputPathToUrlTransformPlugin} from "@11ty/eleventy";

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if we’re in production (GitHub Pages) or local dev
const isProd = process.env.ELEVENTY_ENV === "production";

export default function (eleventyConfig) {
    // 0) Serve the site under "/basic-poc/" in prod, "/" in dev
    eleventyConfig.addGlobalData("pathPrefix", isProd ? "/basic-poc/" : "/");

    // 1) Rewrite .md links → folder URLs via Eleventy's built-in plugin
    eleventyConfig.addPlugin(InputPathToUrlTransformPlugin, {
        extensions: "html"
    });

    // 2) Copy static assets through to the output
    eleventyConfig.addPassthroughCopy({
        "public/lib4ui": "lib4ui",
        "src/assets": "assets",
        "src/content/technical_specs": "content/technical_specs"
    });

    // 3) Language-specific Markdown collections
    ["en", "fr", "nl"].forEach(lang => {
        eleventyConfig.addCollection(`docs_${lang}`, collection =>
            collection.getFilteredByGlob(`src/content/technical_docs_${lang}/**/*.md`)
        );
    });

    // 4) Build API specs collection from YAML files
    eleventyConfig.addCollection("apiSpecs", () => {
        const specsDir = path.join(__dirname, "src", "content", "technical_specs");
        return fs
            .readdirSync(specsDir)
            .filter(f => /\.(ya?ml)$/.test(f))
            .map(filename => {
                const filePath = path.join(specsDir, filename);
                const doc = yaml.load(fs.readFileSync(filePath, "utf8"));
                return {
                    fileSlug: path.parse(filename).name,
                    data: doc
                };
            });
    });

    // 5) Layout alias for convenience
    eleventyConfig.addLayoutAlias("default", "base.njk");

    // 6) Optionally add a .nojekyll file so GH Pages doesn't ignore files/folders beginning with "_"
    eleventyConfig.addPassthroughCopy({".nojekyll": ".nojekyll"});

    // 7) BrowserSync tweaks in dev
    if (!isProd) {
        eleventyConfig.setBrowserSyncConfig({
            open: true,
            notify: false
        });
    }

    // 8) Final Eleventy configuration
    return {
        dir: {
            input: "src",
            includes: "layouts",
            output: "_site"
        },
        // Tell Eleventy what sub-path to prepend to all URLs
        pathPrefix: isProd ? "/basic-poc/" : "/"
    };
};

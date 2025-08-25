import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import yaml from "js-yaml";
import {InputPathToUrlTransformPlugin, HtmlBasePlugin} from "@11ty/eleventy";

// shim __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (eleventyConfig) {
    // 1) <base> tag & pathPrefix
    eleventyConfig.addPlugin(HtmlBasePlugin);

    // 2) Markdown link rewrites
    eleventyConfig.addPlugin(InputPathToUrlTransformPlugin, {extensions: "html"});

    // 3) Copy static assets
    eleventyConfig.addPassthroughCopy({
        "public/lib4ui": "lib4ui",
        "src/assets": "assets",
        "src/content/technical_specs": "content/technical_specs",
    });

    // 4) Bootstrap CSS/JS
    eleventyConfig.addPassthroughCopy({
        "node_modules/bootstrap/dist/css/bootstrap.min.css": "assets/css/bootstrap.min.css",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js": "assets/js/bootstrap.bundle.min.js",
    });

    // 5) Per-language MD collections
    ["en", "fr", "nl"].forEach((lang) => {
        eleventyConfig.addCollection(`docs_${lang}`, (coll) =>
            coll.getFilteredByGlob(`src/content/technical_docs_${lang}/**/*.html`)
        );
    });

    // 6) API specs from YAML
    eleventyConfig.addCollection("apiSpecs", () => {
        const specsDir = path.join(__dirname, "src/content/technical_specs");
        return fs
            .readdirSync(specsDir)
            .filter((f) => /\.(ya?ml)$/.test(f))
            .map((file) => ({
                fileSlug: path.parse(file).name,
                data: yaml.load(fs.readFileSync(path.join(specsDir, file), "utf8")),
            }));
    });

    // 7) Load manifest.json per language into global data
    ["en", "fr", "nl"].forEach((lang) => {
        const manifestPath = path.join(__dirname, `src/_data/manifest_${lang}.json`);
        if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
            eleventyConfig.addGlobalData(`manifest_${lang}`, manifest);
        }
    });

    // 8) Layout alias & nojekyll passthrough
    eleventyConfig.addLayoutAlias("default", "base.njk");
    eleventyConfig.addPassthroughCopy({".nojekyll": ".nojekyll"});

    // 9) Strip outer <!DOCTYPE>/<html>/<head>/<body> from content before injecting into base layout
    eleventyConfig.addFilter("stripOuterHtml", (input) => {
        if (!input) return input;
        let out = String(input);
        out = out.replace(/<!DOCTYPE[^>]*>/i, "");
        const bodyMatch = out.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            out = bodyMatch[1];
        } else {
            out = out
                .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
                .replace(/<\/?html[^>]*>/gi, "");
        }
        return out.trim();
    });

    return {
        pathPrefix: process.env.ELEVENTY_ENV === "production" ? "/basic-poc/" : "/",
        dir: {
            input: "src",
            includes: "layouts",
            output: "_site",
        },
    };
}

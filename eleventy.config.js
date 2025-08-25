import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

// shim __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (eleventyConfig) {
    // 1) Copy static assets
    eleventyConfig.addPassthroughCopy({
        "public/lib4ui": "lib4ui",
        "src/assets": "assets",
        "src/content/technical_specs": "content/technical_specs",
    });

    // 2) Bootstrap CSS/JS
    eleventyConfig.addPassthroughCopy({
        "node_modules/bootstrap/dist/css/bootstrap.min.css": "assets/css/bootstrap.min.css",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js": "assets/js/bootstrap.bundle.min.js",
    });

    // 3) Per-language HTML collections (your incoming templates)
    ["en", "fr", "nl"].forEach((lang) => {
        eleventyConfig.addCollection(`docs_${lang}`, (coll) =>
            coll.getFilteredByGlob(`src/content/technical_docs_${lang}/**/*.html`)
        );
    });

    // 4) API specs from YAML
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

    // 5) Load manifest.json per language into global data
    ["en", "fr", "nl"].forEach((lang) => {
        const manifestPath = path.join(__dirname, `src/_data/manifest_${lang}.json`);
        if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
            eleventyConfig.addGlobalData(`manifest_${lang}`, manifest);
        }
    });

    // 6) Layout alias & nojekyll passthrough
    eleventyConfig.addLayoutAlias("default", "base.njk");
    eleventyConfig.addPassthroughCopy({ ".nojekyll": ".nojekyll" });

    // 7) Strip outer <!DOCTYPE>/<html>/<head>/<body> from raw templates
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

    // Grab Eleventy's url filter for consistent pathPrefix handling
    const urlFilter = eleventyConfig.getFilter("url");

    // 8) Normalize asset URLs from upstream HTML using urlFilter
    eleventyConfig.addFilter("rewriteAssetUrls", (html) => {
        if (!html) return html;
        let out = String(html);

        // src/assets/...  -> /assets/...
        out = out.replace(
            /\b(href|src)=["'](?:\.{1,2}\/)?src\/assets\/([^"']+)["']/gi,
            (_m, attr, rest) => `${attr}="${urlFilter('/assets/' + rest)}"`
        );

        // assets/...      -> /assets/...
        out = out.replace(
            /\b(href|src)=["'](?:\.{1,2}\/)?assets\/([^"']+)["']/gi,
            (_m, attr, rest) => `${attr}="${urlFilter('/assets/' + rest)}"`
        );

        // /assets/...     -> (prefix via urlFilter)
        out = out.replace(
            /\b(href|src)=["']\/assets\/([^"']+)["']/gi,
            (_m, attr, rest) => `${attr}="${urlFilter('/assets/' + rest)}"`
        );

        // public/lib4ui/... -> /lib4ui/...
        out = out.replace(
            /\b(href|src)=["'](?:\.{1,2}\/)?public\/lib4ui\/([^"']+)["']/gi,
            (_m, attr, rest) => `${attr}="${urlFilter('/lib4ui/' + rest)}"`
        );

        // lib4ui/... -> /lib4ui/...
        out = out.replace(
            /\b(href|src)=["'](?:\.{1,2}\/)?lib4ui\/([^"']+)["']/gi,
            (_m, attr, rest) => `${attr}="${urlFilter('/lib4ui/' + rest)}"`
        );

        return out;
    });

    // 9) Manifest-aware anchor rewriter: href="#slug" -> /LANG/(blocks|fields)/id/
    eleventyConfig.addFilter(
        "rewriteDocAnchors",
        (html, lang, _unusedPathPrefix = "/", manifestForLang = null) => {
            if (!html) return html;
            let out = String(html);

            // Build lowercase -> canonical maps for blocks & fields (one-level nesting)
            const blockIdMap = new Map();
            const fieldIdMap = new Map();

            if (manifestForLang && Array.isArray(manifestForLang.blocks)) {
                for (const top of manifestForLang.blocks) {
                    if (top?.id) blockIdMap.set(String(top.id).toLowerCase(), top.id);
                    for (const f of top?.fields || []) {
                        if (f?.id) fieldIdMap.set(String(f.id).toLowerCase(), f.id);
                    }
                    for (const sub of top?.blocks || []) {
                        if (sub?.id) blockIdMap.set(String(sub.id).toLowerCase(), sub.id);
                        for (const f of sub?.fields || []) {
                            if (f?.id) fieldIdMap.set(String(f.id).toLowerCase(), f.id);
                        }
                    }
                }
            }

            // Replace any href="#slug"
            out = out.replace(/href="#([^"\s]+)"/g, (match, rawSlug) => {
                const lower = String(rawSlug).toLowerCase();

                if (blockIdMap.has(lower)) {
                    const id = blockIdMap.get(lower);
                    return `href="${urlFilter('/' + lang + '/blocks/' + id + '/')}"`;
                }

                if (fieldIdMap.has(lower)) {
                    const id = fieldIdMap.get(lower);
                    return `href="${urlFilter('/' + lang + '/fields/' + id + '/')}"`;
                }

                // Unknown slug: leave as-is for PDF usage
                return match;
            });

            return out;
        }
    );

    return {
        pathPrefix: process.env.ELEVENTY_ENV === "production" ? "/basic-poc/" : "/",
        dir: {
            input: "src",
            includes: "layouts",
            output: "_site",
        },
    };
}

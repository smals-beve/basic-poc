import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import i18n from "./src/_data/i18n.js";

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

    // 3) API specs from YAML (guard directory existence)
    eleventyConfig.addCollection("apiSpecs", () => {
        const specsDir = path.join(__dirname, "src/content/technical_specs");
        if (!fs.existsSync(specsDir)) return [];
        return fs
            .readdirSync(specsDir)
            .filter((f) => /\.(ya?ml)$/.test(f))
            .map((file) => ({
                fileSlug: path.parse(file).name,
                data: yaml.load(fs.readFileSync(path.join(specsDir, file), "utf8")),
            }));
    });

    // 4) Layout alias & nojekyll passthrough
    eleventyConfig.addLayoutAlias("default", "base.njk");
    eleventyConfig.addPassthroughCopy({ ".nojekyll": ".nojekyll" });

    // 5) Strip outer <!DOCTYPE>/<html>/<head>/<body> from raw templates
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

    // 6) Normalize asset URLs from upstream HTML using urlFilter
    eleventyConfig.addFilter("rewriteAssetUrls", (html) => {
        if (!html) return html;
        let out = String(html);

        // Don't touch absolute/external/mail/anchor/data URLs.
        const isExternal = (s) => /^(https?:|mailto:|data:|#)/i.test(s);

        // src/assets/...  -> /assets/...
        out = out.replace(
            /\b(href|src)=["']((?:\.{1,2}\/)?src\/assets\/([^"']+))["']/gi,
            (_m, attr, full, rest) =>
                isExternal(full) ? `${attr}="${full}"` : `${attr}="${urlFilter("/assets/" + rest)}"`
        );

        // assets/...      -> /assets/...
        out = out.replace(
            /\b(href|src)=["']((?:\.{1,2}\/)?assets\/([^"']+))["']/gi,
            (_m, attr, full, rest) =>
                isExternal(full) ? `${attr}="${full}"` : `${attr}="${urlFilter("/assets/" + rest)}"`
        );

        // /assets/...     -> (prefix via urlFilter)
        out = out.replace(
            /\b(href|src)=["'](\/assets\/([^"']+))["']/gi,
            (_m, attr, full, rest) =>
                isExternal(full) ? `${attr}="${full}"` : `${attr}="${urlFilter("/assets/" + rest)}"`
        );

        // public/lib4ui/... -> /lib4ui/...
        out = out.replace(
            /\b(href|src)=["']((?:\.{1,2}\/)?public\/lib4ui\/([^"']+))["']/gi,
            (_m, attr, full, rest) =>
                isExternal(full) ? `${attr}="${full}"` : `${attr}="${urlFilter("/lib4ui/" + rest)}"`
        );

        // lib4ui/... -> /lib4ui/...
        out = out.replace(
            /\b(href|src)=["']((?:\.{1,2}\/)?lib4ui\/([^"']+))["']/gi,
            (_m, attr, full, rest) =>
                isExternal(full) ? `${attr}="${full}"` : `${attr}="${urlFilter("/lib4ui/" + rest)}"`
        );

        return out;
    });

    // 7) i18n translate filter: translate(key, lang, params) → string
    eleventyConfig.addFilter("translate", (key, lang, params = {}) => {
        try {
            // Prefer direct import; fall back to Eleventy global data if available
            const dict = i18n || eleventyConfig.globalData?.i18n || {};
            const site = eleventyConfig.globalData?.site || {};
            const entry = dict[key] || {};
            const chosenLang = lang || site.defaultLang || "en";
            const raw =
                entry[chosenLang] ??
                entry[site.defaultLang] ??
                entry.en ??
                key; // last resort: return the key

            // simple placeholder interpolation: {{name}}
            return String(raw).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, p1) => {
                const v = params?.[p1];
                return v === undefined || v === null ? "" : String(v);
            });
        } catch {
            return key;
        }
    });

    // 8) Manifest-aware anchor rewriter: href="#slug" -> /LANG/(blocks|fields)/id/
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
                    return `href="${urlFilter("/" + lang + "/blocks/" + id + "/")}"`;
                }
                if (fieldIdMap.has(lower)) {
                    const id = fieldIdMap.get(lower);
                    return `href="${urlFilter("/" + lang + "/fields/" + id + "/")}"`;
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

import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import yaml from "js-yaml";
import i18n from "./src/_data/i18n.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let _specsCache = null;

/** ------------------------------------------------------------------
 * Load YAML API specs (cached)
 * ------------------------------------------------------------------ */
function loadApiSpecsMemo() {
    if (_specsCache) return _specsCache;

    const specsDir = path.join(__dirname, "src/content/technical_specs");
    if (!fs.existsSync(specsDir)) {
        _specsCache = [];
        return _specsCache;
    }

    _specsCache = fs
        .readdirSync(specsDir)
        .filter((f) => /\.(ya?ml)$/i.test(f))
        .map((file) => {
            const filePath = path.join(specsDir, file);
            let data = {};
            try {
                data = yaml.load(fs.readFileSync(filePath, "utf8")) ?? {};
            } catch (e) {
                console.warn(`[apiSpecs] Failed to parse ${file}:`, e.message);
            }
            return {
                fileSlug: path.parse(file).name,
                data,
            };
        });

    return _specsCache;
}

export default function (eleventyConfig) {

    /** --------------------------------------------------------------
     * 1) Copy static assets (CSS, images, JS, bundles, specs)
     * -------------------------------------------------------------- */
    eleventyConfig.addPassthroughCopy({
        "public/lib4ui": "lib4ui",
        "src/assets": "assets",
        "src/content/technical_specs": "content/technical_specs",
    });

    // Copy all JS (including /js/search/)
    eleventyConfig.addPassthroughCopy({
        "src/js": "js",
    });

    // Copy Bootstrap bundle explicitly
    eleventyConfig.addPassthroughCopy({
        "src/assets/js/vendor/bootstrap.bundle.min.js": "assets/js/bootstrap.bundle.min.js",
    });

    /** --------------------------------------------------------------
     * 2) Watch technical spec sources
     * -------------------------------------------------------------- */
    eleventyConfig.addWatchTarget("src/content/technical_specs");

    /** --------------------------------------------------------------
     * 3) Collections for API specs (flat and per-language versions)
     * -------------------------------------------------------------- */
    eleventyConfig.addCollection("apiSpecs", () => loadApiSpecsMemo());

    eleventyConfig.addCollection("apiSpecsByLang", () => {
        const specs = loadApiSpecsMemo();
        const site = eleventyConfig.globalData?.site || {};
        const langs =
            Array.isArray(site.supportedLangs) && site.supportedLangs.length
                ? site.supportedLangs
                : ["nl", "fr"];

        const out = [];
        for (const lang of langs) {
            for (const spec of specs) out.push({lang, spec});
        }
        return out;
    });

    /** --------------------------------------------------------------
     * 4) Layout aliases & .nojekyll for GitHub Pages compatibility
     * -------------------------------------------------------------- */
    eleventyConfig.addLayoutAlias("default", "base.njk");
    eleventyConfig.addPassthroughCopy({".nojekyll": ".nojekyll"});

    /** --------------------------------------------------------------
     * 5) stripOuterHtml  — remove <html>, <head>, keep body content
     * -------------------------------------------------------------- */
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

    /** --------------------------------------------------------------
     * 6) rewriteAssetUrls  — convert relative URLs to /assets/...
     * -------------------------------------------------------------- */
    const urlFilter = eleventyConfig.getFilter("url");
    eleventyConfig.addFilter("rewriteAssetUrls", (html) => {
        if (!html) return html;
        let out = String(html);
        const isExternal = (s) => /^(https?:|mailto:|data:|#)/i.test(s);

        out = out.replace(
            /\b(href|src)=["']((?:\.{1,2}\/)?src\/assets\/([^"']+))["']/gi,
            (_m, attr, full, rest) =>
                isExternal(full) ? `${attr}="${full}"` : `${attr}="${urlFilter("/assets/" + rest)}"`
        );
        out = out.replace(
            /\b(href|src)=["']((?:\.{1,2}\/)?assets\/([^"']+))["']/gi,
            (_m, attr, full, rest) =>
                isExternal(full) ? `${attr}="${full}"` : `${attr}="${urlFilter("/assets/" + rest)}"`
        );
        out = out.replace(
            /\b(href|src)=["'](\/assets\/([^"']+))["']/gi,
            (_m, attr, full, rest) =>
                isExternal(full) ? `${attr}="${full}"` : `${attr}="${urlFilter("/assets/" + rest)}"`
        );
        out = out.replace(
            /\b(href|src)=["']((?:\.{1,2}\/)?public\/lib4ui\/([^"']+))["']/gi,
            (_m, attr, full, rest) =>
                isExternal(full) ? `${attr}="${full}"` : `${attr}="${urlFilter("/lib4ui/" + rest)}"`
        );
        out = out.replace(
            /\b(href|src)=["']((?:\.{1,2}\/)?lib4ui\/([^"']+))["']/gi,
            (_m, attr, full, rest) =>
                isExternal(full) ? `${attr}="${full}"` : `${attr}="${urlFilter("/lib4ui/" + rest)}"`
        );
        return out;
    });

    /** --------------------------------------------------------------
     * 7) translate  — centralized i18n dictionary + placeholders
     * -------------------------------------------------------------- */
    eleventyConfig.addFilter("translate", (key, lang, params = {}) => {
        try {
            const dict = i18n || eleventyConfig.globalData?.i18n || {};
            const site = eleventyConfig.globalData?.site || {};
            const entry = dict[key] || {};
            const chosenLang = lang || site.defaultLang || "en";
            const raw = entry[chosenLang] ?? entry[site.defaultLang] ?? entry.en ?? key;

            return String(raw).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, p1) => {
                const v = params?.[p1];
                return v == null ? "" : String(v);
            });
        } catch {
            return key;
        }
    });

    /** --------------------------------------------------------------
     * 8) rewriteDocAnchors  — map #anchor → correct block/field URLs
     * -------------------------------------------------------------- */
    eleventyConfig.addFilter(
        "rewriteDocAnchors",
        (html, lang, _prefix = "/", manifestForLang = null) => {
            if (!html) return html;
            let out = String(html);

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

            out = out.replace(/href="#([^"\s]+)"/g, (match, rawSlug) => {
                const lower = String(rawSlug).toLowerCase();
                if (blockIdMap.has(lower)) {
                    return `href="${urlFilter("/" + lang + "/blocks/" + blockIdMap.get(lower) + "/")}"`;
                }
                if (fieldIdMap.has(lower)) {
                    return `href="${urlFilter("/" + lang + "/fields/" + fieldIdMap.get(lower) + "/")}"`;
                }
                return match;
            });

            return out;
        }
    );

    /** --------------------------------------------------------------
     * 9) JSON filter (for /searchIndex.json)
     * -------------------------------------------------------------- */
    eleventyConfig.addFilter("json", (value) => JSON.stringify(value, null, 2));

    /** --------------------------------------------------------------
     * Final Eleventy settings
     * -------------------------------------------------------------- */
    return {
        pathPrefix: process.env.ELEVENTY_ENV === "production" ? "/basic-poc/" : "/",
        dir: {
            input: "src",
            includes: "layouts",
            output: "_site",
        },
    };
}

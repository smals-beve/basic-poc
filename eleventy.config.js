import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import { InputPathToUrlTransformPlugin } from "@11ty/eleventy";

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function(eleventyConfig) {
    // 1) Rewrite .md links → folder URLs
    eleventyConfig.addPlugin(InputPathToUrlTransformPlugin, {
        extensions: "html"
    });

    // 2) Passthrough copy
    eleventyConfig.addPassthroughCopy({
        "public/lib4ui": "lib4ui",
        "src/assets": "assets",
        "src/content/technical_specs": "content/technical_specs"
    });

    // 3) Language‐specific collections
    ["en","fr","nl"].forEach(lang => {
        eleventyConfig.addCollection(`docs_${lang}`, coll =>
            coll.getFilteredByGlob(`src/content/technical_docs_${lang}/**/*.md`)
        );
    });

    // 4) API specs from YAML
    eleventyConfig.addCollection("apiSpecs", () => {
        const specsDir = path.join(__dirname, "src", "content", "technical_specs");
        return fs.readdirSync(specsDir)
            .filter(f => /\.(ya?ml)$/.test(f))
            .map(filename => ({
                fileSlug: path.parse(filename).name,
                data: yaml.load(fs.readFileSync(path.join(specsDir, filename), "utf8"))
            }));
    });

    // 5) Layout alias & .nojekyll passthrough
    eleventyConfig.addLayoutAlias("default", "base.njk");
    eleventyConfig.addPassthroughCopy({ ".nojekyll": ".nojekyll" });

    // 6) Dev server tweaks
    eleventyConfig.setBrowserSyncConfig({
        open: true,
        notify: false
    });

    // 7) Basic directory settings; no pathPrefix here!
    return {
        dir: {
            input: "src",
            includes: "layouts",
            output: "_site"
        }
    };
}

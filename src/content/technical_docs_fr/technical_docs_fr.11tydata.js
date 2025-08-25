import manifest from "../../_data/manifest_fr.json" with { type: "json" };

const LANG = "fr";

/**
 * Find a nested (sub-block) ID by its slug, case-insensitive.
 */
function findNestedBlockId(slug) {
    for (const topLevelBlock of manifest.blocks || []) {
        for (const nestedBlock of topLevelBlock.blocks || []) {
            if ((nestedBlock.id || "").toLowerCase() === slug) {
                return nestedBlock.id;
            }
        }
    }
    return null;
}

export default {
    lang: LANG,
    eleventyComputed: {
        layout: (data) =>
            data.page.fileSlug === "overview" ? "landing.njk" : "doc.njk",

        permalink: (data) => {
            const slug = (data.page.fileSlug || "").toLowerCase();

            // overview
            if (slug === "overview") {
                return `/${LANG}/`;
            }

            // top-level block
            const topLevelBlock = (manifest.blocks || []).find(
                (block) => (block.id || "").toLowerCase() === slug
            );
            if (topLevelBlock) {
                return `/${LANG}/blocks/${topLevelBlock.id}/`;
            }

            // nested block
            const nestedBlockId = findNestedBlockId(slug);
            if (nestedBlockId) {
                return `/${LANG}/blocks/${nestedBlockId}/`;
            }

            // field (look in top-level and nested blocks)
            for (const topLevelBlock of manifest.blocks || []) {
                const directField = (topLevelBlock.fields || []).find(
                    (field) => (field.id || "").toLowerCase() === slug
                );
                if (directField) {
                    return `/${LANG}/fields/${directField.id}/`;
                }

                for (const nestedBlock of topLevelBlock.blocks || []) {
                    const nestedField = (nestedBlock.fields || []).find(
                        (field) => (field.id || "").toLowerCase() === slug
                    );
                    if (nestedField) {
                        return `/${LANG}/fields/${nestedField.id}/`;
                    }
                }
            }

            // fallback
            return `/${LANG}/${slug}/`;
        },

        title: (data) => {
            const slug = (data.page.fileSlug || "").toLowerCase();

            if (slug === "overview") {
                return manifest.overview?.title || "Aperçu";
            }

            // block / nested block
            for (const topLevelBlock of manifest.blocks || []) {
                if ((topLevelBlock.id || "").toLowerCase() === slug) {
                    return topLevelBlock.title || topLevelBlock.id;
                }
                for (const nestedBlock of topLevelBlock.blocks || []) {
                    if ((nestedBlock.id || "").toLowerCase() === slug) {
                        return nestedBlock.title || nestedBlock.id;
                    }
                }
            }

            // field (top & nested)
            for (const topLevelBlock of manifest.blocks || []) {
                for (const field of topLevelBlock.fields || []) {
                    if ((field.id || "").toLowerCase() === slug) {
                        return field.title || field.id;
                    }
                }
                for (const nestedBlock of topLevelBlock.blocks || []) {
                    for (const field of nestedBlock.fields || []) {
                        if ((field.id || "").toLowerCase() === slug) {
                            return field.title || field.id;
                        }
                    }
                }
            }

            return data.title || slug || "Documentation";
        },

        navLabel: (data) => data.navLabel || data.title || data.page.fileSlug,
    },
};

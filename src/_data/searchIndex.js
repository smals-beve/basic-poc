import manifest_nl from "./manifest_nl.json" with { type: "json" };
import manifest_fr from "./manifest_fr.json" with { type: "json" };

const manifests = { nl: manifest_nl, fr: manifest_fr };

const indexFromManifest = (lang, manifest) => {
    const items = [];

    if (manifest.overview) {
        items.push({
            lang,
            type: "overview",
            id: "overview",
            title: manifest.overview.title,
            url: `/${lang}/`,
        });
    }

    const visitBlock = (block) => {
        // Block itself
        items.push({
            lang,
            type: "block",
            id: block.id,
            title: block.title,
            url: `/${lang}/blocks/${block.id}/`,
        });

        // Its fields
        for (const field of block.fields || []) {
            items.push({
                lang,
                type: "field",
                id: field.id,
                title: field.title,
                url: `/${lang}/fields/${field.id}/`,
            });
        }

        // Nested blocks (any depth)
        for (const child of block.blocks || []) {
            visitBlock(child);
        }
    };

    for (const block of manifest.blocks || []) {
        visitBlock(block);
    }

    return items;
};

export default () => {
    let all = [];
    for (const [lang, manifest] of Object.entries(manifests)) {
        all = all.concat(indexFromManifest(lang, manifest));
    }
    return all;
};

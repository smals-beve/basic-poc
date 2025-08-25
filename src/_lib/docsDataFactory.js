import {
    indexManifest,
    resolveSlug,
    findParentForField,
    findTopParentForNestedBlock,
    buildFieldSwitcher,
} from "./nav.js";

export const makeDocsData = (manifest, lang) => {
    const idx = indexManifest(manifest);

    const overviewTitle = (m, langCode) => {
        if (m?.overview?.title) return m.overview.title;
        if (langCode === "nl") return "Overzicht";
        if (langCode === "fr") return "Aperçu";
        return "Overview";
    };

    return {
        lang,
        eleventyComputed: {
            layout: (data) => (data.page.fileSlug === "overview" ? "landing.njk" : "doc.njk"),

            permalink: (data) => {
                const slug = (data.page.fileSlug || "").toLowerCase();
                const res = resolveSlug(slug, idx);
                if (res.type === "overview") return `/${lang}/`;
                if (res.type === "block") return `/${lang}/blocks/${res.id}/`;
                if (res.type === "nested") return `/${lang}/blocks/${res.id}/`;
                if (res.type === "field") return `/${lang}/fields/${res.id}/`;
                return `/${lang}/${slug}/`;
            },

            title: (data) => {
                const slug = (data.page.fileSlug || "").toLowerCase();
                if (slug === "overview") return overviewTitle(manifest, lang);
                const res = resolveSlug(slug, idx);
                if (res.type !== "unknown") return idx.idToTitle.get(res.id) || res.id;
                return data.title || slug || "Documentation";
            },

            navLabel: (data) => data.navLabel || data.title || data.page.fileSlug,

            backUrl: (data) => {
                const slug = (data.page.fileSlug || "").toLowerCase();
                const res = resolveSlug(slug, idx);
                if (res.type === "field") {
                    const info = findParentForField(manifest, idx, res.id);
                    return info ? `/${lang}/blocks/${info.parentId}/` : null;
                }
                if (res.type === "nested") {
                    const info = findTopParentForNestedBlock(manifest, idx, res.id);
                    return info ? `/${lang}/blocks/${info.parentId}/` : null;
                }
                return null;
            },

            backLabel: (data) => {
                const slug = (data.page.fileSlug || "").toLowerCase();
                const res = resolveSlug(slug, idx);
                if (res.type === "field") {
                    const info = findParentForField(manifest, idx, res.id);
                    return info ? info.parentTitle : null;
                }
                if (res.type === "nested") {
                    const info = findTopParentForNestedBlock(manifest, idx, res.id);
                    return info ? info.parentTitle : null;
                }
                return null;
            },

            // Field switcher (dropdown only)
            fieldSwitcher: (data) => {
                const slug = (data.page.fileSlug || "").toLowerCase();
                const res = resolveSlug(slug, idx);
                if (res.type !== "field") return null;
                return buildFieldSwitcher(idx, lang, res.id);
            },

            // Breadcrumbs
            breadcrumbs: (data) => {
                const slug = (data.page.fileSlug || "").toLowerCase();
                const res = resolveSlug(slug, idx);

                const crumbs = [{title: overviewTitle(manifest, lang), href: `/${lang}/`}];

                if (res.type === "block") {
                    crumbs.push({title: idx.idToTitle.get(res.id) || res.id, href: `/${lang}/blocks/${res.id}/`});

                } else if (res.type === "nested") {
                    const parent = findTopParentForNestedBlock(manifest, idx, res.id);
                    if (parent) crumbs.push({title: parent.parentTitle, href: `/${lang}/blocks/${parent.parentId}/`});
                    crumbs.push({title: idx.idToTitle.get(res.id) || res.id, href: `/${lang}/blocks/${res.id}/`});

                } else if (res.type === "field") {
                    const parent = findParentForField(manifest, idx, res.id);
                    if (parent) crumbs.push({title: parent.parentTitle, href: `/${lang}/blocks/${parent.parentId}/`});
                    crumbs.push({title: idx.idToTitle.get(res.id) || res.id, href: `/${lang}/fields/${res.id}/`});
                }

                return crumbs;
            },
        },
    };
};

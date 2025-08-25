// Build fast lookup maps once per manifest
export const indexManifest = (manifest) => {
    const idToTitle = new Map();

    // lowercased id -> canonical id
    const topLowerToId = new Map();
    const nestedLowerToId = new Map();
    const fieldLowerToId = new Map();

    // relations
    const fieldToParentLower = new Map();  // lower(fieldId) -> parentBlockId (top or nested)
    const nestedToTopLower = new Map();    // lower(nestedBlockId) -> topBlockId

    // parentId -> ordered fields [{id,title,order}]
    const parentIdToFields = new Map();

    const pushField = (parentId, f) => {
        if (!f?.id) return;
        const arr = parentIdToFields.get(parentId) || [];
        arr.push({ id: f.id, title: f.title || f.id, order: f.order ?? 0 });
        parentIdToFields.set(parentId, arr);
    };

    for (const top of manifest.blocks || []) {
        if (!top?.id) continue;
        idToTitle.set(top.id, top.title || top.id);
        topLowerToId.set(String(top.id).toLowerCase(), top.id);

        for (const f of top.fields || []) {
            if (!f?.id) continue;
            idToTitle.set(f.id, f.title || f.id);
            fieldLowerToId.set(String(f.id).toLowerCase(), f.id);
            fieldToParentLower.set(String(f.id).toLowerCase(), top.id);
            pushField(top.id, f);
        }

        for (const sub of top.blocks || []) {
            if (!sub?.id) continue;
            idToTitle.set(sub.id, sub.title || sub.id);
            nestedLowerToId.set(String(sub.id).toLowerCase(), sub.id);
            nestedToTopLower.set(String(sub.id).toLowerCase(), top.id);

            for (const f of sub.fields || []) {
                if (!f?.id) continue;
                idToTitle.set(f.id, f.title || f.id);
                fieldLowerToId.set(String(f.id).toLowerCase(), f.id);
                fieldToParentLower.set(String(f.id).toLowerCase(), sub.id);
                pushField(sub.id, f);
            }
        }
    }

    // sort fields per parentId by order -> title -> id
    for (const [parentId, list] of parentIdToFields) {
        list.sort((a, b) => {
            if ((a.order ?? 0) !== (b.order ?? 0)) return (a.order ?? 0) - (b.order ?? 0);
            const at = (a.title || "").toLowerCase();
            const bt = (b.title || "").toLowerCase();
            if (at !== bt) return at.localeCompare(bt);
            return String(a.id).localeCompare(String(b.id));
        });
    }

    return {
        idToTitle,
        topLowerToId,
        nestedLowerToId,
        fieldLowerToId,
        fieldToParentLower,
        nestedToTopLower,
        parentIdToFields,
    };
};

// Resolve a slug to { type: 'overview'|'block'|'nested'|'field'|'unknown', id }
export const resolveSlug = (slug, idx) => {
    const s = String(slug).toLowerCase();
    if (s === "overview") return { type: "overview", id: "overview" };
    if (idx.topLowerToId.has(s))    return { type: "block",  id: idx.topLowerToId.get(s) };
    if (idx.nestedLowerToId.has(s)) return { type: "nested", id: idx.nestedLowerToId.get(s) };
    if (idx.fieldLowerToId.has(s))  return { type: "field",  id: idx.fieldLowerToId.get(s) };
    return { type: "unknown", id: s };
};

// Field -> its (sub)block parent (id + title)
export const findParentForField = (manifest, idx, fieldIdOrSlug) => {
    const lower = String(fieldIdOrSlug).toLowerCase();
    const parentId = idx.fieldToParentLower.get(lower);
    if (!parentId) return null;
    return { parentId, parentTitle: idx.idToTitle.get(parentId) || parentId };
};

// Nested block -> its top-level parent (id + title)
export const findTopParentForNestedBlock = (manifest, idx, nestedBlockIdOrSlug) => {
    const lower = String(nestedBlockIdOrSlug).toLowerCase();
    const parentId = idx.nestedToTopLower.get(lower);
    if (!parentId) return null;
    return { parentId, parentTitle: idx.idToTitle.get(parentId) || parentId };
};

// Sibling fields list (ordered) for a given field id
export const getSiblingFields = (idx, fieldIdOrSlug) => {
    const lower = String(fieldIdOrSlug).toLowerCase();
    const canonicalFieldId = idx.fieldLowerToId.get(lower);
    if (!canonicalFieldId) return [];
    const parentId = idx.fieldToParentLower.get(lower);
    if (!parentId) return [];
    return idx.parentIdToFields.get(parentId) || [];
};

// Build field-switcher (dropdown items only; no prev/next)
export const buildFieldSwitcher = (idx, lang, currentFieldIdOrSlug) => {
    const lower = String(currentFieldIdOrSlug).toLowerCase();
    const currentFieldId = idx.fieldLowerToId.get(lower);
    if (!currentFieldId) return null;

    const siblings = getSiblingFields(idx, currentFieldId);
    if (!siblings.length) return null;

    const items = siblings
        .filter((f) => f.id !== currentFieldId)
        .map((f) => ({
            id: f.id,
            title: f.title,
            hrefPath: `/${lang}/fields/${f.id}/`, // pass through |url in template
        }));

    return { currentId: currentFieldId, items };
};

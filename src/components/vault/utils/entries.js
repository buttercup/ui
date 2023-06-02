import R from "ramda";
import Fuse from "fuse.js";
import { EntryPropertyType } from "buttercup/web";

const options = {
    keys: ["fields.value"],
    includeMatches: true,
    minMatchCharLength: 3
};

export const filterEntries = (entries = [], term = "") => {
    if (term === "") {
        return entries;
    }
    const fuse = new Fuse(entries, options);
    return fuse.search(term).map(hit => ({ ...hit.item, matches: hit.matches }));
};

export function sortEntries(entries = [], asc = true) {
    return entries.sort((a, b) => {
        const aTitleProp = a.fields.find(
            f => f.property === "title" && f.propertyType === EntryPropertyType.Property
        );
        const bTitleProp = b.fields.find(
            f => f.property === "title" && f.propertyType === EntryPropertyType.Property
        );
        const aTitle = aTitleProp?.value ?? "";
        const bTitle = bTitleProp?.value ?? "";
        if (aTitle < bTitle) {
            return asc ? -1 : 1;
        } else if (aTitle > bTitle) {
            return asc ? 1 : -1;
        }
        return 0;
    });
}

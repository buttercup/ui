import { EntryType } from "buttercup/web";

export const defaultType = EntryType.Login;

export const types = [
    {
        type: EntryType.Login,
        icon: "id-number",
        default: true
    },
    {
        type: EntryType.Website,
        icon: "globe-network"
    },
    {
        type: EntryType.CreditCard,
        icon: "credit-card"
    },
    {
        type: EntryType.Note,
        icon: "annotation"
    },
    {
        type: EntryType.SSHKey,
        icon: "key"
    }
];

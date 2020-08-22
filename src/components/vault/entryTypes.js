import { EntryType } from 'buttercup/web';

export const defaultType = EntryType.Login;

export const types = [
  {
    type: EntryType.Login,
    title: 'Login',
    label: 'Default',
    icon: 'id-number',
    description: 'Credentials for a login form'
  },
  {
    type: EntryType.Website,
    title: 'Website',
    icon: 'globe-network',
    description: 'Login details for a website'
  },
  {
    type: EntryType.CreditCard,
    title: 'Credit/Bank Card',
    icon: 'credit-card',
    description: 'Credit/Bank Card details'
  },
  {
    type: EntryType.Note,
    title: 'Note',
    icon: 'annotation',
    description: 'A secure note'
  },
  {
    type: EntryType.SSHKey,
    title: 'SSH Key',
    icon: 'key',
    description: 'An SSH Key pair'
  }
];

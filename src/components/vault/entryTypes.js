import {
  ENTRY_TYPE_CREDITCARD,
  ENTRY_TYPE_LOGIN,
  ENTRY_TYPE_NOTE,
  ENTRY_TYPE_SSHKEY,
  ENTRY_TYPE_WEBSITE
} from 'buttercup/web';

export const defaultType = ENTRY_TYPE_LOGIN;

export const types = [
  {
    type: ENTRY_TYPE_LOGIN,
    title: 'Login',
    label: 'Default',
    icon: 'id-number',
    description: 'Credentials for a login form'
  },
  {
    type: ENTRY_TYPE_WEBSITE,
    title: 'Website',
    icon: 'globe-network',
    description: 'Login details for a website'
  },
  {
    type: ENTRY_TYPE_CREDITCARD,
    title: 'Credit/Bank Card',
    icon: 'credit-card',
    description: 'Credit/Bank Card details'
  },
  {
    type: ENTRY_TYPE_NOTE,
    title: 'Note',
    icon: 'annotation',
    description: 'A secure note'
  },
  {
    type: ENTRY_TYPE_SSHKEY,
    title: 'SSH Key',
    icon: 'key',
    description: 'An SSH Key pair'
  }
];

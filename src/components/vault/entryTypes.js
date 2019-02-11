import {
  ENTRY_TYPE_CREDITCARD,
  ENTRY_TYPE_LOGIN,
  ENTRY_TYPE_NOTE,
  ENTRY_TYPE_SSHKEY,
  ENTRY_TYPE_WEBSITE
} from '@buttercup/facades';

export const defaultType = ENTRY_TYPE_LOGIN;

export const types = [
  {
    type: ENTRY_TYPE_LOGIN,
    title: 'Login (default)',
    description: 'Credentials for a login form'
  },
  {
    type: ENTRY_TYPE_WEBSITE,
    title: 'Website',
    description: 'Login details for a website'
  },
  {
    type: ENTRY_TYPE_CREDITCARD,
    title: 'Credit/Bank Card',
    description: 'Credit/Bank Card details'
  },
  {
    type: ENTRY_TYPE_NOTE,
    title: 'Note',
    description: 'A secure note'
  },
  {
    type: ENTRY_TYPE_SSHKEY,
    title: 'SSH Key',
    description: 'An SSH Key pair'
  }
];

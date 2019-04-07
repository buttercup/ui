import { getFacadeField } from '../../../utils';

export const filterEntries = (entries = [], term = '') => {
  if (term === '') {
    return entries;
  }
  return entries.filter(entry =>
    (getFacadeField(entry, 'username') || '').toLowerCase().includes(term.toLowerCase())
  );
};

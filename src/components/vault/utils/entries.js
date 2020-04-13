import R from 'ramda';
import Fuse from 'fuse.js';
import { getFacadeField } from '../../../utils';

const options = {
  keys: ['fields.value'],
  includeMatches: true,
  minMatchCharLength: 3,
};

export const filterEntries = (entries = [], term = '') => {
  if (term === '') {
    return entries;
  }
  const fuse = new Fuse(entries, options);
  return fuse.search(term).map((hit) => ({ ...hit.item, matches: hit.matches }));
};

export const sortEntries = (entries = [], asc = true) => {
  const sortByTitleCaseInsensitive = R.sortBy(
    R.compose(
      R.toLower,
      R.compose(R.prop('value'), R.find(R.propEq('property', 'title')), R.prop('fields'))
    )
  );
  const sorted = sortByTitleCaseInsensitive(entries);
  return asc ? sorted : R.reverse(sorted);
};

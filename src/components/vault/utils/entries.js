import R from 'ramda';
import { getFacadeField } from '../../../utils';

export const filterEntries = (entries = [], term = '') => {
  if (term === '') {
    return entries;
  }
  return entries.filter(entry =>
    (getFacadeField(entry, 'username') || '').toLowerCase().includes(term.toLowerCase())
  );
};

export const sortEntries = (groups = [], asc = true) => {
  const sortByTitleCaseInsensitive = R.sortBy(
    R.compose(
      R.toLower,
      R.compose(
        R.prop('value'),
        R.find(R.propEq('property', 'title')),
        R.prop('fields')
      )
    )
  );
  const sorted = sortByTitleCaseInsensitive(groups);
  return asc ? sorted : R.reverse(sorted);
};

import { sortBy, prop, compose, toLower, reverse } from 'ramda';

export const isTrashGroup = group => group.attributes && group.attributes.bc_group_role === 'trash';

export const getNestedGroups = (groups = [], selectedGroupID, expandedGroups, parentID = '0') => {
  return groups
    .filter(group => group.parentID === parentID && group.attributes.bc_group_role !== 'trash')
    .map(group => {
      const childNodes = getNestedGroups(groups, selectedGroupID, expandedGroups, group.id);
      const isExpanded = expandedGroups.includes(group.id);
      const isTrash = isTrashGroup(group);
      return {
        id: group.id,
        label: group.title,
        icon: isTrash ? 'trash' : isExpanded ? 'folder-open' : 'folder-close',
        hasCaret: childNodes.length,
        isSelected: group.id === selectedGroupID,
        isExpanded,
        childNodes,
        className: 'node',
        isTrash
      };
    });
};

export const filterNestedGroups = (groups = [], term = '') => {
  if (term === '') {
    return groups;
  }

  return groups.filter(group => {
    if (Array.isArray(group.childNodes) && group.childNodes.length > 0) {
      group.childNodes = filterNestedGroups(group.childNodes, term);
    }
    return group.label.toLowerCase().includes(term.toLowerCase()) || group.childNodes.length > 0;
  });
};

export const sortGroups = (groups = [], asc = true) => {
  const sortByTitleCaseInsensitive = sortBy(
    compose(
      toLower,
      prop('title')
    )
  );
  const sorted = sortByTitleCaseInsensitive(groups);
  return asc ? sorted : reverse(sorted);
};

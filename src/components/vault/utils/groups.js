import { sortBy, prop, compose, toLower, reverse } from 'ramda';

export function countChildGroups(facade, parentGroupID) {
  const groups = getAllGroupsInGroup(facade, parentGroupID);
  return groups.length;
}

export function countChildGroupsAndEntries(facade, parentGroupID) {
  const groups = getAllGroupsInGroup(facade, parentGroupID);
  let count = groups.length;
  groups.forEach(group => {
    count += getAllEntriesInGroup(facade, group.id).length;
  });
  return count;
}

export const isTrashGroup = group => group.attributes && group.attributes.bc_group_role === 'trash';

export const getAllEntriesInGroup = (facade, groupID) => {
  const allGroups = getAllGroupsInGroup(facade, groupID, true);
  return allGroups.reduce((output, group) => {
    return [...output, ...facade.entries.filter(entry => entry.parentID === groupID)];
  }, []);
};

export const getAllGroupsInGroup = (facade, groupID, includeParent = false) => {
  const groups = includeParent ? [facade.groups.find(g => g.id === groupID)] : [];
  facade.groups.forEach(group => {
    if (group.parentID === groupID) {
      groups.push(group);
      groups.push(...getAllGroupsInGroup(facade, group.id));
    }
  });
  return groups;
};

export const getNestedGroups = (
  groups = [],
  selectedGroupID,
  expandedGroups,
  parentID = '0',
  allowTrash = false
) => {
  return groups
    .filter(
      group =>
        group.parentID === parentID &&
        (allowTrash || (!allowTrash && group.attributes.bc_group_role !== 'trash'))
    )
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
  const sortByTitleCaseInsensitive = sortBy(compose(toLower, prop('title')));
  const sorted = sortByTitleCaseInsensitive(groups);
  return asc ? sorted : reverse(sorted);
};

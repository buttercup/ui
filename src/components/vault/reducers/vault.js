export function vaultReducer(state, action) {
  switch (action.type) {
    case 'save-entry': {
      const { entry: baseEntry } = action;
      const { isNew, ...entry } = baseEntry;
      const existingEntry = state.entries.find(e => e.id === entry.id);
      if (existingEntry) {
        return {
          ...state,
          entries: state.entries.map(e => {
            if (e.id === entry.id) {
              return entry;
            }
            return e;
          })
        };
      }
      return {
        ...state,
        entries: [...state.entries, entry]
      };
    }
    case 'move-entry':
      return {
        ...state,
        entries: state.entries.map(entry => {
          if (entry.id === action.entryID) {
            return {
              ...entry,
              parentID: action.parentID
            };
          }
          return entry;
        })
      };
    case 'delete-entry':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.entryID)
      };
    case 'create-group':
      return {
        ...state,
        groups: [...state.groups, action.payload]
      };
    case 'set-entry-field': {
      const { entryID, field, value } = action;
      return {
        ...state,
        entries: state.entries.map(entry => {
          if (entry.id === entryID) {
            return {
              ...entry,
              fields: entry.fields.map(entryField => {
                if (
                  entryField.property === field.property &&
                  entryField.propertyType === field.propertyType
                ) {
                  return {
                    ...entryField,
                    value: value
                  };
                }
                return entryField;
              })
            };
          }
          return entry;
        })
      };
    }
    case 'rename-group':
      return {
        ...state,
        groups: state.groups.map(group => {
          if (group.id === action.groupID) {
            return {
              ...group,
              title: action.title
            };
          }
          return group;
        })
      };
    case 'move-group':
      return {
        ...state,
        groups: state.groups.map(group => {
          if (group.id === action.groupID) {
            return {
              ...group,
              parentID: action.parentID
            };
          }
          return group;
        })
      };
    case 'batch-delete':
      return {
        ...state,
        groups: state.groups.filter(group => action.groups.includes(group.id) === false),
        entries: state.entries.filter(entry => action.entries.includes(entry.id) === false)
      };
  }
}

export function filterReducer(state, action) {
  switch (action.type) {
    case 'set-term':
      return {
        ...state,
        term: action.term
      };
    case 'set-sort-mode':
      return {
        ...state,
        sortMode: action.sortMode
      };
  }
}

export const defaultFilter = {
  term: '',
  sortMode: 'az'
};

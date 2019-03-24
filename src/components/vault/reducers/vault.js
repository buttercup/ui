import uuid from 'uuid/v4';

export function vaultReducer(state, action) {
  switch (action.type) {
    case 'save-entry': {
      const { entry } = action;
      if (entry.id) {
        const existingEntry = state.entries.find(e => e.id === entry.id);
        if (!existingEntry) {
          throw new Error(`Failed saving entry changes: Unable to find entry with ID: ${entry.id}`);
        }
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
        entries: [
          ...state.entries,
          {
            ...entry,
            id: uuid()
          }
        ]
      };
    }
    case 'delete-entry':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.entryID)
      };
  }
}

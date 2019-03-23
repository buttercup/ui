import { createFieldDescriptor } from '@buttercup/facades';

export function entryReducer(state, action) {
  // return state;
  switch (action.type) {
    case 'set-entry':
      return action.payload;
    case 'stop-editing':
      return null;
    case 'add-field': {
      const field = createFieldDescriptor(null, '', 'property', '', {
        removeable: true
      });
      return {
        ...state,
        fields: [...state.fields, field]
      };
    }
    case 'remove-field':
      return {
        ...state,
        fields: state.fields.filter(field => field.id !== action.field.id)
      };
    case 'update-field': {
      const { field: changedField, value, property } = action;
      return {
        ...state,
        fields: state.fields.map(field => {
          if (field.id === changedField.id) {
            return { ...field, value: value || field.value, property: property || field.property };
          }
          return field;
        })
      };
    }
    default:
      return state;
  }
}

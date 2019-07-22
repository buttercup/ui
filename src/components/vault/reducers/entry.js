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
            const newValue = typeof value === 'string' ? value : field.value;
            const newProperty = typeof property === 'string' ? property : field.property;
            return { ...field, value: newValue, property: newProperty };
          }
          return field;
        })
      };
    }
    case 'set-field-value-type': {
      const { field: changedField, valueType } = action;
      return {
        ...state,
        fields: state.fields.map(field => {
          if (field.id === changedField.id) {
            console.log('MATCHED', field);
            return { ...field, valueType };
          }
          return field;
        })
      };
    }
  }
}

import { pathOr } from 'ramda';

// http://stackoverflow.com/a/6150060/172805
export function selectElementContents(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function getFacadeField(facade, fieldName) {
  const field = facade.fields.find(
    field => field.field === 'property' && field.property === fieldName.toLowerCase()
  );
  return field ? field.value : null;
}

export function getThemeProp(props, propName, defaultValue) {
  return pathOr(defaultValue, ['theme', ...propName.split('.')], props);
}

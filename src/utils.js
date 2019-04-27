import React from 'react';
import { pathOr } from 'ramda';

// http://stackoverflow.com/a/6150060/172805
export function selectElementContents(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function copyToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

export const generateHighlightedText = (text, regions) => {
  if (!regions) return text;

  const content = [];
  let nextUnhighlightedRegionStartingIndex = 0;

  for (let region of regions) {
    const [start, end] = region;
    content.push(
      text.substring(nextUnhighlightedRegionStartingIndex, start),
      <mark>{text.substring(start, end + 1)}</mark>
    );
    nextUnhighlightedRegionStartingIndex = end + 1;
  }
  content.push(text.substring(nextUnhighlightedRegionStartingIndex));

  return (
    <>
      {content.map((text, i) => (
        <span key={i}>{text}</span>
      ))}
    </>
  );
};

export function getFacadeField(facade, fieldName, matches) {
  const fieldIndex = facade.fields.findIndex(
    field => field.field === 'property' && field.property === fieldName.toLowerCase()
  );
  if (fieldIndex < 0) {
    return `No ${fieldName}`;
  }

  const field = facade.fields[fieldIndex];
  let value = field.value;
  if (Array.isArray(matches)) {
    const match = matches.find(match => match.arrayIndex === fieldIndex);
    if (match) {
      return generateHighlightedText(value, match.indices);
    }
  }

  return value;
}

export function getThemeProp(props, propName, defaultValue) {
  return pathOr(defaultValue, ['theme', ...propName.split('.')], props);
}

// http://stackoverflow.com/a/6150060/172805
export function selectElementContents(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  sel.removeAllRanges();
  sel.addRange(range);
}

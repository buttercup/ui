import path from 'path';
import { getIconFilename } from '@buttercup/iconographer/web/iconographer.js';

let __iconsContext = null;

export function getIconForDomain(domain) {
  prepareIcons();
  const iconFilename = path.basename(getIconFilename(domain));
  const contextKey = __iconsContext
    .keys()
    .find(depFilename => path.basename(depFilename) === iconFilename);
  if (!contextKey) {
    return null;
  }
  return __iconsContext(contextKey).default;
}

function prepareIcons() {
  if (!__iconsContext) {
    __iconsContext = require.context('@buttercup/iconographer/web/images', false, /\.(png)$/);
  }
}

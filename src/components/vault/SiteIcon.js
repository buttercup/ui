import React from 'react';
import { getIconForDomain } from './icons.js';

export default props => <img {...props} src={getIconForDomain(props.domain || null)} />;

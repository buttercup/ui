import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { DEFAULT_ENTRY_TYPE, EntryType } from 'buttercup/web';
import path from 'path-posix';
import ICON_LOGIN from '../../../resources/icons/login.png';
import ICON_WEBSITE from '../../../resources/icons/website.png';
import ICON_NOTE from '../../../resources/icons/note.png';
import ICON_SSH from '../../../resources/icons/ssh.png';
import ICON_CREDITCARD from '../../../resources/icons/credit-card.png';

const DYNAMIC_STATE_FAILED = 2;
const DYNAMIC_STATE_LOADED = 1;
const DYNAMIC_STATE_LOADING = 0;
const ICON_LOOKUP = 'https://icon.buttercup.pw/icon/';
const ICON_TYPES = {
  [EntryType.Login]: ICON_LOGIN,
  [EntryType.Website]: ICON_WEBSITE,
  [EntryType.SSHKey]: ICON_SSH,
  [EntryType.Note]: ICON_NOTE,
  [EntryType.CreditCard]: ICON_CREDITCARD
};
const NOOP = () => {};

const FallbackIcon = styled.img`
  opacity: ${props => (props.dynamicLoading ? '0.5' : '1.0')};
`;
const IconContainer = styled.div`
  position: relative;
  > img {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export default function SiteIcon(props) {
  const { className, domain = null, iconPath = null, type = DEFAULT_ENTRY_TYPE } = props;
  const imgRef = useRef(null);
  const [dynamicState, setDynamicState] = useState(DYNAMIC_STATE_LOADING);
  const onImgError = useMemo(
    () => () => {
      if (!imgRef.current) return;
      imgRef.current.removeEventListener('error', onImgError);
      imgRef.current.removeEventListener('load', onImgLoad);
      setDynamicState(DYNAMIC_STATE_FAILED);
    },
    [imgRef.current]
  );
  const onImgLoad = useMemo(
    () => () => {
      if (!imgRef.current) return;
      imgRef.current.removeEventListener('error', onImgError);
      imgRef.current.removeEventListener('load', onImgLoad);
      setDynamicState(DYNAMIC_STATE_LOADED);
    },
    [imgRef.current]
  );
  useEffect(() => {
    if (!domain) {
      setDynamicState(DYNAMIC_STATE_FAILED);
      return NOOP;
    }
    if (!imgRef.current) return NOOP;
    imgRef.current.addEventListener('error', onImgError);
    imgRef.current.addEventListener('load', onImgLoad);
    imgRef.current.setAttribute('src', `${ICON_LOOKUP}${encodeURIComponent(domain)}`);
  }, [imgRef.current]);
  return (
    <IconContainer className={className}>
      <If
        condition={dynamicState === DYNAMIC_STATE_LOADED || dynamicState === DYNAMIC_STATE_LOADING}
      >
        <img ref={imgRef} loading="lazy" />
      </If>
      <If
        condition={dynamicState === DYNAMIC_STATE_FAILED || dynamicState === DYNAMIC_STATE_LOADING}
      >
        <FallbackIcon
          src={iconPath ? path.join(iconPath, path.basename(ICON_TYPES[type])) : ICON_TYPES[type]}
          dynamicLoading={dynamicState === DYNAMIC_STATE_LOADING}
        />
      </If>
    </IconContainer>
  );
}

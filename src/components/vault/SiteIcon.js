import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import DEFAULT_IMAGE from '../../../resources/icons/site-default.png';

const DYNAMIC_STATE_FAILED = 2;
const DYNAMIC_STATE_LOADED = 1;
const DYNAMIC_STATE_LOADING = 0;
const ICON_LOOKUP = 'https://icon.buttercup.pw/icon/';
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
  const { domain = null } = props;
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
    <IconContainer>
      <If
        condition={dynamicState === DYNAMIC_STATE_LOADED || dynamicState === DYNAMIC_STATE_LOADING}
      >
        <img ref={imgRef} />
      </If>
      <If
        condition={dynamicState === DYNAMIC_STATE_FAILED || dynamicState === DYNAMIC_STATE_LOADING}
      >
        <FallbackIcon src={DEFAULT_IMAGE} dynamicLoading={dynamicState === DYNAMIC_STATE_LOADING} />
      </If>
    </IconContainer>
  );
}

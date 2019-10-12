import React from 'react';
import { ReflexContainer, ReflexSplitter } from 'react-reflex';
import styled from 'styled-components';
import { Classes, Overlay } from '@blueprintjs/core';
import classNames from 'classnames';
import GroupsList from './GroupsList';
import EntriesList from './EntriesList';
import EntryDetails from './EntryDetails';
import { Pane } from './Pane';
import { getThemeProp } from '../../utils';
import { useSharing } from './hooks/vault';

const Container = styled(ReflexContainer)`
  background-color: ${p => getThemeProp(p, 'colors.uiBackground')};
`;

export default () => {
  const {
    onRequestShareOptions,
    setShareDialogOpen,
    shareDialogOpen,
    shareOptions,
    sharingEnabled
  } = useSharing();
  const overlayClasses = classNames(Classes.CARD, Classes.ELEVATION_4);
  return (
    <>
      <Container orientation="vertical">
        <Pane size={300} minSize={200}>
          <GroupsList />
        </Pane>

        <ReflexSplitter className="reflex-thin" />

        <Pane size={300} minSize={200}>
          <EntriesList />
        </Pane>

        <ReflexSplitter className="reflex-thin" />

        <Pane minSize={400} autoGrow>
          <EntryDetails />
        </Pane>
      </Container>
      <Overlay
        isOpen={shareDialogOpen}
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        onClose={() => setShareDialogOpen(false)}
      >
        <div className={overlayClasses}>
          <h3>Test</h3>
        </div>
      </Overlay>
    </>
  );
};

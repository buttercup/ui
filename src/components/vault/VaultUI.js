import React from 'react';
import { ReflexContainer, ReflexSplitter } from 'react-reflex';
import styled from 'styled-components';
import GroupsList from './GroupsList';
import EntriesList from './EntriesList';
import EntryDetails from './EntryDetails';
import { Pane } from './Pane';
import { getThemeProp } from '../../utils';

const Container = styled(ReflexContainer)`
  background-color: ${p => getThemeProp(p, 'colors.uiBackground')};
`;

export default () => {
  return (
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
  );
};

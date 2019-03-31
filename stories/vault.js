import React, { Component } from 'react';
import styled from 'styled-components';
import { Archive, Entry } from 'buttercup';
import { ThemeProvider } from 'styled-components';
import { createArchiveFacade } from '@buttercup/facades';
import { VaultProvider, VaultUI, themes } from '../src/index';

function createArchive() {
  const archive = Archive.createWithDefaults();
  const [general] = archive.findGroupsByTitle('General');
  general
    .createEntry('Home wi-fi')
    .setProperty('username', 'somehow')
    .setProperty('password', 'x8v@mId01')
    .setProperty('url', 'https://google.com');
  general
    .createEntry('Gate lock combination')
    .setProperty('username', 'test')
    .setProperty('password', '4812');
  for (let i = 0; i < 20; i++) {
    general
      .createEntry('Gate lock combination ' + i)
      .setProperty('username', 'test')
      .setProperty('password', '4812');
  }
  const notes = archive.createGroup('Notes');
  notes
    .createEntry('Meeting notes 2019-02-01')
    .setAttribute(Entry.Attributes.FacadeType, 'note')
    .setProperty(
      'note',
      'Team meeting\n\n - Cool item created\n   - To be released sometime\n   - Costs $$$\n - Bug found, oh noes\n   - Fire Tim\n   - Bye Tim!\n - Success ✌️\n\nAll done.\n'
    );
  notes.createGroup('Meetings');
  const personal = notes.createGroup('Personal');
  personal.createGroup('Test');
  return archive;
}

const View = styled.div`
  height: calc(100vh - 1rem);
  width: 100%;
`;

export default class VaultStory extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      facade: createArchiveFacade(createArchive())
    };
  }

  render() {
    return (
      <ThemeProvider theme={themes.light}>
        <View>
          <VaultProvider
            vault={this.state.facade}
            onUpdate={vault => this.setState({ facade: vault })}
          >
            <VaultUI />
          </VaultProvider>
        </View>
      </ThemeProvider>
    );
  }
}

import React, { Component } from 'react';
import styled from 'styled-components';
import { Archive } from 'buttercup';
import { createArchiveFacade } from '@buttercup/facades';
import { Vault } from '../src';

function createArchive() {
  const archive = Archive.createWithDefaults();
  const [general] = archive.findGroupsByTitle('General');
  general
    .createEntry('Home wi-fi')
    .setProperty('username', '-')
    .setProperty('password', 'x8v@mId01');
  general.createEntry('Gate lock combination').setProperty('password', '4812');
  return archive;
}

const View = styled.div`
  width: 300px;
`;

export default class VaultStory extends Component {
  constructor(...args) {
    super(...args);
    this.facade = createArchiveFacade(createArchive());
  }

  render() {
    return (
      <View>
        <Vault vault={this.facade} />
      </View>
    );
  }
}

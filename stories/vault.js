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
    .createEntry('Social website')
    .setProperty('username', 'user@test.com')
    .setProperty('password', 'vdfs867sd5')
    .setProperty(
      'otpURI',
      'otpauth://totp/ACME:AzureDiamond?issuer=ACME&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30'
    )
    .setProperty(
      'otpURL',
      'otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30'
    )
    .setAttribute(Entry.Attributes.TOTPProperty, 'otpURI')
    .setProperty('url', 'https://site.com')
    .setProperty('Recovery pin', '1234');
  general
    .createEntry('Gate lock combination')
    .setProperty('username', 'test')
    .setProperty('password', '4812');
  for (let i = 0; i < 20; i++) {
    general
      .createEntry('Gate lock combination ' + i)
      .setProperty('username', 'test')
      .setProperty('password', '4812')
      .setProperty(
        'url',
        'https://www.amazon.com/ap/signin?openid.assoc_handle=aws&openid.return_to=https%3A%2F%2Fsignin.aws.amazon.com%2Foauth%3Fresponse_type%3Dcode%26client_id%3Darn%253Aaws%253Aiam%253A%253A015428540659%253Auser%252Fhomepage%26redirect_uri%3Dhttps%253A%252F%252Feu-west-1.console.aws.amazon.com%252Fconsole%252Fhome%253Fregion%253Deu-west-1%2526state%253DhashArgs%252523%2526isauthcode%253Dtrue%26noAuthCookie%3Dtrue&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&action=&disableCorpSignUp=&clientContext=&marketPlaceId=&poolName=&authCookies=&pageId=aws.ssop&siteState=registered%2Cen_US&accountStatusPolicy=P1&sso=&openid.pape.preferred_auth_policies=MultifactorPhysical&openid.pape.max_auth_age=120&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&server=%2Fap%2Fsignin%3Fie%3DUTF8&accountPoolAlias=&forceMobileApp=0&language=en_US&forceMobileLayout=0'
      );
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

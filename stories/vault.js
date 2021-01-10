import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  AttachmentManager,
  Credentials,
  Entry,
  EntryPropertyValueType,
  EntryType,
  VaultFormatA,
  VaultFormatB,
  VaultSource,
  VaultManager,
  consumeVaultFacade,
  createVaultFacade,
  init as initButtercup,
  setDefaultFormat
} from 'buttercup/web';
import { ThemeProvider } from 'styled-components';
import randomWords from 'random-words';
import { VaultProvider, VaultUI, themes } from '../src/index';

import ATTACHMENT_BLOB from './resources/attachment.blob.dat';
import ATTACHMENT_IMG from './resources/attachment.png.dat';

try {
  initButtercup();
} catch (err) {}

function arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

async function createArchive(vault, source) {
  const [general] = vault.findGroupsByTitle('General');
  general
    .createEntry('Home wi-fi')
    .setProperty('username', 'somehow')
    .setProperty('password', 'idsfio49v-1')
    .setProperty('password', 'h78.dI2m;110')
    .setProperty('password', '[5LC-j_"C7b;"nbn')
    .setProperty('password', '8rE7=Xkm<z5~b/[Q')
    .setProperty('password', 'ReGKd4H5?D5;=y~D')
    .setProperty('password', 'f>ZSh-,!Ly7Hrd&:Cv^@~,d')
    .setProperty('password', '7#eELw%GS^)/"')
    .setProperty('password', 'K3"J8JSKHk|5hwks_^')
    .setProperty('password', 'x8v@mId01')
    .setProperty('url', 'https://google.com');
  general
    .createEntry('Social')
    .setProperty('title', 'Social website')
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
    .setAttribute(`${Entry.Attributes.FieldTypePrefix}otpURI`, EntryPropertyValueType.OTP)
    .setProperty('url', 'https://site.com/setup/create-account.php?token=123')
    .setProperty('url', 'https://site.com/login.php')
    .setProperty('url', 'https://joinmastodon.org/')
    .setProperty('Recovery pin', '1234');
  general
    .createEntry('Gate lock combination')
    .setProperty('username', 'test')
    .setProperty('password', '4812')
    .setProperty('password', 'passw0rd');
  general
    .createEntry('Shopping - Tues')
    .setProperty(
      'note',
      'Coke\nMusli\nMilk (full cream)\nCheese\nAvocado\n\nBread\nBagels\nMince\nJuice'
    )
    .setAttribute(Entry.Attributes.FacadeType, EntryType.Note);
  general
    .createEntry("Joan's Mastercard")
    .setProperty('username', 'Joan Origami')
    .setProperty('password', '5500 0000 0000 0004')
    .setProperty('type', 'mastercard')
    .setProperty('cvv', '019')
    .setProperty('valid_from', '02/2019')
    .setProperty('expiry', '02/2022')
    .setAttribute(Entry.Attributes.FacadeType, EntryType.CreditCard);
  general
    .createEntry('Home server')
    .setProperty(
      'publicKey',
      'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCAD2P7ez3arza7Vx7kUr0L42Q+efTCd2v+YbPUx1gDUT+dSwQjIheOXf1pjYZcgyK7fLfD7hVDf9DHHW6zL++WEBPQDtxRwwh/QcJOPGQF91VDfz/w5Ve/LfSX4DOy+Grk4NCTKEYlyue7LmyZUyyBesWVja9hAolQYZaurQCoWtiDF49vUUHGX9/H89f14eJUh5/RPELJyc2SteLMT+qVaPZYtMCk2lA7cvwaQjvmhrhea4sLdFp5fuHvng7rP24pRjqoBD+s81K3jpNXc0UmP4A1lQOqPz1NtCWX2QqLnyc2ESk76Y8q2P2eux5ZHo43TpQo6jO9vi1QN9/+bxFZ '
    )
    .setProperty(
      'privateKey',
      '-----BEGIN RSA PRIVATE KEY-----\nProc-Type: 4,ENCRYPTED\nDEK-Info: DES-EDE3-CBC,DA075FA7F84053C8\n\n3N+r51y+rS/ZLRquGTckU93Wt6gMSe9yznmk0Z+hmSmaxzLJHPdpXRozeSQDHqyl\nQCRX0IrL9zrHD0Eqg5SdhgFX3SOCN+uOLtXKoZpSkq39mcAMdE7pMDam/WAmuV63\ndaq45k8D9h4XmlTZb1/2TYdZpFpaN5H7xtOiY0SSd+6GmvMadRVuKcQmSAtcLv6I\nPYmdmDFEwVHxSZYB2u4Vn9brW+EDmKZi74EsrGUu5n80wVvTArssEl5sTZFJ9Uho\nVDySb8OtldCWLKee1ntRa01cp4VaW3X1ikt/46X18zGDie6uinUovExCPO/NWmen\nZIjsQs44nNih5WGYfYvj4Zk36ly9EnMf0GiPrGu2lisz6oup2zqBtSHoAShs+OSy\nFmQYHesMsaXkI1tcxuKAkC8Hsu8/4xePFil5O9NryC6MA/q5/L+6FbGX0Vu3e15s\neYZlVk39GfwuOjnZ2nzVKAm1bNINtz1OEyezFoejk3oFVyBt2NZD87oGgcZ17t1j\nW18cmFhwDHrPJqosI7A0RlUOyxPCoXZk44Kvi7B8N0Soz1x6zoX3rxu3m2SUs0YW\n14GWOUCux2vQqCCpvGtXh2WCNzZJ6ihbKR4nbvpwhfTTaPaPy9/6rYXIV7ZEgTBm\n2dW+0vunC6MfMtha+u+9L8Ut3SizT30nz2FMAWT9ymcaZMOIUWPBHJ6TPq1xIali\n3rvdSsM9iaAv4MrcoTwpcOU0NN8iLTiuUXRi8dQKnPmgoCZJh4WDZMLYFU+R7E7A\ndSzH72FdiKmu894lN6TNe2BzAkYkehcRDmSCULJN8KjLZX3GzIr2/UaKOorvktwB\n9nsbp3hNHIbQv9QmNtyqwkzq8w8JAQHeF10Q2OBnd/+BAO3XyM8K3GpAXV4gSDF7\nIJorwUWUg9fauCy7V1OwgAGJJFH1IVGwSxBUcd/FjnxGU9qf/By2Fu7qIGZ95621\nUtGOvaI9ManBlYRUct3AWBu1tJG6doSqpC9/APQBRUqwkaqLaFZRFayCevl26E+7\ngWK1LsSNWIZTogyB5Ywr0rLzuKgVIcPPBbpOB/u7w2XERZk3EmhOiuSO4IfLNpmZ\nqeEuKEpPmzKd4jDlp1sMWVz5OzoGsU3SzbsDR7WdMlIy3EWYTq/I7I0chhgrhJGc\nHst1YQ9du4BGxzWHXrPkI/vTd4LlIqet8TOasyUKqK9IKAZ92W8PcAlxzDhnVcmA\nG1TGxFmNqOz1tL9jrqxOziWTaTir36z0MB2+8+EF4Fg+UjaQ0yIwB0O9o6BLvMxZ\nd6pcacIdDRCNAizafxS8ez62Stvzao0ylEd69l/4JsHTgkco7AGfmOyU72FRSTzh\n2lfdWJmRn/e0c47WQE+2dPNiiqYEFhqOTStTZL5oN0c/bgn+Ke0fd6CzGQ7sED6m\nTQyzVL9XOegMMV6BF9pLa9mG3rzDjM18I4w0PtrlRsZijnWxCMjsaJg0rG/49n/k\n79Vzpdy/DF/ojN/y1JQKgz7KbGf9eYsC8n22LbJWVUinBNiFlSpViSPfSYIugQsI\n306CDDo1/UoSq/s1ezGDZK8+gMiZUPOslyl9E3R2T/F54wbtyRVpdw==\n-----END RSA PRIVATE KEY-----\n'
    )
    .setAttribute(Entry.Attributes.FacadeType, EntryType.SSHKey);
  const attachmentEntry = general
    .createEntry('Entry w/ Attachments')
    .setProperty('username', 'jsc@test.org')
    .setProperty('password', '34n54mlflml3')
    .setProperty('url', 'https://test.com')
    .setProperty('PIN', '1200')
    .setAttribute(Entry.Attributes.FacadeType, EntryType.Website);
  await source.attachmentManager.setAttachment(
    attachmentEntry,
    AttachmentManager.newAttachmentID(),
    ATTACHMENT_IMG,
    'my-image.png',
    'image/png'
  );
  await source.attachmentManager.setAttachment(
    attachmentEntry,
    AttachmentManager.newAttachmentID(),
    ATTACHMENT_BLOB,
    'special-file.blob',
    'application/octet-stream'
  );
  const notes = vault.createGroup('Notes');
  notes
    .createEntry('Meeting notes 2019-02-01')
    .setAttribute(Entry.Attributes.FacadeType, EntryType.Note)
    .setProperty(
      'note',
      'Team meeting\n\n - Cool item created\n   - To be released sometime\n   - Costs $$$\n - Bug found, oh noes\n   - Fire Tim\n   - Bye Tim!\n - Success ✌️\n\nAll done.\n'
    );
  notes.createGroup('Meetings');
  const personal = notes.createGroup('Personal');
  personal.createGroup('Test');
  return vault;
}

function createArchiveFacade(vault) {
  return JSON.parse(JSON.stringify(createVaultFacade(vault)));
}

async function createHeavyArchive(vault) {
  const groupCount = 15;
  const depth = 1;
  const entryCount = 20;
  (function createAtLevel(cont, lvl = 0) {
    for (let g = 0; g < groupCount; g += 1) {
      const group = cont.createGroup(randomWords());
      for (let e = 0; e < entryCount; e += 1) {
        const entry = group.createEntry(randomWords(2).join(' '));
        entry.setProperty('username', randomWords(2).join('.'));
        entry.setProperty('password', randomWords(4).join('-'));
        entry.setProperty('URL', `https://${randomWords(3).join('.')}.com`);
      }
      if (lvl < depth) {
        createAtLevel(group, lvl + 1);
      }
    }
  })(vault);
  return vault;
}

function processVaultUpdate(archive, facade) {
  consumeVaultFacade(archive, facade);
  const out = createVaultFacade(archive);
  return out;
}

const View = styled.div`
  height: calc(100vh - 1rem);
  width: 100%;
`;

function VaultRender({ formatB = false, dark = false, basic = true, icons = true } = {}) {
  const [vaultManager, setVaultManager] = useState(null);
  const [archiveFacade, setArchiveFacade] = useState(null);
  const [attachmentPreviews, setAttachmentPreviews] = useState({});
  const deleteAttachment = useCallback(
    async (entryID, attachmentID) => {
      const source = vaultManager.sources[0];
      const entry = source.vault.findEntryByID(entryID);
      await source.attachmentManager.removeAttachment(entry, attachmentID);
      setArchiveFacade(createArchiveFacade(source.vault));
    },
    [attachmentPreviews, vaultManager]
  );
  const downloadAttachment = useCallback(
    async (entryID, attachmentID) => {
      const source = vaultManager.sources[0];
      const entry = source.vault.findEntryByID(entryID);
      const attachmentDetails = await source.attachmentManager.getAttachmentDetails(
        entry,
        attachmentID
      );
      const attachmentData = await source.attachmentManager.getAttachment(entry, attachmentID);
      // Download
      const blob = new Blob([attachmentData], { type: attachmentDetails.type });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = attachmentDetails.name;
      document.body.appendChild(anchor);
      anchor.click();
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        document.body.removeChild(anchor);
      }, 0);
    },
    [vaultManager]
  );
  const previewAttachment = useCallback(
    async (entryID, attachmentID) => {
      if (attachmentPreviews[attachmentID]) return;
      const source = vaultManager.sources[0];
      const entry = source.vault.findEntryByID(entryID);
      const attachmentData = await source.attachmentManager.getAttachment(entry, attachmentID);
      setAttachmentPreviews({
        ...attachmentPreviews,
        [attachmentID]: arrayBufferToBase64(attachmentData)
      });
    },
    [attachmentPreviews, vaultManager]
  );
  useEffect(() => {
    async function createVaultManager() {
      if (formatB) {
        setDefaultFormat(VaultFormatB);
      } else {
        setDefaultFormat(VaultFormatA);
      }
      const manager = new VaultManager();
      const creds = Credentials.fromDatasource(
        {
          type: 'memory',
          property: 'test'
        },
        'test'
      );
      const credStr = await creds.toSecureString();
      const source = new VaultSource('test', 'memory', credStr);
      await manager.addSource(source);
      await source.unlock(Credentials.fromPassword('test'), { initialiseRemote: true });
      const { vault } = source;
      if (basic) {
        await createArchive(vault, source);
      } else {
        await createHeavyArchive(vault);
      }
      await source.save();
      setVaultManager(manager);
      setArchiveFacade(createArchiveFacade(vault));
    }
    createVaultManager();
  }, []);
  return (
    <View className={dark ? 'bp3-dark' : ''}>
      <ThemeProvider theme={dark ? themes.dark : themes.light}>
        <If condition={archiveFacade}>
          <VaultProvider
            vault={archiveFacade}
            attachments
            attachmentPreviews={attachmentPreviews}
            icons={icons}
            onAddAttachments={async (entryID, files) => {
              const source = vaultManager.sources[0];
              const entry = source.vault.findEntryByID(entryID);
              for (const file of files) {
                const buff = await file.arrayBuffer();
                await source.attachmentManager.setAttachment(
                  entry,
                  AttachmentManager.newAttachmentID(),
                  buff,
                  file.name,
                  file.type || 'application/octet-stream'
                );
              }
              setArchiveFacade(createVaultFacade(source.vault));
            }}
            onDeleteAttachment={deleteAttachment}
            onDownloadAttachment={downloadAttachment}
            onPreviewAttachment={previewAttachment}
            onUpdate={vaultFacade => {
              console.log('Saving vault...');
              const source = vaultManager.sources[0];
              setArchiveFacade(processVaultUpdate(source.vault, vaultFacade));
            }}
          >
            <VaultUI />
          </VaultProvider>
        </If>
      </ThemeProvider>
    </View>
  );
}

export const BasicVault = () => <VaultRender />;

export const BasicVaultFormatB = () => <VaultRender formatB />;

export const BasicVaultNoIcons = () => <VaultRender icons={false} />;

export const BasicDarkVault = () => <VaultRender dark />;

export const HeavyVault = () => <VaultRender basic={false} />;

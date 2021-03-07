import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import TextArea from 'react-textarea-autosize';
import { useDropzone } from 'react-dropzone';
import {
  Button,
  ButtonGroup,
  Card,
  Classes,
  ControlGroup,
  Dialog,
  Drawer,
  EditableText,
  HTMLSelect,
  Icon,
  InputGroup,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  NonIdealState,
  Popover,
  Position,
  Text
} from '@blueprintjs/core';
import { Entry, EntryChangeType, EntryPropertyValueType, EntryType } from 'buttercup/web';
import { FormattedInput, FormattedText } from '@buttercup/react-formatted-input';
import formatBytes from 'xbytes';
import { useCurrentEntry, useGroups } from './hooks/vault';
import { PaneContainer, PaneContent, PaneHeader, PaneFooter } from './Pane';
import { VaultContext } from './Vault';
import ConfirmButton from './ConfirmButton';
import OTPDigits from '../OTPDigits';
import ErrorBoundary from './ErrorBoundary';
import { copyToClipboard, getThemeProp } from '../../utils';
import CreditCard from './CreditCard';
import { useTranslations } from '../../hooks/i18n';

const ENTRY_ATTACHMENT_ATTRIB_PREFIX = Entry.Attributes.AttachmentPrefix;
const FIELD_TYPE_OPTIONS = [
  { type: EntryPropertyValueType.Text, title: 'text', icon: 'italic' },
  { type: EntryPropertyValueType.Note, title: 'note', icon: 'align-left' },
  { type: EntryPropertyValueType.Password, title: 'password', icon: 'key' },
  { type: EntryPropertyValueType.OTP, title: 'otp', icon: 'time' }
];

function iconName(mimeType) {
  if (/^image\//.test(mimeType)) {
    return 'media';
  }
  return 'document';
}

function mimeTypePreviewable(mimeType) {
  if (/^image\//.test(mimeType)) {
    return true;
  }
  return false;
}

function title(entry, untitledText) {
  const titleField = entry.fields.find(
    item => item.propertyType === 'property' && item.property === 'title'
  );
  return titleField ? titleField.value : <i>{untitledText}</i>;
}

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;

  > div button {
    margin-right: 10px;
  }
`;
const AttachmentDropInstruction = styled.div`
  padding: 20px;
  width: 100%;
  border: 2px dashed ${p => getThemeProp(p, 'attachment.dropBorder')};
  border-radius: 6px;
  background-color: ${p => getThemeProp(p, 'attachment.dropBackground')};
  font-style: italic;
  text-align: center;
  color: ${p => getThemeProp(p, 'attachment.dropText')};
`;
const AttachmentDropZone = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.85);
  display: ${props => (props.visible ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > span {
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
  }
`;
const AttachmentInfoContainer = styled.div`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;
const AttachmentItem = styled(Card)`
  margin: 4px !important;
  padding: 4px !important;
  width: 104px;
  height: 110px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
const AttachmentItemSize = styled.div`
  width: 100%;
  overflow: hidden;
  text-align: center;
  font-size: 10px;
  user-select: none;
  color: #888;
`;
const AttachmentItemTitle = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-size: 11px;
  user-select: none;
`;
const AttachmentPreviewContainer = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: black;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const AttachmentPreviewImage = styled.img`
  max-height: 100%;
  max-width: 100%;
`;
const AttachmentsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
`;
const ValueWithNewLines = styled.span`
  white-space: pre-wrap;
`;
const FormContainer = styled.div`
  background-color: ${p => (p.primary ? getThemeProp(p, 'entry.primaryContainer') : 'transparent')};
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
`;
const CustomFieldsHeading = styled.h5`
  text-transform: uppercase;
  color: ${p => getThemeProp(p, 'entry.separatorTextColor')};
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  margin-bottom: 0;

  &:before,
  &:after {
    display: flex;
    content: '';
    height: 1px;
    background-color: ${p => getThemeProp(p, 'entry.separatorBorder')};
    width: 100%;
  }

  span {
    padding: 0 0.5rem;
  }
`;
const FieldRowContainer = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
`;
const FieldRowLabel = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${p => getThemeProp(p, 'entry.separatorTextColor')};
  width: 100px;
  margin-right: 1rem;
`;
const FieldRowChildren = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  flex: 1;

  ${`.${Classes.CONTROL_GROUP}`} {
    flex: 1;
  }
`;

const FieldTextToolbar = styled(ButtonGroup)`
  margin-left: 0.5rem;
  opacity: 0;
`;
const FieldTextWrapper = styled.span`
  border: 1px dashed transparent;
  border-radius: 2px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  word-break: break-all;
  pointer-events: ${p => (p.disabled ? 'none' : 'all')};

  &:hover {
    border-color: ${p => (p.disabled ? 'transparent' : getThemeProp(p, 'entry.fieldHoverBorder'))};

    ${FieldTextToolbar} {
      opacity: ${p => (p.disabled ? 0 : 1)};
    }
  }
`;
const HistoryTable = styled.table`
  width: 100%;
`;
const HistoryScrollContainer = styled.div`
  width: 100%;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const Attachments = ({
  attachmentPreviews = {},
  entryFacade,
  onDeleteAttachment = () => {},
  onDownloadAttachment = () => {},
  onPreviewAttachment = () => {},
  readOnly = false
}) => {
  const t = useTranslations();
  const [deletingAttachment, setDeletingAttachment] = useState(null);
  const [previewingAttachment, setPreviewingAttachment] = useState(null);
  const onAttachmentItemClick = useCallback((evt, attachment) => {
    evt.stopPropagation();
    setPreviewingAttachment(attachment);
  }, []);
  const attachments = entryFacade.fields.reduce((output, field) => {
    if (
      field.propertyType !== 'attribute' ||
      field.property.indexOf(ENTRY_ATTACHMENT_ATTRIB_PREFIX) !== 0
    ) {
      return output;
    }
    const attachment = JSON.parse(field.value);
    return [
      ...output,
      {
        ...attachment,
        sizeEncFriendly: formatBytes(attachment.sizeEncrypted, { iec: true }),
        sizeOrigFriendly: formatBytes(attachment.sizeOriginal, { iec: true }),
        icon: iconName(attachment.type)
      }
    ];
  }, []);
  return (
    <AttachmentsContainer>
      <If condition={attachments.length === 0}>
        <AttachmentDropInstruction>{t('attachments.drop-instruction')}</AttachmentDropInstruction>
      </If>
      <For each="attachment" of={attachments}>
        <AttachmentItem
          key={attachment.id}
          title={attachment.name}
          onClick={evt => {
            onPreviewAttachment(attachment);
            onAttachmentItemClick(evt, attachment);
          }}
        >
          <Icon icon={attachment.icon} iconSize={56} color="rgba(0,0,0,0.6)" />
          <AttachmentItemSize>{attachment.sizeEncFriendly}</AttachmentItemSize>
          <AttachmentItemTitle>{attachment.name}</AttachmentItemTitle>
        </AttachmentItem>
      </For>
      <Drawer
        icon={(previewingAttachment && previewingAttachment.icon) || undefined}
        isOpen={previewingAttachment}
        onClose={() => setPreviewingAttachment(null)}
        position={Position.RIGHT}
        size="45%"
        title={(previewingAttachment && previewingAttachment.name) || ''}
      >
        <If condition={previewingAttachment}>
          <AttachmentInfoContainer className={Classes.DRAWER_BODY}>
            <If condition={mimeTypePreviewable(previewingAttachment.type)}>
              <AttachmentPreviewContainer
                className={attachmentPreviews[previewingAttachment.id] ? '' : Classes.SKELETON}
              >
                <If condition={attachmentPreviews[previewingAttachment.id]}>
                  <If condition={/^image\//.test(previewingAttachment.type)}>
                    <AttachmentPreviewImage
                      src={`data:${previewingAttachment.type};base64,${
                        attachmentPreviews[previewingAttachment.id]
                      }`}
                    />
                  </If>
                </If>
              </AttachmentPreviewContainer>
              <br />
            </If>
            <table className={cx(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED, Classes.SMALL)}>
              <tbody>
                <tr>
                  <td>
                    <strong>ID</strong>
                  </td>
                  <td>
                    <code>{previewingAttachment.id}</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Filename</strong>
                  </td>
                  <td>
                    <code>{previewingAttachment.name}</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Type</strong>
                  </td>
                  <td>{previewingAttachment.type}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Size</strong>
                  </td>
                  <td>{previewingAttachment.sizeOrigFriendly}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Stored</strong>
                  </td>
                  <td>{previewingAttachment.sizeEncFriendly}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Date added</strong>
                  </td>
                  <td>{previewingAttachment.created}</td>
                </tr>
              </tbody>
            </table>
          </AttachmentInfoContainer>
          <div className={Classes.DRAWER_FOOTER}>
            <Button
              intent={Intent.PRIMARY}
              onClick={() => onDownloadAttachment(previewingAttachment)}
              title={t('attachments.download-title')}
            >
              {t('attachments.download')}
            </Button>
            &nbsp;
            <Button
              intent={Intent.DANGER}
              onClick={() => setDeletingAttachment(previewingAttachment)}
              title={t('attachments.delete-title')}
              disabled={readOnly}
            >
              {t('attachments.delete')}
            </Button>
          </div>
        </If>
      </Drawer>
      <Dialog isOpen={deletingAttachment} onClose={() => setDeletingAttachment(null)}>
        <If condition={deletingAttachment}>
          <div className={Classes.DIALOG_HEADER}>
            {t('attachments.confirm.delete-prompt-title', { title: deletingAttachment.name })}
          </div>
          <div className={Classes.DIALOG_BODY}>
            {t('attachments.confirm.delete-prompt')
              .split('\n')
              .map(line => (
                <p>{line}</p>
              ))}
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                intent={Intent.DANGER}
                onClick={() => {
                  const attachmentItem = deletingAttachment;
                  setDeletingAttachment(null);
                  setPreviewingAttachment(null);
                  onDeleteAttachment(attachmentItem);
                }}
                title={t('attachments.confirm.delete-title')}
                disabled={readOnly}
              >
                {t('attachments.confirm.delete')}
              </Button>
              <Button
                onClick={() => setDeletingAttachment(null)}
                title={t('attachments.confirm.cancel-title')}
              >
                {t('attachments.confirm.cancel')}
              </Button>
            </div>
          </div>
        </If>
      </Dialog>
    </AttachmentsContainer>
  );
};

const FieldText = ({ entryFacade, field }) => {
  const [visible, toggleVisibility] = useState(false);
  const [historyDialogVisible, setHistoryDialogVisible] = useState(false);
  const otpRef = useRef(field.value);
  const { onFieldUpdateInPlace } = useCurrentEntry();
  const Element = field.valueType === EntryPropertyValueType.Password ? 'code' : 'span';
  const { _changes: history = [] } = entryFacade;
  const historyItems = useMemo(() => {
    const items = history.filter(
      item => item.property === field.property && item.type !== EntryChangeType.Deleted
    );
    return items;
  }, [history]);
  return (
    <FieldTextWrapper role="content" disabled={!field.value}>
      <Choose>
        <When condition={field.valueType === EntryPropertyValueType.OTP}>
          <OTPDigits otpURI={field.value} otpRef={value => (otpRef.current = value)} />
        </When>
        <When condition={!field.value}>
          <Text className={Classes.TEXT_MUTED}>Not set.</Text>
        </When>
        <When condition={field.valueType === EntryPropertyValueType.Note}>
          <ValueWithNewLines>{field.value}</ValueWithNewLines>
        </When>
        <When condition={field.formatting && field.formatting.options}>
          {typeof field.formatting.options === 'object'
            ? field.formatting.options[field.value] || field.value
            : field.value}
        </When>
        <Otherwise>
          <Element>
            <Choose>
              <When condition={field.valueType === EntryPropertyValueType.Password && !visible}>
                ●●●●●●●●
              </When>
              <Otherwise>
                <FormattedText
                  format={
                    field.formatting && field.formatting.format
                      ? field.formatting.format
                      : undefined
                  }
                  value={field.value || ''}
                />
              </Otherwise>
            </Choose>
          </Element>
        </Otherwise>
      </Choose>
      <FieldTextToolbar>
        <If condition={field.valueType === EntryPropertyValueType.Password}>
          <Button
            text={visible ? 'Hide' : 'Reveal'}
            small
            onClick={() => toggleVisibility(!visible)}
          />
        </If>
        <Button icon="clipboard" small onClick={() => copyToClipboard(otpRef.current)} />
        <Button
          icon="history"
          small
          disabled={historyItems.length <= 0}
          onClick={() => setHistoryDialogVisible(true)}
        />
      </FieldTextToolbar>
      <Dialog
        icon="history"
        onClose={() => setHistoryDialogVisible(false)}
        title="Entry field history"
        isOpen={historyDialogVisible}
      >
        <div className={Classes.DIALOG_BODY}>
          <HistoryScrollContainer>
            <HistoryTable className={cx(Classes.HTML_TABLE, Classes.HTML_TABLE_CONDENSED)}>
              <thead>
                <tr>
                  <th>Previous Value</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <For each="change" of={historyItems} index="idx">
                  <tr key={`history-${idx}`}>
                    <td>
                      <code>{change.value}</code>
                    </td>
                    <td>
                      <If condition={change.ts}>
                        {new Date(change.ts).toLocaleTimeString()}{' '}
                        {new Date(change.ts).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric'
                        })}
                      </If>
                    </td>
                    <td>
                      <ButtonGroup>
                        <Button icon="clipboard" onClick={() => copyToClipboard(change.value)} />
                        <Button
                          icon="redo"
                          onClick={() => {
                            setHistoryDialogVisible(false);
                            onFieldUpdateInPlace(entryFacade.id, field, change.value);
                          }}
                        />
                      </ButtonGroup>
                    </td>
                  </tr>
                </For>
              </tbody>
            </HistoryTable>
          </HistoryScrollContainer>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent={Intent.PRIMARY} onClick={() => setHistoryDialogVisible(false)}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </FieldTextWrapper>
  );
};

const FieldRow = ({
  field,
  editing,
  entryFacade,
  onFieldNameUpdate,
  onFieldUpdate,
  onFieldSetValueType,
  onRemoveField
}) => {
  const t = useTranslations();
  const label =
    editing && field.removeable ? (
      <EditableText
        value={field.property}
        onChange={value => {
          onFieldNameUpdate(field, value);
        }}
      />
    ) : (
      field.title || field.property
    );
  const renderMenu = (
    <Menu>
      {/*
        The following is in the parent level due to:
          - https://github.com/palantir/blueprint/issues/2796
          - https://github.com/palantir/blueprint/issues/3010#issuecomment-443031120
      */}
      <For each="fieldTypeOption" of={FIELD_TYPE_OPTIONS}>
        <MenuItem
          key={fieldTypeOption.type}
          text={t(`custom-fields.change-type.${fieldTypeOption.title}`)}
          icon={fieldTypeOption.icon}
          labelElement={
            field.valueType === fieldTypeOption.type ? <Icon icon="small-tick" /> : null
          }
          onClick={() => {
            onFieldSetValueType(field, fieldTypeOption.type);
          }}
        />
      </For>
      <MenuDivider />
      <MenuItem
        text={t('custom-fields.delete-field')}
        icon="trash"
        onClick={() => onRemoveField(field)}
      />
    </Menu>
  );
  return (
    <FieldRowContainer>
      <If condition={!(field.valueType === EntryPropertyValueType.Note && !field.removeable)}>
        <FieldRowLabel>{label}</FieldRowLabel>
      </If>
      <FieldRowChildren>
        <Choose>
          <When condition={editing}>
            <ControlGroup>
              <Choose>
                <When condition={field.valueType === EntryPropertyValueType.Note}>
                  <TextArea
                    className={cx(Classes.INPUT, Classes.FILL)}
                    value={field.value}
                    onChange={val => onFieldUpdate(field, val.target.value)}
                  />
                </When>
                <When condition={field.formatting && field.formatting.options}>
                  <HTMLSelect
                    fill
                    defaultValue={field.value ? undefined : field.formatting.defaultOption}
                    value={field.value || undefined}
                    onChange={event => onFieldUpdate(field, event.target.value)}
                  >
                    <Choose>
                      <When condition={typeof field.formatting.options === 'object'}>
                        <For each="optionValue" of={Object.keys(field.formatting.options)}>
                          <option key={optionValue} value={optionValue}>
                            {field.formatting.options[optionValue]}
                          </option>
                        </For>
                      </When>
                      <Otherwise>
                        <For each="optionValue" of={field.formatting.options}>
                          <option key={optionValue} value={optionValue}>
                            {optionValue}
                          </option>
                        </For>
                      </Otherwise>
                    </Choose>
                  </HTMLSelect>
                </When>
                <Otherwise>
                  <FormattedInput
                    minimal
                    className={Classes.FILL}
                    element={InputGroup}
                    value={field.value}
                    onChange={(formattedValue, raw) => onFieldUpdate(field, raw)}
                    placeholder={
                      field.formatting && field.formatting.placeholder
                        ? field.formatting.placeholder
                        : field.title
                    }
                    format={
                      field.formatting && field.formatting.format
                        ? field.formatting.format
                        : undefined
                    }
                  />
                </Otherwise>
              </Choose>
              <If condition={field.removeable}>
                <Popover content={renderMenu} boundary="viewport" captureDismiss={false}>
                  <Button icon="cog" />
                </Popover>
              </If>
            </ControlGroup>
          </When>
          <Otherwise>
            <FieldText field={field} entryFacade={entryFacade} />
          </Otherwise>
        </Choose>
      </FieldRowChildren>
    </FieldRowContainer>
  );
};

const EntryDetailsContent = () => {
  const t = useTranslations();
  const {
    attachments: supportsAttachments,
    attachmentPreviews,
    onDeleteAttachment,
    onDownloadAttachment,
    onPreviewAttachment,
    readOnly
  } = useContext(VaultContext);
  const {
    entry,
    editing: isEditing,
    onAddField,
    onCancelEdit,
    onEdit,
    onDeleteEntry,
    onFieldNameUpdate,
    onFieldUpdate,
    onFieldSetValueType,
    onRemoveField,
    onSaveEdit
  } = useCurrentEntry();
  const { onMoveEntryToTrash, trashID } = useGroups();

  const editing = isEditing && !readOnly;

  const editableFields = editing
    ? entry.fields.filter(item => item.propertyType === 'property')
    : entry.fields.filter(item => item.propertyType === 'property' && item.property !== 'title');
  const mainFields = editableFields.filter(field => !field.removeable);
  const removeableFields = editableFields.filter(field => field.removeable);

  return (
    <>
      <PaneHeader title={editing ? t('entry.edit-document') : title(entry, t('entry.untitled'))} />
      <PaneContent>
        <If condition={entry.type === EntryType.CreditCard}>
          <CreditCard entry={entry} />
        </If>
        <FormContainer primary>
          <For each="field" of={mainFields}>
            <FieldRow
              key={field.id}
              entryFacade={entry}
              field={field}
              onFieldNameUpdate={onFieldNameUpdate}
              onFieldUpdate={onFieldUpdate}
              onRemoveField={onRemoveField}
              editing={editing}
            />
          </For>
        </FormContainer>
        <If condition={editing || removeableFields.length > 0}>
          <CustomFieldsHeading>
            <span>{t('entry.custom-fields')}</span>
          </CustomFieldsHeading>
        </If>
        <FormContainer>
          <For each="field" of={removeableFields}>
            <FieldRow
              key={field.id}
              entryFacade={entry}
              field={field}
              onFieldNameUpdate={onFieldNameUpdate}
              onFieldUpdate={onFieldUpdate}
              onFieldSetValueType={onFieldSetValueType}
              onRemoveField={onRemoveField}
              editing={editing}
            />
          </For>
        </FormContainer>
        <If condition={editing}>
          <Button onClick={onAddField} text={t('entry.add-custom-field-btn')} icon="small-plus" />
        </If>
        <If condition={!editing && supportsAttachments}>
          <CustomFieldsHeading>
            <span>{t('entry.attachments')}</span>
          </CustomFieldsHeading>
          <Attachments
            attachmentPreviews={attachmentPreviews}
            entryFacade={entry}
            onDeleteAttachment={attachment => onDeleteAttachment(entry.id, attachment.id)}
            onDownloadAttachment={attachment => onDownloadAttachment(entry.id, attachment.id)}
            onPreviewAttachment={attachment => onPreviewAttachment(entry.id, attachment.id)}
            readOnly={readOnly}
          />
        </If>
      </PaneContent>
      <PaneFooter>
        <ActionBar>
          <If condition={!editing}>
            <Button onClick={onEdit} icon="edit" disabled={readOnly || entry.parentID === trashID}>
              {t('entry.edit')}
            </Button>
          </If>
          <If condition={editing}>
            <div>
              <Button onClick={onSaveEdit} intent={Intent.PRIMARY} icon="tick" disabled={readOnly}>
                {t('entry.save')}
              </Button>
              <Button onClick={onCancelEdit}>{t('entry.cancel-edit')}</Button>
            </div>
            <If condition={!entry.isNew}>
              <ConfirmButton
                danger
                description={t('entry.trash-move.message')}
                disabled={readOnly}
                icon="trash"
                onClick={() => onMoveEntryToTrash(entry.id)}
                primaryAction={t('entry.trash-move.trash-btn')}
                title={t('entry.trash-move.title')}
              />
            </If>
          </If>
        </ActionBar>
      </PaneFooter>
    </>
  );
};

const EntryDetails = () => {
  const t = useTranslations();
  const { editing, entry } = useCurrentEntry();
  const { attachments: supportsAttachments, onAddAttachments, readOnly } = useContext(VaultContext);
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    noClick: true,
    onDrop: files => {
      onAddAttachments(entry.id, files);
    }
  });
  return (
    <ErrorBoundary>
      <PaneContainer {...(!editing && supportsAttachments ? getRootProps() : {})}>
        <If condition={!editing}>
          <AttachmentDropZone visible={isDragActive} disabled={readOnly}>
            <Icon icon="compressed" iconSize={30} />
            <span>{t('attachments.drop-files')}</span>
          </AttachmentDropZone>
          <input {...getInputProps()} />
        </If>
        <Choose>
          <When condition={entry}>
            <EntryDetailsContent />
          </When>
          <Otherwise>
            <PaneContent>
              <NonIdealState
                icon="satellite"
                title={t('entry.none-selected.title')}
                description={t('entry.none-selected.message')}
              />
            </PaneContent>
          </Otherwise>
        </Choose>
      </PaneContainer>
    </ErrorBoundary>
  );
};

export default EntryDetails;

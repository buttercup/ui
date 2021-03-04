import React from 'react';
import { Button, ButtonGroup, Popover, Menu, MenuItem } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import { defaultType as defaultEntryType, types as entryTypes } from './entryTypes';
import { useActions } from './hooks/vault';
import { useTranslations } from '../../hooks/i18n';

const AddEntry = ({ disabled }) => {
  const { onAddEntry } = useActions();
  const t = useTranslations();

  const renderMenu = (
    <Menu>
      <For each="entryType" of={entryTypes}>
        <MenuItem
          key={entryType.type}
          text={entryType.title}
          icon={entryType.icon}
          label={entryType.label}
          onClick={() => onAddEntry(entryType.type || defaultEntryType)}
        />
      </For>
    </Menu>
  );

  return (
    <ButtonGroup fill>
      <Button
        icon="plus"
        text={t('new-entry.cta')}
        onClick={() => onAddEntry(defaultEntryType)}
        disabled={disabled}
        fill
      />
      <Popover content={renderMenu} boundary="viewport">
        <Button icon="more" disabled={disabled} fill={false} />
      </Popover>
    </ButtonGroup>
  );
};

export default AddEntry;

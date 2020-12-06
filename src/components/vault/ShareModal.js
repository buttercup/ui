import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Button, Callout, Card, Classes, Dialog, Intent, Spinner } from '@blueprintjs/core';
import { getThemeProp } from '../../utils';

const ORG_STATE_IDLE = 0;
const ORG_STATE_FETCHING = 1;
const ORG_STATE_DONE = 2;

const STEP_NOTICE = 0;
const STEP_ORGS = 1;
const STEP_USERS = 2;

const USERS_STATE_IDLE = 0;
const USERS_STATE_FETCHING = 1;
const USERS_STATE_DONE = 2;

const CardScroller = styled.div`
  max-height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  padding: 20px;
`;
const EntityCard = styled(Card)`
  padding: 10px;
  margin-bottom: 6px;
  ${p => (p.disabled ? `color: #999;` : '')}
  ${p => (p.disabled ? `font-style: italic;` : '')}
  ${p =>
    p.disabled
      ? `background-color: #eee;`
      : p.selected
      ? `background-color: ${getThemeProp(p, 'sharing.orgs.selectedBackgroundColor')};`
      : ''}
`;
const Loader = styled.div`
  margin: 10px 0;
  text-align: center;
`;

export function ShareModal(props = {}) {
  const { callback = () => {}, groupName = '', open = false, sharing } = props;
  const [step, setStep] = useState(STEP_NOTICE);
  const [orgs, setOrgs] = useState([]);
  const [orgState, setOrgState] = useState(ORG_STATE_IDLE);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersState, setUsersState] = useState(USERS_STATE_IDLE);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleClose = useCallback((output = null) => {
    setStep(STEP_NOTICE);
    setSelectedOrg(null);
    setOrgState(ORG_STATE_IDLE);
    setUsersState(USERS_STATE_IDLE);
    setSelectedUsers([]);
    callback(output);
  }, []);
  const handleShare = useCallback(() => {
    handleClose({
      org: selectedOrg,
      users: selectedUsers
    });
  }, [selectedOrg, selectedUsers]);
  useEffect(() => {
    if (step === STEP_ORGS && orgState === ORG_STATE_IDLE) {
      setOrgState(ORG_STATE_FETCHING);
      sharing
        .getOrganisations()
        .then(orgs => {
          setOrgs(orgs);
          setOrgState(ORG_STATE_DONE);
        })
        .catch(err => {
          setOrgState(ORG_STATE_DONE);
          console.error(err);
        });
    }
  }, [step, orgState]);
  useEffect(() => {
    if (step === STEP_USERS && usersState === USERS_STATE_IDLE) {
      setUsersState(USERS_STATE_FETCHING);
      sharing
        .getOrganisationUsers(selectedOrg.id)
        .then(users => {
          setUsers(users);
          setUsersState(USERS_STATE_DONE);
        })
        .catch(err => {
          setUsersState(USERS_STATE_DONE);
          console.error(err);
        });
    }
  }, [step, usersState, selectedOrg]);
  return (
    <Dialog
      autoFocus
      canEscapeKeyClose
      canOutsideClickClose
      enforceFocus
      isOpen={open}
      onClose={handleClose}
      title={`Share Group: ${groupName}`}
      icon="social-media"
      usePortal
    >
      <div className={Classes.DIALOG_BODY}>
        <Choose>
          <When condition={step === STEP_NOTICE}>
            <p>
              <strong>
                Share a group with users within an organisation, so that you can all use the items
                contained within.
              </strong>
            </p>
            <p>
              Groups can be shared with other registered users within organisations that you are a
              member of.
            </p>
            <Callout intent={Intent.WARNING} title="Important">
              Sharing a group exposes all sensitive data within it to <strong>other users</strong>.
              It is strongly advised that you review the contents of the group before sharing it.
            </Callout>
          </When>
          <When condition={step === STEP_ORGS}>
            <p>
              <strong>Choose an organisation:</strong>
            </p>
            <Choose>
              <When condition={orgState === ORG_STATE_DONE}>
                <CardScroller>
                  <For each="org" of={orgs}>
                    <With isSelected={selectedOrg && org.id === selectedOrg.id}>
                      <EntityCard
                        interactive={!isSelected}
                        onClick={() => (isSelected ? setSelectedOrg(null) : setSelectedOrg(org))}
                        selected={isSelected}
                      >
                        <strong>{org.title}</strong>
                      </EntityCard>
                    </With>
                  </For>
                </CardScroller>
              </When>
              <Otherwise>
                <Loader>
                  <Spinner />
                  <br />
                  <i>Fetching Organisations</i>
                </Loader>
              </Otherwise>
            </Choose>
          </When>
          <When condition={step === STEP_USERS}>
            <p>
              <strong>Choose users:</strong>
            </p>
            <Choose>
              <When condition={usersState === USERS_STATE_DONE}>
                <CardScroller>
                  <For each="user" of={users}>
                    <With isSelected={!!selectedUsers.find(s => s.id === user.id)}>
                      <EntityCard
                        interactive={!isSelected && !user.shared}
                        disabled={user.shared}
                        onClick={() =>
                          user.shared
                            ? null
                            : isSelected
                            ? setSelectedUsers(selectedUsers.filter(s => s.id !== user.id))
                            : setSelectedUsers([...selectedUsers, user])
                        }
                        selected={isSelected}
                      >
                        <strong>{user.name}</strong>
                      </EntityCard>
                    </With>
                  </For>
                </CardScroller>
              </When>
              <Otherwise>
                <Loader>
                  <Spinner />
                  <br />
                  <i>Fetching Users</i>
                </Loader>
              </Otherwise>
            </Choose>
          </When>
          <Otherwise>
            <Callout intent={Intent.DANGER} title="Error">
              Something went wrong - Please restart the application.
            </Callout>
          </Otherwise>
        </Choose>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Choose>
            <When condition={step === STEP_NOTICE}>
              <Button text="Cancel" onClick={handleClose} />
              <Button text="Next" intent={Intent.PRIMARY} onClick={() => setStep(STEP_ORGS)} />
            </When>
            <When condition={step === STEP_ORGS}>
              <Button text="Cancel" onClick={handleClose} />
              <Button
                text="Next"
                intent={Intent.PRIMARY}
                onClick={() => setStep(STEP_USERS)}
                disabled={!selectedOrg}
              />
            </When>
            <When condition={step === STEP_USERS}>
              <Button text="Cancel" onClick={handleClose} />
              <Button
                text="Share"
                intent={Intent.PRIMARY}
                onClick={handleShare}
                disabled={selectedUsers.length === 0}
              />
            </When>
          </Choose>
        </div>
      </div>
    </Dialog>
  );
}

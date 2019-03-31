import React from 'react';
import styled from 'styled-components';
import { Tag } from '@blueprintjs/core';

const ListHeader = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;
const ListHeading = styled.h2`
  font-weight: 300;
  margin: 0;
  flex: 1;
`;

export default ({ count, title }) => (
  <ListHeader>
    <ListHeading>{title}</ListHeading>
    <Tag minimal round>
      {count}
    </Tag>
  </ListHeader>
);

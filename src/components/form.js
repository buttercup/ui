import styled from 'styled-components';
import { colors, spacing } from '../variables';

export const Input = styled.input`
  border: 2px solid ${props => props.bordered ? colors.GRAY : 'transparent'};
  padding: 0 ${spacing.HALF};
  border-radius: 4px;
  height: ${spacing.INPUT_HEIGHT};
  width: 100%;

  &:focus {
    border-color: ${colors.BRAND_PRIMARY};
  }
`;

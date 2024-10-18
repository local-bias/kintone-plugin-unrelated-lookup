import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import { useAtomValue } from 'jotai';
import React, { FC, FCX } from 'react';
import { alreadyLookupAtom } from '../states';
import { useConditionId } from './condition-id-context';

type Props = Readonly<{ visible: boolean }>;

const LookupStatusBadgeComponent: FCX<Props> = ({ className }) => (
  <div {...{ className }}>
    <CheckIcon />
  </div>
);

const StyledLookupStatusBadgeComponent = styled(LookupStatusBadgeComponent)`
  position: absolute;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  transform: ${({ visible }) => (visible ? 'scale(1)' : 'scale(0)')};
  transition: transform 0.2s ease;

  left: -16px;
  top: -8px;
  width: 24px;
  height: 24px;
  background-color: #80beaf;
  color: #fff;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const LookupStatusBadgeContainer: FC = () => {
  const conditionId = useConditionId();
  const visible = useAtomValue(alreadyLookupAtom(conditionId));
  return <StyledLookupStatusBadgeComponent {...{ visible }} />;
};

export default LookupStatusBadgeContainer;

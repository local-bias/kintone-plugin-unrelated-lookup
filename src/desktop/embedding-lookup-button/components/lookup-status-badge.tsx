import React, { VFC, VFCX } from 'react';
import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import { useRecoilValue } from 'recoil';
import { alreadyLookupState } from '../states';

type Props = Readonly<{ visible: boolean }>;

const Component: VFCX<Props> = ({ className }) => (
  <div {...{ className }}>
    <CheckIcon />
  </div>
);

const StyledComponent = styled(Component)`
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

const Container: VFC = () => {
  const visible = useRecoilValue(alreadyLookupState);
  return <StyledComponent {...{ visible }} />;
};

export default Container;

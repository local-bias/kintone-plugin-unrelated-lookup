import React, { VFC, VFCX } from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';

import { useLookup } from '../hooks/use-lookup';

type Props = {
  onLookupButtonClick: () => void;
  onClearButtonClick: () => void;
  loading: boolean;
};

const Component: VFCX<Props> = ({
  className,
  onLookupButtonClick,
  onClearButtonClick,
  loading,
}) => (
  <div {...{ className }}>
    <div>
      <Button color='primary' onClick={onLookupButtonClick} disabled={loading}>
        取得
      </Button>
      {loading && <CircularProgress className='circle' size={24} />}
    </div>
    <Button color='primary' onClick={onClearButtonClick} disabled={loading}>
      クリア
    </Button>
  </div>
);

const StyledComponent = styled(Component)`
  display: flex;
  & > div {
    position: relative;

    & > .circle {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -12px 0 0 -12px;
    }
  }
`;

const Container: VFC = () => {
  const { loading, start, clear } = useLookup();

  const onClearButtonClick = clear;
  const onLookupButtonClick = start;

  return <StyledComponent {...{ onLookupButtonClick, onClearButtonClick, loading }} />;
};

export default Container;

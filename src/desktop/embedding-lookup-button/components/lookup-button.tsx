import React, { FC, FCX } from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';

import { useLookup } from '../hooks/use-lookup';
import { useConditionId } from './condition-id-context';
import { useAtomValue } from 'jotai';
import { loadingAtom } from '../states';

type Props = {
  onLookupButtonClick: () => void;
  onClearButtonClick: () => void;
};

const LookupButtonComponent: FCX<Props> = ({
  className,
  onLookupButtonClick,
  onClearButtonClick,
}) => {
  const conditionId = useConditionId();
  const loading = useAtomValue(loadingAtom(conditionId));
  return (
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
};

const StyledLookupButtonComponent = styled(LookupButtonComponent)`
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

const LookupButtonContainer: FC = () => {
  const conditionId = useConditionId();
  const { start, clear } = useLookup(conditionId);

  const onClearButtonClick = clear;
  const onLookupButtonClick = start;

  return <StyledLookupButtonComponent {...{ onLookupButtonClick, onClearButtonClick }} />;
};

export default LookupButtonContainer;

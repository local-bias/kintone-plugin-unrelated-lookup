import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useAtomValue } from 'jotai';
import { FC, FCX } from 'react';
import { useLookup } from '../hooks/use-lookup';
import { loadingAtom } from '../states';
import { useConditionId } from './condition-id-context';

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
      <LoadingButton color='primary' onClick={onLookupButtonClick} loading={loading}>
        取得
      </LoadingButton>
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

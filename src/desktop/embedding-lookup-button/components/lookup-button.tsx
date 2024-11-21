import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useAtomValue } from 'jotai';
import { FC, FCX } from 'react';
import { useLookup } from '../hooks/use-lookup';
import { loadingAtom } from '../states';
import { useConditionId } from './attachment-context';
import { isMobile } from '@konomi-app/kintone-utilities';

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
      <LoadingButton
        color='primary'
        size={isMobile() ? 'large' : 'medium'}
        variant={isMobile() ? 'contained' : 'text'}
        onClick={onLookupButtonClick}
        loading={loading}
        sx={{
          fontSize: isMobile() ? '14px' : undefined,
        }}
      >
        取得
      </LoadingButton>
      <Button
        color='primary'
        size={isMobile() ? 'large' : 'medium'}
        variant={isMobile() ? 'contained' : 'text'}
        onClick={onClearButtonClick}
        disabled={loading}
        sx={{
          fontSize: isMobile() ? '14px' : undefined,
          width: isMobile() ? '100%' : undefined,
        }}
      >
        クリア
      </Button>
    </div>
  );
};

const StyledLookupButtonComponent = styled(LookupButtonComponent)`
  display: flex;

  ${isMobile() &&
  `
    width: 100%;
    gap: 4px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `};

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
  const { start, clear } = useLookup();

  const onClearButtonClick = clear;
  const onLookupButtonClick = start;

  return <StyledLookupButtonComponent {...{ onLookupButtonClick, onClearButtonClick }} />;
};

export default LookupButtonContainer;

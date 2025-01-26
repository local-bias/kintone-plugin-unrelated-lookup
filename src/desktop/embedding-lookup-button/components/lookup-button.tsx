import { t } from '@/lib/i18n';
import styled from '@emotion/styled';
import { isMobile } from '@konomi-app/kintone-utilities';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useAtomValue } from 'jotai';
import { FC, FCX } from 'react';
import { useLookup } from '../hooks/use-lookup';
import { loadingAtom } from '../states';
import { useConditionId } from './attachment-context';

type Props = {};

const LookupButtonComponent: FCX<Props> = ({ className }) => {
  const { start, clear } = useLookup();
  const conditionId = useConditionId();
  const loading = useAtomValue(loadingAtom(conditionId));
  return (
    <div className={className}>
      <LoadingButton
        color='primary'
        size={isMobile() ? 'large' : 'medium'}
        variant={isMobile() ? 'contained' : 'text'}
        onClick={start}
        loading={loading}
        sx={{
          fontSize: isMobile() ? '14px' : undefined,
        }}
      >
        {t('common.get')}
      </LoadingButton>
      <Button
        color='primary'
        size={isMobile() ? 'large' : 'medium'}
        variant={isMobile() ? 'contained' : 'text'}
        onClick={clear}
        disabled={loading}
        sx={{
          fontSize: isMobile() ? '14px' : undefined,
          width: isMobile() ? '100%' : undefined,
        }}
      >
        {t('common.clear')}
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
  return <StyledLookupButtonComponent />;
};

export default LookupButtonContainer;

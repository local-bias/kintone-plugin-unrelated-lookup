import styled from '@emotion/styled';
import { Pagination } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import React, { FC, FCX } from 'react';
import { SetterOrUpdater } from 'recoil';
import { dialogPageChunkAtom, dialogPageIndexAtom } from '../../states/dialog';
import { filteredRecordsAtom } from '../../states/records';
import { useConditionId } from '../condition-id-context';

type Props = {
  size: number;
  index: number;
  setIndex: SetterOrUpdater<number>;
  chunkSize: number;
};

const Component: FCX<Props> = ({ className, size, index, setIndex, chunkSize }) => (
  <div className={className}>
    <Pagination
      count={Math.ceil(size / chunkSize)}
      page={index}
      color='primary'
      onChange={(_, index) => setIndex(index)}
    />
  </div>
);

const StyledComponent = styled(Component)``;

const Container: FC = () => {
  const conditionId = useConditionId();
  const records = useAtomValue(filteredRecordsAtom(conditionId));
  const [index, setIndex] = useAtom(dialogPageIndexAtom(conditionId));
  const chunkSize = useAtomValue(dialogPageChunkAtom(conditionId));

  const size = records.length || 0;

  return <>{!!size && <StyledComponent {...{ size, index, setIndex, chunkSize }} />}</>;
};

export default Container;

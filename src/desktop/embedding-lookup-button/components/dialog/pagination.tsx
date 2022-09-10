import React, { FC, FCX } from 'react';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { Pagination } from '@mui/material';

import { dialogPageChunkState, dialogPageIndexState } from '../../states';
import { filteredRecordsState } from '../../states/records';

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
  const records = useRecoilValue(filteredRecordsState);
  const [index, setIndex] = useRecoilState(dialogPageIndexState);
  const chunkSize = useRecoilValue(dialogPageChunkState);

  const size = records.length || 0;

  return <>{!!size && <StyledComponent {...{ size, index, setIndex, chunkSize }} />}</>;
};

export default Container;

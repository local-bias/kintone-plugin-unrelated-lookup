import React, { VFC, VFCX } from 'react';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { Pagination } from '@mui/material';

import { filteredRecordsState, dialogPageChunkState, dialogPageIndexState } from '../../states';

type Props = {
  size: number;
  index: number;
  setIndex: SetterOrUpdater<number>;
  chunkSize: number;
};

const Component: VFCX<Props> = ({ className, size, index, setIndex, chunkSize }) => (
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

const Container: VFC = () => {
  const records = useRecoilValue(filteredRecordsState);
  const [index, setIndex] = useRecoilState(dialogPageIndexState);
  const chunkSize = useRecoilValue(dialogPageChunkState);

  const size = records.length || 0;

  return <>{!!size && <StyledComponent {...{ size, index, setIndex, chunkSize }} />}</>;
};

export default Container;

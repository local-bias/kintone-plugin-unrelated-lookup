import styled from '@emotion/styled';
import { Pagination } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { FC, FCX } from 'react';
import { SetterOrUpdater } from 'recoil';
import { dialogPageChunkAtom, dialogPageIndexAtom } from '../../states/dialog';
import { filteredRecordsAtom } from '../../states/records';
import { useAttachmentProps } from '../attachment-context';

type Props = {
  size: number;
  index: number;
  setIndex: SetterOrUpdater<number>;
  chunkSize: number;
};

const DialogPagination: FCX<Props> = ({ className, size, index, setIndex, chunkSize }) => (
  <div className={className}>
    <Pagination
      count={Math.ceil(size / chunkSize)}
      page={index}
      color='primary'
      onChange={(_, index) => setIndex(index)}
    />
  </div>
);

const StyledComponent = styled(DialogPagination)``;

const DialogPaginationContainer: FC = () => {
  const attachmentProps = useAttachmentProps();
  const records = useAtomValue(filteredRecordsAtom(attachmentProps));
  const [index, setIndex] = useAtom(dialogPageIndexAtom(attachmentProps));
  const chunkSize = useAtomValue(dialogPageChunkAtom(attachmentProps.conditionId));

  const size = records.length || 0;

  return <>{!!size && <StyledComponent {...{ size, index, setIndex, chunkSize }} />}</>;
};

export default DialogPaginationContainer;

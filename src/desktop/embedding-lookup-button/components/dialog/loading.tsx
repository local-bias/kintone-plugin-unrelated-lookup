import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import { useAtomValue } from 'jotai';
import { FC, type FCX } from 'react';
import { dialogLoadingAtom } from '../../states/dialog';
import { useAttachmentProps } from '../attachment-context';

const DialogLoadingComponent: FCX<{ loading: boolean }> = ({ className }) => (
  <div className={className}>
    <CircularProgress />
  </div>
);

const StyledDialogLoading = styled(DialogLoadingComponent)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff5;
  opacity: ${({ loading }) => (loading ? 1 : 0)};
  pointer-events: ${({ loading }) => (loading ? 'auto' : 'none')};
  transition: opacity 250ms ease;
  display: grid;
  place-items: center;
  z-index: 100;
`;

const DialogLoading: FC = () => {
  const attachmentProps = useAttachmentProps();
  const loading = useAtomValue(dialogLoadingAtom(attachmentProps));

  return <StyledDialogLoading loading={loading} />;
};

export default DialogLoading;

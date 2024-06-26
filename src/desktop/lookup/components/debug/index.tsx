import { currentKintoneEventState } from '@/desktop/states/kintone';
import styled from '@emotion/styled';
import { Dialog, DialogContent, DialogTitle, Fab } from '@mui/material';
import React, { FC, FCX } from 'react';
import { useRecoilValue } from 'recoil';

const Component: FCX = ({ className }) => {
  const [open, setOpen] = React.useState(false);
  const kintoneEvent = useRecoilValue(currentKintoneEventState);

  return (
    <>
      <Fab className={className} size='small' onClick={() => setOpen(true)}>
        🐛
      </Fab>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>🐛 debug (dev mode only)</DialogTitle>
        <DialogContent>
          <pre>
            <code>currentKintoneEvent: {kintoneEvent}</code>
          </pre>
        </DialogContent>
      </Dialog>
    </>
  );
};

const StyledComponent = styled(Component)`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
`;

const Container: FC = () => {
  if (process?.env?.NODE_ENV !== 'development') {
    return null;
  }
  return <StyledComponent />;
};

export default Container;

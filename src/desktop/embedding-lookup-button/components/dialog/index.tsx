import React, { VFC, VFCX } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { dialogTitleState, dialogVisibleState } from '../../states';
import Header from './header';
import Table from './table';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
};

const Component: VFCX<Props> = ({ className, open, onClose, title }) => (
  <Dialog {...{ open, onClose, className }} maxWidth='lg' fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent dividers>
      <Header />
      <Table />
    </DialogContent>
    <DialogActions>
      <Button color='secondary' onClick={onClose}>
        キャンセル
      </Button>
    </DialogActions>
  </Dialog>
);

const StyledComponent = styled(Component)`
  & > div {
    & > div {
      height: 90vh;

      .MuiDialogContent-root {
        position: relative;
        padding: 0;
      }
    }
  }
`;

const Container: VFC = () => {
  const [open, setOpen] = useRecoilState(dialogVisibleState);
  const title = useRecoilValue(dialogTitleState);

  const onClose = () => setOpen(false);

  return <StyledComponent {...{ open, onClose, title }} />;
};

export default Container;

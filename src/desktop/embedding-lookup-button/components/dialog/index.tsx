import React, { Suspense, VFC, VFCX } from 'react';
import { useRecoilState } from 'recoil';
import styled from '@emotion/styled';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { dialogVisibleState } from '../../states';

import Header from './header';
import Title from './title';
import Table from './table';

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

const Component: VFCX<Props> = ({ className, open, onClose }) => (
  <Dialog {...{ open, onClose, className }} maxWidth='lg' fullWidth>
    <Suspense fallback={<DialogTitle>"アプリからデータを取得"</DialogTitle>}>
      <Title />
    </Suspense>
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

  const onClose = () => setOpen(false);

  return <StyledComponent {...{ open, onClose }} />;
};

export default Container;

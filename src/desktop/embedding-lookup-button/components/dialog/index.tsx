import styled from '@emotion/styled';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useAtom } from 'jotai';
import React, { FC, FCX, Suspense } from 'react';
import { isDialogShownAtom } from '../../states/dialog';
import { useConditionId } from '../condition-id-context';
import Header from './header';
import Table from './table';
import Title from './title';

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

const Component: FCX<Props> = ({ className, open, onClose }) => (
  <Dialog {...{ open, onClose, className }} maxWidth='xl' fullWidth>
    <Suspense fallback={<DialogTitle>アプリからデータを取得</DialogTitle>}>
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

      @media (max-width: 600px) {
        margin: 0;
        width: 100vw;
      }

      .MuiDialogContent-root {
        position: relative;
        padding: 0;
      }
    }
  }
`;

const Container: FC = () => {
  const conditionId = useConditionId();
  const [open, setOpen] = useAtom(isDialogShownAtom(conditionId));

  const onClose = () => setOpen(false);

  return <StyledComponent {...{ open, onClose }} />;
};

export default Container;

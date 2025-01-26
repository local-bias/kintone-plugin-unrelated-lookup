import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import { t } from '@/lib/i18n';
import styled from '@emotion/styled';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useAtom } from 'jotai';
import { FC, FCX, useEffect, useRef } from 'react';
import FailSoftAlert from '../../fail-soft-alert';
import { isDialogShownAtom } from '../../states/dialog';
import { useAttachmentProps } from '../attachment-context';
import Header from './header';
import Table from './table';
import Title from './title';
import DialogLoading from './loading';

const DialogComponent: FCX = ({ className }) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const attachmentProps = useAttachmentProps();
  const [open, setOpen] = useAtom(isDialogShownAtom(attachmentProps));

  const onClose = () => setOpen(false);

  useEffect(() => {
    // ダイアログを開いたときに検索入力欄にフォーカスを当てる
    if (open) {
      const focusInput = () => {
        searchInputRef.current?.focus();
      };

      const timeoutId = setTimeout(focusInput, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  return (
    <Dialog {...{ open, onClose, className }} maxWidth='xl' fullWidth>
      <FailSoftAlert />
      <Title />
      <DialogContent dividers>
        <Header searchInputRef={searchInputRef} />
        <PluginErrorBoundary>
          <Table />
        </PluginErrorBoundary>
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={onClose}>
          {t('common.cancel')}
        </Button>
      </DialogActions>
      <DialogLoading />
    </Dialog>
  );
};

const StyledDialogComponent = styled(DialogComponent)`
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

const DialogContainer: FC = () => {
  return <StyledDialogComponent />;
};

export default DialogContainer;

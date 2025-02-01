import {
  dialogLoadingAtom,
  focusedRowIndexAtom,
  isDialogShownAtom,
} from '@/desktop/embedding-lookup-button/states/dialog';
import { PluginCondition } from '@/schema/plugin-config';
import { css } from '@emotion/css';
import { getCurrentRecord, kintoneAPI, setCurrentRecord } from '@konomi-app/kintone-utilities';
import { CloudOff } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useSnackbar } from 'notistack';
import { FC, useCallback, useDeferredValue } from 'react';
import { apply } from '../../../action';
import { alreadyCacheAtom, cacheErrorAtom, pluginConditionAtom } from '../../../states';
import { displayingRecordsAtom } from '../../../states/records';
import { useAttachmentProps } from '../../attachment-context';
import Cell from './cell';
import Empty from './empty';
import Layout from './layout';
import TableHeader from './table-header';

type Props = {
  records: kintoneAPI.RecordData[];
  onRowClick: (record: any) => void;
  focusedRowIndex: number;
  condition: PluginCondition;
  hasCached: boolean;
};

const DialogTable: FC<Props> = ({ records, focusedRowIndex, onRowClick, condition, hasCached }) => {
  if (!records.length && hasCached) {
    return <Empty />;
  }

  return (
    <table>
      <TableHeader />
      <tbody>
        {!records.length && !hasCached && (
          <tr>
            {condition.displayFields.map((field, j) => (
              <td key={j}>
                <Skeleton variant='text' />
              </td>
            ))}
          </tr>
        )}
        {!!records.length && (
          <>
            {records.map((record, i) => (
              <tr
                key={i}
                onClick={() => onRowClick(record)}
                data-focused={focusedRowIndex === i ? '' : undefined}
              >
                {condition.displayFields.map((field, j) => (
                  <td key={j}>
                    <Cell field={record[field.fieldCode]} />
                  </td>
                ))}
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
};

const DialogTableComponent: FC = () => {
  const attachmentProps = useAttachmentProps();
  const cacheError = useAtomValue(cacheErrorAtom(attachmentProps.conditionId));
  const condition = useAtomValue(pluginConditionAtom(attachmentProps.conditionId));
  const rawRecords = useAtomValue(displayingRecordsAtom(attachmentProps));
  const focusedRowIndex = useAtomValue(focusedRowIndexAtom(attachmentProps));
  const records = useDeferredValue(rawRecords);
  const hasCached = useAtomValue(alreadyCacheAtom(attachmentProps.conditionId));
  const { enqueueSnackbar } = useSnackbar();

  const onRowClick = useAtomCallback(
    useCallback(
      async (_, set, sourceRecord: kintoneAPI.RecordData) => {
        try {
          set(dialogLoadingAtom(attachmentProps), true);
          const { record } = getCurrentRecord();
          const applied = await apply({
            condition,
            targetRecord: record,
            sourceRecord,
            attachmentProps,
            option: { enqueueSnackbar },
          });
          setCurrentRecord({ record: applied });
          set(isDialogShownAtom(attachmentProps), false);
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          } else {
            enqueueSnackbar('ルックアップ時にエラーが発生しました', { variant: 'error' });
          }
        } finally {
          set(dialogLoadingAtom(attachmentProps), false);
        }
      },
      [attachmentProps, enqueueSnackbar, condition]
    )
  );

  if (cacheError) {
    return (
      <div
        className={css`
          svg {
            width: 210px;
            height: 210px;
            color: #d1d5db;
          }
          small {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #d1d5db;
          }
          display: grid;
          place-items: center;
          font-size: 24px;
          font-weight: bold;
          color: #9ca3af;
          padding: 64px;
        `}
      >
        <div>
          <CloudOff strokeWidth={1} />
        </div>
        <div>レコード情報を取得できませんでした</div>
        <small>{cacheError}</small>
      </div>
    );
  }

  return <DialogTable {...{ records, focusedRowIndex, onRowClick, condition, hasCached }} />;
};

const DialogTableContainer: FC = () => {
  return (
    <Layout>
      <DialogTableComponent />
    </Layout>
  );
};

export default DialogTableContainer;

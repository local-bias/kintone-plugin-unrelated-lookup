import { isDialogShownAtom } from '@/desktop/embedding-lookup-button/states/dialog';
import { PluginCondition } from '@/schema/plugin-config';
import { getCurrentRecord, kintoneAPI, setCurrentRecord } from '@konomi-app/kintone-utilities';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { FC, useDeferredValue } from 'react';
import { apply } from '../../../action';
import { alreadyCacheAtom, cacheErrorAtom, pluginConditionAtom } from '../../../states';
import { displayingRecordsAtom } from '../../../states/records';
import { useAttachmentProps } from '../../attachment-context';
import Cell from './cell';
import Empty from './empty';
import Layout from './layout';
import { CloudOff } from '@mui/icons-material';
import { css } from '@emotion/css';
import TableHeader from './table-header';

type Props = {
  records: kintoneAPI.RecordData[];
  onRowClick: (record: any) => void;
  condition: PluginCondition;
  hasCached: boolean;
};

const DialogTable: FC<Props> = ({ records, onRowClick, condition, hasCached }) => (
  <>
    {!records.length && !hasCached && <LoaderWithLabel label='レコードを取得しています' />}
    {!records.length && hasCached && <Empty />}
    {!!records.length && (
      <table>
        <TableHeader />
        <tbody>
          {records.map((record, i) => (
            <tr key={i} onClick={() => onRowClick(record)}>
              {condition.displayFields.map((field, j) => (
                <td key={j}>
                  <Cell field={record[field.fieldCode]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </>
);

const DialogTableComponent: FC = () => {
  const attachmentProps = useAttachmentProps();
  const cacheError = useAtomValue(cacheErrorAtom(attachmentProps.conditionId));
  const condition = useAtomValue(pluginConditionAtom(attachmentProps.conditionId));
  const rawRecords = useAtomValue(displayingRecordsAtom(attachmentProps));
  const records = useDeferredValue(rawRecords);
  const hasCached = useAtomValue(alreadyCacheAtom(attachmentProps.conditionId));
  const setDialogShown = useSetAtom(isDialogShownAtom(attachmentProps));
  const { enqueueSnackbar } = useSnackbar();

  const onRowClick = async (sourceRecord: kintoneAPI.RecordData) => {
    try {
      const { record } = getCurrentRecord();
      const applied = await apply({
        condition,
        targetRecord: record,
        sourceRecord,
        attachmentProps,
        option: { enqueueSnackbar },
      });
      setCurrentRecord({ record: applied });
      setDialogShown(false);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('ルックアップ時にエラーが発生しました', { variant: 'error' });
      }
    }
  };

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

  return <DialogTable {...{ records, onRowClick, condition, hasCached }} />;
};

const DialogTableContainer: FC = () => {
  return (
    <Layout>
      <DialogTableComponent />
    </Layout>
  );
};

export default DialogTableContainer;

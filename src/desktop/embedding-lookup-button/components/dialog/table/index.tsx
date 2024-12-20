import { isDialogShownAtom } from '@/desktop/embedding-lookup-button/states/dialog';
import { PluginCondition } from '@/schema/plugin-config';
import { getCurrentRecord, kintoneAPI, setCurrentRecord } from '@konomi-app/kintone-utilities';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { FC, useDeferredValue } from 'react';
import { apply } from '../../../action';
import { alreadyCacheAtom, pluginConditionAtom } from '../../../states';
import { displayingRecordsAtom } from '../../../states/records';
import { useAttachmentProps } from '../../attachment-context';
import Cell from './cell';
import Empty from './empty';
import Layout from './layout';

type Props = {
  records: kintoneAPI.RecordData[];
  onRowClick: (record: any) => void;
  condition: PluginCondition;
  hasCached: boolean;
};

const DialogTableComponent: FC<Props> = ({ records, onRowClick, condition, hasCached }) => (
  <Layout>
    {!records.length && !hasCached && <LoaderWithLabel label='レコードを取得しています' />}
    {!records.length && hasCached && <Empty />}
    {!!records.length && (
      <table>
        <thead>
          <tr>
            {condition.displayFields.map((field, i) => (
              <th key={i}>{field.fieldCode}</th>
            ))}
          </tr>
        </thead>
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
  </Layout>
);

const DialogTableContainer: FC = () => {
  const attachmentProps = useAttachmentProps();
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

  return <DialogTableComponent {...{ records, onRowClick, condition, hasCached }} />;
};

export default DialogTableContainer;

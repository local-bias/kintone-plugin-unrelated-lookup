import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { getCurrentRecord, setCurrentRecord } from '@lb-ribbit/kintone-xapp';
import { useSnackbar } from 'notistack';
import React, { FC, useDeferredValue } from 'react';
import { apply } from '../../../action';
import { alreadyCacheAtom, alreadyLookupAtom, pluginConditionAtom } from '../../../states';

import { isDialogShownAtom } from '@/desktop/embedding-lookup-button/states/dialog';
import { useAtomValue, useSetAtom } from 'jotai';
import { displayingRecordsAtom } from '../../../states/records';
import { useConditionId } from '../../condition-id-context';
import Cell from './cell';
import Empty from './empty';
import Layout from './layout';

type Props = {
  records: kintoneAPI.RecordData[];
  onRowClick: (record: any) => void;
  condition: Plugin.Condition;
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
  const conditionId = useConditionId();
  const condition = useAtomValue(pluginConditionAtom(conditionId));
  const rawRecords = useAtomValue(displayingRecordsAtom(conditionId));
  const records = useDeferredValue(rawRecords);
  const setDialogShown = useSetAtom(isDialogShownAtom(conditionId));
  const setLookuped = useSetAtom(alreadyLookupAtom(conditionId));
  const hasCached = useAtomValue(alreadyCacheAtom(conditionId));
  const { enqueueSnackbar } = useSnackbar();

  const onRowClick = (selectedRecord: kintoneAPI.RecordData) => {
    const { record } = getCurrentRecord();
    const applied = apply(condition!, record, selectedRecord, {
      enqueueSnackbar,
      setLookuped,
    });
    setCurrentRecord({ record: applied });
    setDialogShown(false);
  };

  return <DialogTableComponent {...{ records, onRowClick, condition, hasCached }} />;
};

export default DialogTableContainer;

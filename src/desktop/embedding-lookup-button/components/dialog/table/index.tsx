import React, { FC } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { LoaderWithLabel } from '@konomi-app/ui-react';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { getCurrentRecord, setCurrentRecord } from '@lb-ribbit/kintone-xapp';

import {
  dialogVisibleState,
  pluginConditionState,
  alreadyCacheState,
  alreadyLookupState,
} from '../../../states';
import { apply } from '../../../action';
import { useSnackbar } from 'notistack';

import Layout from './layout';
import Empty from './empty';
import Cell from './cell';
import { displayingRecordsState } from '../../../states/records';

type Props = {
  records: kintoneAPI.RecordData[];
  onRowClick: (record: any) => void;
  condition: Plugin.Condition | null;
  hasCached: boolean;
};

const Component: FC<Props> = ({ records, onRowClick, condition, hasCached }) => (
  <Layout>
    {!records.length && !hasCached && <LoaderWithLabel label='レコードを取得しています' />}
    {!records.length && hasCached && <Empty />}
    {!!records.length && (
      <table>
        <thead>
          <tr>
            <th>{condition?.srcField}</th>
            {!!condition && condition.sees.map((code, i) => <th key={i}>{code}</th>)}
          </tr>
        </thead>
        <tbody>
          {!!condition &&
            records.map((record, i) => (
              <tr key={i} onClick={() => onRowClick(record)}>
                <td>
                  <Cell field={record[condition.srcField]} />
                </td>
                {condition.sees.map((code, j) => (
                  <td key={j}>
                    <Cell field={record[code]} />
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </Layout>
);

const Container: FC = () => {
  const condition = useRecoilValue(pluginConditionState);
  const records = useRecoilValue(displayingRecordsState);
  const setDialogShown = useSetRecoilState(dialogVisibleState);
  const setLookuped = useSetRecoilState(alreadyLookupState);
  const hasCached = useRecoilValue(alreadyCacheState);
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

  return <Component {...{ records, onRowClick, condition, hasCached }} />;
};

export default Container;

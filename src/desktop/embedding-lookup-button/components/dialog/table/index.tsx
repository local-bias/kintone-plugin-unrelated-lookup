import React, { VFC } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  filterdRecordsState,
  dialogPageChunkState,
  dialogPageIndexState,
  dialogVisibleState,
  pluginConditionState,
  alreadyCacheState,
} from '../../../states';
import { apply } from '../../../action';
import { useSnackbar } from 'notistack';
import { Record as KintoneRecord } from '@kintone/rest-api-client/lib/client/types';
import { Loading } from '@common/components/loading';

import Layout from './layout';
import Empty from './empty';

type Props = {
  records: KintoneRecord[];
  onRowClick: (record: any) => void;
  condition: kintone.plugin.Condition | null;
  hasCached: boolean;
};

const Component: VFC<Props> = ({ records, onRowClick, condition, hasCached }) => (
  <Layout>
    {!records.length && !hasCached && <Loading label='レコードを取得しています' />}
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
                <td>{record[condition.srcField].value}</td>
                {condition.sees.map((code, j) => (
                  <td key={j}>{record[code]?.value || ''}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </Layout>
);

const Container: VFC = () => {
  const condition = useRecoilValue(pluginConditionState);
  const filterd = useRecoilValue(filterdRecordsState);
  const index = useRecoilValue(dialogPageIndexState);
  const chunk = useRecoilValue(dialogPageChunkState);
  const setDialogShown = useSetRecoilState(dialogVisibleState);
  const hasCached = useRecoilValue(alreadyCacheState);
  const { enqueueSnackbar } = useSnackbar();

  const records = filterd.slice((index - 1) * chunk, index * chunk);

  const onRowClick = (record: KintoneRecord) => {
    apply(record, condition!, enqueueSnackbar);
    setDialogShown(false);
  };

  return <Component {...{ records, onRowClick, condition, hasCached }} />;
};

export default Container;
import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { SetterOrUpdater } from 'recoil';

import { getAppId, getCurrentRecord, setCurrentRecord } from '@common/kintone';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { getAllRecords } from '@common/kintone-rest-api';
import { Record as KintoneRecord } from '@kintone/rest-api-client/lib/client/types';

type EnqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject | undefined
) => SnackbarKey;

export const lookup = async (
  enqueueSnackbar: EnqueueSnackbar,
  setShown: SetterOrUpdater<boolean>,
  condition: kintone.plugin.Condition
) => {
  const { record } = getCurrentRecord();

  const value = record[condition.dstField].value as string;

  const app = condition.srcAppId;
  const query = value ? `${condition.srcField} like "${value}"` : '';
  const fields = [
    ...new Set(
      [condition.copies.map(({ from }) => from), condition.sees, condition.srcField].flat()
    ),
  ];

  let onlyOneRecord = true;
  const lookupRecords = await getAllRecords({
    app,
    query,
    fields,
    onTotalGet: (total) => {
      console.log('onTotalGet', total);
      if (total !== 1) {
        setShown(true);
        onlyOneRecord = false;
      }
    },
  });
  console.log('onlyOneRecord', onlyOneRecord);
  if (!onlyOneRecord) {
    return;
  }

  apply(lookupRecords[0], condition, enqueueSnackbar);
};

export const apply = (
  selected: KintoneRecord,
  condition: kintone.plugin.Condition,
  enqueueSnackbar: EnqueueSnackbar
) => {
  const { record } = getCurrentRecord()!;

  record[condition.dstField].value = selected[condition.srcField].value;
  for (const { from, to } of condition.copies) {
    record[to].value = selected[from].value;
  }

  setCurrentRecord({ record });
  enqueueSnackbar('参照先からデータが取得されました。', { variant: 'success' });
};

export const clearLookup = (condition: kintone.plugin.Condition) => {
  const { record } = getCurrentRecord()!;

  record[condition.dstField].value = '';
  for (const { to } of condition.copies) {
    record[to].value = '';
  }

  setCurrentRecord({ record });
};

const getRecords = async (value: string, condition: kintone.plugin.Condition): Promise<any[]> => {
  const client = new KintoneRestAPIClient();

  const app = condition.srcAppId;

  if (!app) {
    throw new Error('アプリ情報の取得に失敗したため、ルックアップを実行できませんでした。');
  }

  const query = value ? `${condition.srcField} like "${value}"` : '';

  const fields = [
    ...new Set(
      [condition.copies.map(({ from }) => from), condition.sees, condition.srcField].flat()
    ),
  ];

  return client.record.getAllRecordsWithCursor({ app, query, fields });
};

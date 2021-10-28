import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { SetterOrUpdater } from 'recoil';

import { getCurrentRecord, setCurrentRecord } from '@common/kintone';
import { getAllRecords } from '@common/kintone-rest-api';
import { Record as KintoneRecord } from '@kintone/rest-api-client/lib/client/types';

type EnqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject | undefined
) => SnackbarKey;

export const lookup = async (
  enqueueSnackbar: EnqueueSnackbar,
  setShown: SetterOrUpdater<boolean>,
  setLookuped: SetterOrUpdater<boolean>,
  condition: kintone.plugin.Condition
) => {
  const { record } = getCurrentRecord();

  const value = record[condition.dstField].value as string;

  const app = condition.srcAppId;
  const query = value ? `${condition.srcField} like "${value}"` : '';
  const fields = getLookupSrcFields(condition);

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

  apply(lookupRecords[0], condition, enqueueSnackbar, setLookuped);
};

export const getLookupSrcFields = (condition: kintone.plugin.Condition) => {
  const fields = [
    ...new Set(
      [condition.copies.map(({ from }) => from), condition.sees, condition.srcField].flat()
    ),
  ];
  return fields;
};

export const apply = (
  selected: KintoneRecord,
  condition: kintone.plugin.Condition,
  enqueueSnackbar: EnqueueSnackbar,
  setLookuped: SetterOrUpdater<boolean>
) => {
  const { record } = getCurrentRecord()!;

  record[condition.dstField].value = selected[condition.srcField].value;
  for (const { from, to } of condition.copies) {
    record[to].value = selected[from].value;
  }

  setCurrentRecord({ record });
  enqueueSnackbar('参照先からデータが取得されました。', { variant: 'success' });
  setLookuped(true);
};

export const clearLookup = (condition: kintone.plugin.Condition) => {
  const { record } = getCurrentRecord()!;

  record[condition.dstField].value = '';
  for (const { to } of condition.copies) {
    record[to].value = '';
  }

  setCurrentRecord({ record });
};

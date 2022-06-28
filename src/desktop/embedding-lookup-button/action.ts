import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { SetterOrUpdater } from 'recoil';

import { getCurrentRecord, setCurrentRecord } from '@common/kintone';
import { getAllRecords } from '@common/kintone-rest-api';
import { Record as KintoneRecord } from '@kintone/rest-api-client/lib/client/types';
import { someFieldValue } from '@common/kintone-api';
import { lookupObserver } from '../lookup-observer';

type EnqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject | undefined
) => SnackbarKey;

export const lookup = async (
  condition: kintone.plugin.Condition,
  record: KintoneRecord,
  option?: {
    input: string;
    hasCached: boolean;
    cachedRecords: KintoneRecord[];
    enqueueSnackbar: EnqueueSnackbar;
    setShown: SetterOrUpdater<boolean>;
    setLookuped: SetterOrUpdater<boolean>;
  }
): Promise<KintoneRecord> => {
  // 全レコードのキャッシュが取得済みであれば、キャッシュから対象レコードを検索します
  // 対象レコードが１件だけであれば、ルックアップ対象を確定します
  if (option && option.hasCached) {
    const filtered = option.cachedRecords.filter((r) =>
      someFieldValue(r[condition.srcField], option.input)
    );

    if (filtered.length === 1) {
      const applied = apply(condition, record, filtered[0], option);
      return applied;
    }
  }

  const value = record[condition.dstField].value as string;

  const app = condition.srcAppId;
  const additionalQuery = condition.query || '';

  let query = '';
  if (value) {
    query = `${condition.srcField} like "${value}"`;
    if (additionalQuery) {
      query += `and ${additionalQuery}`;
    }
  } else {
    if (additionalQuery) {
      query += additionalQuery;
    }
  }

  const fields = getLookupSrcFields(condition);

  let onlyOneRecord = true;
  const lookupRecords = await getAllRecords({
    app,
    query,
    fields,
    onTotalGet: (total) => {
      if (total !== 1) {
        if (option) {
          option.setShown(true);
        } else {
          throw '入力された値に一致するレコードが見つかりませんでした';
        }
        onlyOneRecord = false;
      }
    },
  });
  if (!onlyOneRecord) {
    return record;
  }

  if (option) {
    return apply(condition, record, lookupRecords[0], {
      enqueueSnackbar: option.enqueueSnackbar,
      setLookuped: option.setLookuped,
    });
  }
  return apply(condition, record, lookupRecords[0]);
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
  condition: kintone.plugin.Condition,
  srcRecord: KintoneRecord,
  dstRecord: KintoneRecord,
  option?: {
    enqueueSnackbar: EnqueueSnackbar;
    setLookuped: SetterOrUpdater<boolean>;
  }
) => {
  const record = { ...srcRecord };

  record[condition.dstField].value = dstRecord[condition.srcField].value;
  for (const { from, to } of condition.copies) {
    record[to].value = dstRecord[from].value;

    if (
      option &&
      condition.autoLookup &&
      ['SINGLE_LINE_TEXT', 'NUMBER'].includes(record[to].type)
    ) {
      setTimeout(() => {
        const { record } = getCurrentRecord()!;
        //@ts-ignore
        record[to].lookup = true;
        setCurrentRecord({ record });
      }, 200);
    }
  }

  if (option) {
    option.enqueueSnackbar('参照先からデータが取得されました。', { variant: 'success' });
    option.setLookuped(true);
    lookupObserver[condition.dstField].lookuped = true;
    console.log(lookupObserver);
  }
  return record;
};

export const clearLookup = (condition: kintone.plugin.Condition) => {
  const { record } = getCurrentRecord()!;

  record[condition.dstField].value = '';
  for (const { to } of condition.copies) {
    if (Array.isArray(record[to])) {
      record[to].value = [];
    } else {
      record[to].value = '';
    }
  }

  lookupObserver[condition.dstField].lookuped = false;
  setCurrentRecord({ record });
};

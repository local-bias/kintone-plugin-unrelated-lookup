import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { SetterOrUpdater } from 'recoil';

import { getCurrentRecord, setCurrentRecord } from '@lb-ribbit/kintone-xapp';
import { someFieldValue } from '@/lib/kintone-api';
import { lookupObserver } from '../lookup-observer';
import { PLUGIN_NAME } from '@/lib/statics';
import { getAllRecordsWithCursor, kintoneAPI } from '@konomi-app/kintone-utilities';

type EnqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject | undefined
) => SnackbarKey;

export const lookup = async (params: {
  condition: Plugin.Condition;
  record: kintoneAPI.RecordData;
  option?: {
    input: string;
    hasCached: boolean;
    cachedRecords: kintoneAPI.RecordData[];
    enqueueSnackbar: EnqueueSnackbar;
    setShown: SetterOrUpdater<boolean>;
    setLookuped: SetterOrUpdater<boolean>;
  };
}): Promise<kintoneAPI.RecordData> => {
  const { condition, record, option } = params;

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
  const dstType = record[condition.dstField].type;

  const app = condition.srcAppId;
  const additionalQuery = condition.query || '';

  let query = '';
  if (value) {
    const requireEscaping: kintoneAPI.RecordData[string]['type'][] = [
      'SINGLE_LINE_TEXT',
      'MULTI_LINE_TEXT',
      'RICH_TEXT',
      'CHECK_BOX',
      'RADIO_BUTTON',
      'DROP_DOWN',
      'MULTI_SELECT',
      'STATUS',
    ];

    const valueQuery = requireEscaping.includes(dstType) ? `"${value}"` : value;

    const likeSearchFields: kintoneAPI.RecordData[string]['type'][] = [
      'SINGLE_LINE_TEXT',
      'LINK',
      'MULTI_LINE_TEXT',
      'RICH_TEXT',
      'FILE',
    ];

    const inSearchFields: kintoneAPI.RecordData[string]['type'][] = [
      'CREATOR',
      'MODIFIER',
      'CHECK_BOX',
      'RADIO_BUTTON',
      'DROP_DOWN',
      'MULTI_SELECT',
      'USER_SELECT',
      'ORGANIZATION_SELECT',
      'GROUP_SELECT',
    ];

    if (likeSearchFields.includes(dstType)) {
      query = `${condition.srcField} like ${valueQuery}`;
    } else if (inSearchFields.includes(dstType)) {
      query = `${condition.srcField} in (${valueQuery})`;
    } else {
      console.warn(
        `[${PLUGIN_NAME}] あいまい検索に対応していないフィールドのため、完全一致するレコードのみ絞り込まれます`
      );
      query = `${condition.srcField} = ${valueQuery}`;
    }

    if (additionalQuery) {
      query += `and ${additionalQuery}`;
    }
  } else {
    if (additionalQuery) {
      query += additionalQuery;
    }
  }

  if (process?.env?.NODE_ENV === 'development') {
    console.log(`[${PLUGIN_NAME}] 検索クエリ`, query);
  }

  const fields = getLookupSrcFields(condition);

  let onlyOneRecord = true;
  const lookupRecords = await getAllRecordsWithCursor({
    app,
    query,
    fields,
    guestSpaceId: condition.isSrcAppGuestSpace ? (condition.srcSpaceId ?? undefined) : undefined,
    debug: process?.env?.NODE_ENV === 'development',
    onTotalGet: ({ total }) => {
      if (process?.env?.NODE_ENV === 'development') {
        console.log({ total });
      }
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

export const getLookupSrcFields = (condition: Plugin.Condition) => {
  const fields = [
    ...new Set(
      [condition.copies.map(({ from }) => from), condition.sees, condition.srcField].flat()
    ),
  ];
  return fields;
};

export const apply = (
  condition: Plugin.Condition,
  srcRecord: kintoneAPI.RecordData,
  dstRecord: kintoneAPI.RecordData,
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
    option.setLookuped(true);
    lookupObserver[condition.id].lookuped = true;
    if (process?.env?.NODE_ENV === 'development') {
      console.log({ lookupObserver });
    }
  }
  return record;
};

export const clearLookup = async (condition: Plugin.Condition) => {
  const { record } = getCurrentRecord()!;

  record[condition.dstField].value = '';
  for (const { to } of condition.copies) {
    const field = record[to];
    switch (field.type) {
      case 'SINGLE_LINE_TEXT':
      case 'MULTI_LINE_TEXT':
      case 'RICH_TEXT':
      case 'DROP_DOWN':
      case 'DATE':
      case 'NUMBER':
      case 'CREATED_TIME':
      case 'UPDATED_TIME':
      case 'TIME':
      case 'DATETIME':
      case 'LINK':
        field.value = '';
        break;
      case 'CREATOR':
      case 'MODIFIER':
        field.value = { code: '', name: '' };
        break;
      case 'CATEGORY':
      case 'CHECK_BOX':
      case 'MULTI_SELECT':
      case 'FILE':
      case 'GROUP_SELECT':
      case 'ORGANIZATION_SELECT':
      case 'USER_SELECT':
      case 'STATUS_ASSIGNEE':
      case 'SUBTABLE':
        field.value = [];
        break;
      case 'RADIO_BUTTON':
      case 'STATUS':
        // WIP: 未実装
        break;
      case 'CALC':
      case 'RECORD_NUMBER':
      case '__ID__':
      case '__REVISION__':
      default:
        break;
    }

    if (condition.autoLookup) {
      //@ts-ignore
      record[to].lookup = 'CLEAR';
    }
  }

  lookupObserver[condition.id].lookuped = false;
  setCurrentRecord({ record });
};

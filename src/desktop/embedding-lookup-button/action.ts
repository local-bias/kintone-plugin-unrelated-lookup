import {
  FIELD_TYPES_FOR_IN_SEARCH,
  FIELD_TYPES_FOR_LIKE_SEARCH,
  FIELD_TYPES_FOR_REQUIRE_ESCAPING,
  someFieldValue,
} from '@/lib/kintone-api';
import { PLUGIN_NAME } from '@/lib/statics';
import {
  getAllRecordsWithCursor,
  getCurrentRecord,
  kintoneAPI,
  setCurrentRecord,
} from '@konomi-app/kintone-utilities';
import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { SetterOrUpdater } from 'recoil';
import { cacheAtom } from '../states';
import { store } from '@/lib/store';
import { ENV } from '@/lib/global';

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
    const valueQuery = FIELD_TYPES_FOR_REQUIRE_ESCAPING.includes(dstType) ? `"${value}"` : value;

    if (FIELD_TYPES_FOR_LIKE_SEARCH.includes(dstType)) {
      query = `${condition.srcField} like ${valueQuery}`;
    } else if (FIELD_TYPES_FOR_IN_SEARCH.includes(dstType)) {
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

  ENV === 'development' && console.log(`[${PLUGIN_NAME}] 検索クエリ`, query);

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
      [
        condition.copies.map(({ from }) => from),
        condition.displayFields.map((field) => field.fieldCode),
        condition.srcField,
      ].flat()
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
    const atom = cacheAtom(condition.id);
    option.setLookuped(true);
    store.set(atom, (prev) => ({ ...prev, lookuped: true }));
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

  const atom = cacheAtom(condition.id);
  store.set(atom, (prev) => ({ ...prev, lookuped: false }));
  setCurrentRecord({ record });
};

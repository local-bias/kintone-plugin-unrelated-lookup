import { isProd } from '@/lib/global';
import { store } from '@/lib/store';
import { areKintoneFieldValuesEqual } from '@/lib/utils';
import { PluginCondition } from '@/schema/plugin-config';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { AttachmentProps } from '../embedding-lookup-button/app';
import { isAlreadyLookupedAtom, valueAtLookupAtom, valueAtStartAtom } from '../states';

export const onFieldChange = async (params: {
  condition: PluginCondition;
  record: kintoneAPI.RecordData;
}) => {
  const { condition, record } = params;

  const attachmentProps: AttachmentProps = { conditionId: condition.id };
  const currentValue = record[condition.dstField].value;
  const valueAtStart = store.get(valueAtStartAtom(attachmentProps));
  const valueAtLookup = store.get(valueAtLookupAtom(attachmentProps));

  if (
    areKintoneFieldValuesEqual(currentValue, valueAtStart) ||
    areKintoneFieldValuesEqual(currentValue, valueAtLookup)
  ) {
    return;
  }

  store.set(isAlreadyLookupedAtom({ conditionId: condition.id }), false);
  !isProd && console.log('🗑️ reset alreadyLookupAtom');
};

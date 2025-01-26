import { store } from '@/lib/store';
import { PluginCondition } from '@/schema/plugin-config';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { AttachmentProps } from '../embedding-lookup-button/app';
import { isAlreadyLookupedAtom, valueAtStartAtom } from '../states';

export const initializeSingleMode = (params: {
  record: kintoneAPI.RecordData;
  condition: PluginCondition;
}) => {
  const { record, condition } = params;
  const { id, dstField } = condition;
  if (!record[dstField]) {
    return;
  }

  const attachmentProps: AttachmentProps = { conditionId: id };
  store.set(valueAtStartAtom(attachmentProps), record[dstField].value);
  store.set(isAlreadyLookupedAtom(attachmentProps), false);
};

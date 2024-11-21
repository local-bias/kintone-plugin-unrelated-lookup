import { PluginCondition } from '@/lib/plugin';
import { store } from '@/lib/store';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { AttachmentProps } from '../embedding-lookup-button/app';
import { valueAtStartAtom } from '../states';

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
};

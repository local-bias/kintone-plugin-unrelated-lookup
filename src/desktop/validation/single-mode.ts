import { PluginCondition } from '@/lib/plugin';
import { store } from '@/lib/store';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { AttachmentProps } from '../embedding-lookup-button/app';
import { alreadyCacheAtom } from '../embedding-lookup-button/states';
import { valueAtStartAtom } from '../states';

export const validateSingleMode = (params: {
  record: kintoneAPI.RecordData;
  condition: PluginCondition;
}): { result: boolean } => {
  const { record, condition } = params;
  const { id, dstField } = condition;
  const attachmentProps: AttachmentProps = { conditionId: id };
  if (!record[dstField]?.value) {
    return { result: true };
  }

  const isAlreadyLookuped = store.get(alreadyCacheAtom(id));
  const valueAtStart = store.get(valueAtStartAtom(attachmentProps));

  const currentValue = record[dstField].value;

  // レコード編集開始時から値が変更されており、かつルックアップが実行されていない場合はエラー
  if (valueAtStart !== currentValue && !isAlreadyLookuped) {
    //@ts-expect-error dts-genの型情報に`error`プロパティが存在しないため
    record[dstField].error = '[取得]を押し、参照先からデータを取得してください。';
    return { result: false };
  }
  return { result: true };
};

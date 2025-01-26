import { store } from '@/lib/store';
import { PluginCondition } from '@/schema/plugin-config';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { AttachmentProps } from '../embedding-lookup-button/app';
import { alreadyCacheAtom } from '../embedding-lookup-button/states';
import { valueAtStartAtom } from '../states';
import { t } from '@/lib/i18n';

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
    record[dstField].error = t('desktop.fieldError.buttonNotPressedError');
    return { result: false };
  }
  return { result: true };
};

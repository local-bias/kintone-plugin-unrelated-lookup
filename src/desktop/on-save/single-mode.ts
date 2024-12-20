import { PLUGIN_NAME } from '@/lib/constants';
import { isProd } from '@/lib/global';
import { store } from '@/lib/store';
import { PluginCondition } from '@/schema/plugin-config';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { lookup } from '../embedding-lookup-button/action';
import { AttachmentProps } from '../embedding-lookup-button/app';
import { isAlreadyLookupedAtom, valueAtStartAtom } from '../states';
import { applyError } from './common';

export const singleModeOnSave = async (params: {
  event: kintoneAPI.js.Event;
  condition: PluginCondition;
}) => {
  const { event, condition } = params;
  try {
    const { id, dstField } = condition;

    const attachmentProps: AttachmentProps = { conditionId: id };
    const valueAtStart = store.get(valueAtStartAtom(attachmentProps));
    const isAlreadyLookuped = store.get(isAlreadyLookupedAtom(attachmentProps));

    // 次の場合は処理の対象外
    // 1. プラグインに設定されているフィールド情報が不正
    // 2. 対象フィールドに値が設定されていない
    // 3. 値が変更されていない
    // 4. ユーザーの操作によってルックアップが実行されている場合
    if (
      !event.record[dstField]?.value ||
      event.record[dstField].value === valueAtStart ||
      isAlreadyLookuped
    ) {
      return;
    }

    const lookuped = await lookup({ condition, attachmentProps, record: event.record });

    if (!isProd) {
      console.log({ lookuped });
    }

    event.record = lookuped;
  } catch (error: any) {
    console.error(`[${PLUGIN_NAME}] レコード保存時のルックアップ実行でエラーが発生しました`, {
      error,
    });
    await applyError({ condition, event, error });
  }
};

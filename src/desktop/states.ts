import { GUEST_SPACE_ID, isProd } from '@/lib/global';
import { cleanse, restorePluginConfig } from '@/lib/plugin';
import { getAppId, getFormFields, kintoneAPI } from '@konomi-app/kintone-utilities';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { areAttachmentsEqual, AttachmentAtomParams } from './embedding-lookup-button/states';

export const pluginConfigAtom = atom(cleanse(restorePluginConfig()));

export const pluginConditionsAtom = atom((get) => get(pluginConfigAtom).conditions);

export const validPluginConditionsAtom = atom((get) =>
  get(pluginConditionsAtom).filter((c) => c.srcAppId && c.srcField)
);

export const singleTypePluginConditionsAtom = atom((get) =>
  get(validPluginConditionsAtom).filter((c) => c.type === 'single' && c.dstField)
);

export const valueAtStartAtom = atomFamily(
  (_params: AttachmentAtomParams) => atom<kintoneAPI.Field['value']>(null),
  areAttachmentsEqual
);

export const valueAtLookupAtom = atomFamily(
  (_params: AttachmentAtomParams) => atom<kintoneAPI.Field['value']>(null),
  areAttachmentsEqual
);

export const currentAppPropertiesAtom = atom<Promise<kintoneAPI.FieldProperties>>(async () => {
  const { properties } = await getFormFields({
    app: getAppId()!,
    guestSpaceId: GUEST_SPACE_ID,
    debug: !isProd,
  });
  return properties;
});

/**
 * プラグインの設定単位で、キャッシュが開始されているかどうかを管理する
 * レコードの詳細画面やレコード追加画面では、ページリロード無しにeventが発生するため、1度だけキャッシュを開始する
 */
export const isCacheStartedAtom = atomFamily((_conditionId: string) => atom(false));

/**
 * `true`の場合、レコード取得に失敗し、フェールソフトモードになっていることを示す
 */
export const failSoftModeAtom = atomFamily((_conditionId: string) => atom(false));

/**
 * 設置したルックアップフィールド単位で、ルックアップが完了しているかどうかを管理する
 * レコード保存時のバリデーションや、再ルックアップの判定に使用する
 */
export const isAlreadyLookupedAtom = atomFamily(
  (_params: AttachmentAtomParams) => atom(false),
  areAttachmentsEqual
);

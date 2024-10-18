import { getAllRecords, getFieldValueAsString, getYuruChara } from '@konomi-app/kintone-utilities';
import { useAtomCallback } from 'jotai/utils';
import { FC, useCallback, useEffect } from 'react';
import { getLookupSrcFields } from '../action';
import { alreadyCacheAtom, isRecordCacheEnabledAtom, pluginConditionAtom } from '../states';
import { HandledRecord, srcAllRecordsAtom } from '../states/records';
import { useConditionId } from './condition-id-context';
import { ENV } from '@/lib/global';
import { useAtomValue } from 'jotai';

const Container: FC = () => {
  const conditionId = useConditionId();
  const isRecordCacheEnabled = useAtomValue(isRecordCacheEnabledAtom(conditionId));

  const createCache = useAtomCallback(
    useCallback(
      async (get, set, params: { conditionId: string; isRecordCacheEnabled: boolean }) => {
        const { conditionId, isRecordCacheEnabled } = params;
        if (!isRecordCacheEnabled) {
          ENV === 'development' &&
            console.warn(`キャッシュが有効になっていないため、処理を中断しました`);
          return;
        }

        const allRecords = get(srcAllRecordsAtom(conditionId));
        if (allRecords.length) {
          return;
        }

        const condition = get(pluginConditionAtom(conditionId));
        try {
          const app = condition.srcAppId;
          if (!app) {
            throw new Error('アプリ情報が取得できませんでした');
          }

          const {
            query = '',
            isCaseSensitive,
            isKatakanaSensitive,
            isZenkakuEisujiSensitive,
            isHankakuKatakanaSensitive,
          } = condition;

          const fields = getLookupSrcFields(condition);
          await getAllRecords({
            app,
            query,
            fields,
            guestSpaceId: condition.isSrcAppGuestSpace
              ? (condition.srcSpaceId ?? undefined)
              : undefined,
            debug: process?.env?.NODE_ENV === 'development',
            onStep: ({ records }) => {
              const viewRecords = records.map<HandledRecord>((record) => {
                let __quickSearch = Object.values(record)
                  .map((field) => getFieldValueAsString(field))
                  .join('__');

                __quickSearch = getYuruChara(__quickSearch, {
                  isCaseSensitive,
                  isKatakanaSensitive,
                  isZenkakuEisujiSensitive,
                  isHankakuKatakanaSensitive,
                });

                return { record, __quickSearch };
              });

              set(srcAllRecordsAtom(conditionId), viewRecords);
            },
          });
        } finally {
          set(alreadyCacheAtom(conditionId), true);
        }
      },
      []
    )
  );

  useEffect(() => {
    createCache({ conditionId, isRecordCacheEnabled });
  }, [conditionId, isRecordCacheEnabled]);

  return null;
};

export default Container;

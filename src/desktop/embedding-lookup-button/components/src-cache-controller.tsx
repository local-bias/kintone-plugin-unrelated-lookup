import { useEffect, FC } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getAllRecords, getFieldValueAsString, getYuruChara } from '@konomi-app/kintone-utilities';
import { pluginConditionState, alreadyCacheState, cacheValidationState } from '../states';
import { getLookupSrcFields } from '../action';
import { PLUGIN_NAME } from '@/common/statics';
import { HandledRecord, srcAllRecordsState } from '../states/records';
import { GUEST_SPACE_ID } from '@/common/global';

const Container: FC = () => {
  const setAllRecords = useSetRecoilState(srcAllRecordsState);
  const setAlreadyCache = useSetRecoilState(alreadyCacheState);
  const condition = useRecoilValue(pluginConditionState);
  const enablesCache = useRecoilValue(cacheValidationState);

  useEffect(() => {
    (async () => {
      if (!condition || !enablesCache) {
        return;
      }
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
          guestSpaceId: GUEST_SPACE_ID,
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

            setAllRecords(viewRecords);
          },
        });
        console.info(`[${PLUGIN_NAME}] レコード情報のキャッシュが完了しました`);
      } finally {
        setAlreadyCache(true);
      }
    })();
  }, [condition, enablesCache]);

  return null;
};

export default Container;

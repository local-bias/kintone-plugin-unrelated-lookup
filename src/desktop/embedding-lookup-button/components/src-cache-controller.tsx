import { useEffect, FC } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { getAllRecords } from '@common/kintone-rest-api';
import { Record as KintoneRecord } from '@kintone/rest-api-client/lib/client/types';

import { pluginConditionState, alreadyCacheState, cacheValidationState } from '../states';
import { getLookupSrcFields } from '../action';
import { PLUGIN_NAME } from '@common/statics';
import { getQuickSearchString } from '@common/kintone';
import { katakana2hiragana } from '@common/utilities';
import { HandledRecord, srcAllRecordsState } from '../states/records';

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
        const query = condition.query || '';
        const fields = getLookupSrcFields(condition);
        await getAllRecords({
          app,
          query,
          fields,
          onAdvance: (records) => {
            const viewRecords = records.map<HandledRecord>((record) => {
              let __quickSearch = getQuickSearchString(record);

              if (condition.ignoresLetterCase) {
                __quickSearch = __quickSearch.toLowerCase();
              }

              if (condition.ignoresKatakana) {
                __quickSearch = katakana2hiragana(__quickSearch);
              }

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

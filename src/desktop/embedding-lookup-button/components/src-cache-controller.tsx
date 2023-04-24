import { useEffect, FC } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getAllRecords, getFieldValueAsString } from '@konomi-app/kintone-utilities';
import {
  pluginConditionState,
  alreadyCacheState,
  cacheValidationState,
  guestSpaceIdState,
} from '../states';
import { getLookupSrcFields } from '../action';
import { PLUGIN_NAME } from '@/common/statics';
import {
  convertHankakuKatakanaToZenkaku,
  convertKatakanaToHiragana,
  convertZenkakuEisujiToHankaku,
} from '@/common/utilities';
import { HandledRecord, srcAllRecordsState } from '../states/records';

const Container: FC = () => {
  const setAllRecords = useSetRecoilState(srcAllRecordsState);
  const setAlreadyCache = useSetRecoilState(alreadyCacheState);
  const condition = useRecoilValue(pluginConditionState);
  const enablesCache = useRecoilValue(cacheValidationState);
  const guestSpaceId = useRecoilValue(guestSpaceIdState);

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
          ignoresLetterCase = true,
          ignoresKatakana = true,
          ignoresHankakuKatakana = true,
          ignoresZenkakuEisuji = true,
        } = condition;

        const fields = getLookupSrcFields(condition);
        await getAllRecords({
          app,
          query,
          fields,
          guestSpaceId: guestSpaceId || undefined,
          debug: process?.env?.NODE_ENV === 'development',
          onStep: ({ records }) => {
            const viewRecords = records.map<HandledRecord>((record) => {
              let __quickSearch = Object.values(record)
                .map((field) => getFieldValueAsString(field))
                .join('__');

              if (ignoresZenkakuEisuji) {
                __quickSearch = convertZenkakuEisujiToHankaku(__quickSearch);
              }

              if (ignoresLetterCase) {
                __quickSearch = __quickSearch.toLowerCase();
              }

              if (ignoresHankakuKatakana) {
                __quickSearch = convertHankakuKatakanaToZenkaku(__quickSearch);
              }

              if (ignoresKatakana) {
                __quickSearch = convertKatakanaToHiragana(__quickSearch);
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

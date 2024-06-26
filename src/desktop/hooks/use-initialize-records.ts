import {
  getAllRecords,
  getFieldValueAsString,
  getYuruChara,
  kintoneAPI,
} from '@konomi-app/kintone-utilities';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { allSrcRecordsState, currentKintoneEventState } from '../states/kintone';
import { useEffect } from 'react';
import { pluginConditionsState } from '../states/plugin';
import { getLookupSrcFields } from '../embedding-lookup-button/action';
import { HandledRecord } from '../embedding-lookup-button/states/records';
import { isTargetEvent } from '../actions';

export const useInitializeRecords = () => {
  const currentKintoneEvent = useRecoilValue(currentKintoneEventState);

  const initializeRecords = useRecoilCallback(
    ({ set, snapshot }) =>
      async () => {
        const pluginConditions = await snapshot.getPromise(pluginConditionsState);

        const initialize = (condition: Plugin.Condition) => {
          const {
            srcAppId: app,
            dstField,
            query = '',
            isCaseSensitive,
            isKatakanaSensitive,
            isZenkakuEisujiSensitive,
            isHankakuKatakanaSensitive,
          } = condition;
          if (!app) {
            throw new Error('アプリ情報が設定されていません');
          }
          const fields = getLookupSrcFields(condition);

          const onStep: Parameters<typeof getAllRecords>[0]['onStep'] = ({ records }) => {
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

            set(allSrcRecordsState(dstField), viewRecords);
          };

          return getAllRecords({
            app,
            query,
            fields,
            guestSpaceId: condition.isSrcAppGuestSpace
              ? condition.srcSpaceId ?? undefined
              : undefined,
            debug: process?.env?.NODE_ENV === 'development',
            onStep,
          });
        };

        const results = await Promise.allSettled(pluginConditions.map(initialize));

        process?.env?.NODE_ENV === 'development' && console.log('initializeRecords', results);
      },
    []
  );

  useEffect(() => {
    if (
      !isTargetEvent({
        current: currentKintoneEvent,
        targets: ['app.record.create.show', 'app.record.edit.show'],
      })
    ) {
      return;
    }
    initializeRecords();
  }, [currentKintoneEvent]);

  return {};
};

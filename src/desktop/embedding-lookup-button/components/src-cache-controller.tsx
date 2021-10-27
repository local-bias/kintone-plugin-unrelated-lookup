import React, { useEffect, VFC } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { getAllRecords } from '@common/kintone-rest-api';

import {
  srcAllRecordsState,
  pluginConditionState,
  alreadyCacheState,
  cacheValidationState,
} from '../states';
import { getLookupSrcFields } from '../action';

const Container: VFC = () => {
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
        const fields = getLookupSrcFields(condition);
        await getAllRecords({ app, fields, onAdvance: (records) => setAllRecords(records) });
      } finally {
        setAlreadyCache(true);
      }
    })();
  }, [enablesCache]);

  return null;
};

export default Container;

import React, { useState, VFC, VFCX } from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';

import { apply, clearLookup, lookup } from '../action';
import { useSnackbar } from 'notistack';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import {
  alreadyCacheState,
  cacheValidationState,
  dialogPageIndexState,
  dialogTitleState,
  dialogVisibleState,
  pluginConditionState,
  searchInputState,
  srcAllRecordsState,
} from '../states';
import { getCurrentRecord } from '@common/kintone';
import { someFieldValue } from '@common/kintone-api';

type Props = {
  onLookupButtonClick: () => void;
  onClearButtonClick: () => void;
  loading: boolean;
};

const Component: VFCX<Props> = ({
  className,
  onLookupButtonClick,
  onClearButtonClick,
  loading,
}) => (
  <div {...{ className }}>
    <div>
      <Button color='primary' onClick={onLookupButtonClick} disabled={loading}>
        取得
      </Button>
      {loading && <CircularProgress className='circle' size={24} />}
    </div>
    <Button color='primary' onClick={onClearButtonClick} disabled={loading}>
      クリア
    </Button>
  </div>
);

const StyledComponent = styled(Component)`
  display: flex;
  & > div {
    position: relative;

    & > .circle {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -12px 0 0 -12px;
    }
  }
`;

const Container: VFC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const setShown = useSetRecoilState(dialogVisibleState);
  const setInput = useSetRecoilState(searchInputState);
  const setPageIndex = useSetRecoilState(dialogPageIndexState);
  const setCacheValidation = useSetRecoilState(cacheValidationState);
  const [loading, setLoading] = useState(false);

  const onLookupButtonClick = useRecoilCallback(({ snapshot }) => async () => {
    setLoading(true);

    try {
      setPageIndex(1);
      setCacheValidation(true);

      const condition = (await snapshot.getPromise(pluginConditionState))!;

      const { record } = getCurrentRecord();
      const input = (record[condition.dstField].value as string) || '';
      setInput(input);

      if (!input) {
        setShown(true);
        return;
      }

      const hasCached = await snapshot.getPromise(alreadyCacheState);
      const cachedRecords = await snapshot.getPromise(srcAllRecordsState);

      // 全レコードのキャッシュが取得済みであれば、キャッシュから対象レコードを検索します
      // 対象レコードが１件だけであれば、ルックアップ対象を確定します
      if (hasCached) {
        const filterd = cachedRecords.filter((r) => someFieldValue(r[condition.srcField], input));

        if (filterd.length === 1) {
          apply(filterd[0], condition, enqueueSnackbar);
          return;
        }
      }

      await lookup(enqueueSnackbar, setShown, condition);
    } catch (error) {
      enqueueSnackbar('ルックアップ時にエラーが発生しました', { variant: 'error' });
      throw error;
    } finally {
      setLoading(false);
    }
  });

  const onClearButtonClick = useRecoilCallback(({ snapshot }) => async () => {
    const condition = await snapshot.getPromise(pluginConditionState);
    clearLookup(condition!);
    enqueueSnackbar('参照先フィールドをクリアしました', { variant: 'success' });
  });

  return <StyledComponent {...{ onLookupButtonClick, onClearButtonClick, loading }} />;
};

export default Container;

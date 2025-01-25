import { PluginConditionDeleteButton } from '@konomi-app/kintone-utilities-react';
import { produce } from 'immer';
import { useAtomValue } from 'jotai';
import { RESET, useAtomCallback } from 'jotai/utils';
import { useSnackbar } from 'notistack';
import { FC, memo, useCallback } from 'react';
import { pluginConfigAtom, selectedConditionIdAtom } from '../../../states/plugin';

const Container: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const storage = useAtomValue(pluginConfigAtom);

  const onClick = useAtomCallback(
    useCallback(async (get, set) => {
      const selectedConditionId = await get(selectedConditionIdAtom);
      set(pluginConfigAtom, (_, _storage = _!) =>
        produce(_storage, (draft) => {
          draft.conditions = draft.conditions.filter((c) => c.id !== selectedConditionId);
        })
      );
      set(selectedConditionIdAtom, RESET);
      enqueueSnackbar('設定を削除しました', { variant: 'success' });
    }, [])
  );

  if ((storage?.conditions.length ?? 0) < 2) {
    return null;
  }

  return <PluginConditionDeleteButton {...{ onClick }} />;
};

export default memo(Container);

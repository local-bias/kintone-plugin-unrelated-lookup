import { PluginConditionDeleteButton } from '@konomi-app/kintone-utilities-react';
import { produce } from 'immer';
import { useSnackbar } from 'notistack';
import { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { selectedConditionIdState, storageState } from '../../../states/plugin';

const Container: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const storage = useRecoilValue(storageState);

  const onClick = useRecoilCallback(
    ({ snapshot, set, reset }) =>
      async () => {
        const selectedConditionId = await snapshot.getPromise(selectedConditionIdState);
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions = draft.conditions.filter((c) => c.id !== selectedConditionId);
          })
        );
        reset(selectedConditionIdState);
        enqueueSnackbar('設定を削除しました', { variant: 'success' });
      },
    []
  );

  if ((storage?.conditions.length ?? 0) < 2) {
    return null;
  }

  return <PluginConditionDeleteButton {...{ onClick }} />;
};

export default memo(Container);

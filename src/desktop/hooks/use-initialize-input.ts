import { useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { currentKintoneEventState } from '../states/kintone';
import { isTargetEvent } from '../actions';
import { lookupStatusState, pluginConditionsState } from '../states/plugin';

export const useInitializeInput = () => {
  const currentKintoneEvent = useRecoilValue(currentKintoneEventState);

  const initializeInput = useRecoilCallback(
    ({ reset, set, snapshot }) =>
      async () => {
        const conditions = await snapshot.getPromise(pluginConditionsState);

        for (const condition of conditions) {
          reset(lookupStatusState(condition.dstField));
        }
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
    initializeInput();
  }, [currentKintoneEvent]);

  return {};
};

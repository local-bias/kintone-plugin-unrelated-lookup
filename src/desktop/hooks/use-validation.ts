import { useRecoilCallback, useRecoilValue } from 'recoil';
import { currentKintoneEventState } from '../states/kintone';
import { useEffect } from 'react';
import { isTargetEvent } from '../actions';

export const useValidation = () => {
  const currentKintoneEvent = useRecoilValue(currentKintoneEventState);

  const validation = useRecoilCallback(() => async () => {}, []);

  useEffect(() => {
    if (
      !isTargetEvent({
        current: currentKintoneEvent,
        targets: ['app.record.create.submit', 'app.record.edit.submit'],
      })
    ) {
      return;
    }
    validation();
  }, [currentKintoneEvent]);
};

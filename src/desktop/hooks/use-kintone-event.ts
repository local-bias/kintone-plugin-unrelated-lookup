import { useSetRecoilState } from 'recoil';
import { currentKintoneEventState } from '../states/kintone';
import { listener } from '@/lib/listener';

export const useKintoneEvent = () => {
  const setCurrentEvent = useSetRecoilState(currentKintoneEventState);

  listener.add(
    [
      'app.record.create.show',
      'app.record.edit.show',
      'app.record.edit.submit',
      'app.record.create.submit',
    ],
    (event) => {
      console.log(event);
      setCurrentEvent(event.type);
      return event;
    }
  );

  return {};
};

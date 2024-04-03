import { useEffect, FC } from 'react';
import { useRecoilValue } from 'recoil';
import { useLookup } from '../hooks/use-lookup';
import { pluginConditionState } from '../states';
import { getMetaFields_UNSTABLE } from '@konomi-app/kintone-utilities';

const Container: FC = () => {
  const condition = useRecoilValue(pluginConditionState);
  const { start } = useLookup();

  useEffect(() => {
    if (!condition) {
      return;
    }
    const fields = getMetaFields_UNSTABLE() ?? [];
    const targetField = fields.find((field) => field.var === condition.dstField);
    if (!targetField) {
      return;
    }

    const inputElement = document.querySelector<HTMLInputElement>(
      `.value-${targetField.id} > div > input`
    );
    if (!inputElement) {
      return;
    }

    inputElement.addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter') {
        return;
      }
      start();
    });
  }, [condition]);

  return null;
};

export default Container;

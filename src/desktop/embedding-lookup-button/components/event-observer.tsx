import { getMetaFields_UNSTABLE } from '@konomi-app/kintone-utilities';
import { useAtomValue } from 'jotai';
import { FC, useEffect } from 'react';
import { useLookup } from '../hooks/use-lookup';
import { pluginConditionAtom } from '../states';
import { useConditionId } from './attachment-context';

const FieldKeyEventListener: FC = () => {
  const conditionId = useConditionId();
  const condition = useAtomValue(pluginConditionAtom(conditionId));
  const { start } = useLookup();

  useEffect(() => {
    if (!condition) {
      return;
    }
    const fields = getMetaFields_UNSTABLE() ?? [];
    const targetField = fields.find((field) => field?.var === condition.dstField);
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

export default FieldKeyEventListener;

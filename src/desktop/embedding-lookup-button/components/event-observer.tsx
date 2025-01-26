import { currentKintoneEventTypeAtom } from '@/desktop/states';
import { isProd } from '@/lib/global';
import { getMetaFields_UNSTABLE } from '@konomi-app/kintone-utilities';
import { useAtomValue } from 'jotai';
import { FC, useEffect } from 'react';
import { useLookup } from '../hooks/use-lookup';
import { pluginConditionAtom } from '../states';
import { useAttachmentProps } from './attachment-context';

const FieldKeyEventListener: FC = () => {
  const attachmentProps = useAttachmentProps();
  const condition = useAtomValue(pluginConditionAtom(attachmentProps.conditionId));
  const kintoneEvent = useAtomValue(currentKintoneEventTypeAtom);
  const { start } = useLookup();

  useEffect(() => {
    if (!condition) {
      return;
    }
    let inputElement = null;

    const fields = getMetaFields_UNSTABLE() ?? [];
    const targetField = fields.find((field) => field?.var === condition.dstField);
    if (!targetField) {
      !isProd && console.error('targetField not found', condition);
      return;
    }

    inputElement = document.querySelector<HTMLInputElement>(
      `.value-${targetField.id} > div > input`
    );

    if (!inputElement) {
      !isProd && console.error('targetField not found', condition);
      return;
    }

    inputElement.addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter') {
        return;
      }
      start();
    });
  }, [condition, kintoneEvent]);

  return null;
};

export default FieldKeyEventListener;

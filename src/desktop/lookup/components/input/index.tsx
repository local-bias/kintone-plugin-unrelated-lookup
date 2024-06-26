import { pluginConditionsState } from '@/desktop/states/plugin';
import { getMetaFieldId_UNSTABLE } from '@konomi-app/kintone-utilities';
import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import { useRecoilValue } from 'recoil';

const Component: FC = () => {
  const conditions = useRecoilValue(pluginConditionsState);

  const portalComponents = conditions.map((condition) => {
    const fieldId = getMetaFieldId_UNSTABLE(condition.dstField);
    return createPortal(<div>🐸</div>, document.body);
  });

  return <>{portalComponents}</>;
};

export default Component;

import React, { FC } from 'react';
import { PluginConditionTabs, PluginConditionTab } from '@konomi-app/kintone-utilities-react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { conditionsState, tabIndexState } from '../../../states/plugin';

import TabLabel from './tab-label';

const Component: FC = () => {
  const tabIndex = useRecoilValue(tabIndexState);
  const conditions = useRecoilValue(conditionsState);

  const onTabChange = useRecoilCallback(
    ({ set }) =>
      (_: any, index: number) => {
        set(tabIndexState, index);
      },
    []
  );

  return (
    <PluginConditionTabs tabIndex={tabIndex} onChange={onTabChange}>
      {conditions.map((_, i) => (
        <PluginConditionTab key={i} index={i}>
          <TabLabel index={i} />
        </PluginConditionTab>
      ))}
    </PluginConditionTabs>
  );
};

export default Component;

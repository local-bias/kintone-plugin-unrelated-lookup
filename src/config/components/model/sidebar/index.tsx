import React, { FC } from 'react';
import {
  PluginSidebarConditionAppendButton,
  PluginSidebarConditionTab,
  PluginSidebarConditionTabs,
  PluginSidebarLayout,
} from '@konomi-app/kintone-utility-component';

import { useRecoilCallback, useRecoilValue } from 'recoil';
import { conditionsState, storageState, tabIndexState } from '../../../states/plugin';

import TabLabel from './tab-label';
import produce from 'immer';
import { getNewCondition } from '@common/plugin';

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

  const appendCondition = useRecoilCallback(
    ({ set }) =>
      () => {
        set(storageState, (_, _storage = _!) =>
          produce(_storage, (draft) => {
            draft.conditions.push(getNewCondition());
          })
        );
      },
    []
  );

  return (
    <PluginSidebarLayout>
      <PluginSidebarConditionAppendButton onClick={appendCondition} />
      <PluginSidebarConditionTabs value={tabIndex} onChange={onTabChange}>
        {conditions.map((_, i) => (
          <PluginSidebarConditionTab key={i} index={i}>
            <TabLabel index={i} />
          </PluginSidebarConditionTab>
        ))}
      </PluginSidebarConditionTabs>
    </PluginSidebarLayout>
  );
};

export default Component;

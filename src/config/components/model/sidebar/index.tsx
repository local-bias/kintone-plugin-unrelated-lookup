import React, { FC } from 'react';
import {
  PluginConditionAppendButton,
  PluginConditionTabs,
  PluginConditionTab,
  PluginSidebar,
} from '@konomi-app/kintone-utilities-react';

import { useRecoilCallback, useRecoilValue } from 'recoil';
import { conditionsState, storageState, tabIndexState } from '../../../states/plugin';

import TabLabel from './tab-label';
import { produce } from 'immer';
import { getNewCondition } from '@/common/plugin';

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
    <PluginSidebar>
      <PluginConditionAppendButton onClick={appendCondition} />
      <PluginConditionTabs tabIndex={tabIndex} onChange={onTabChange}>
        {conditions.map((_, i) => (
          <PluginConditionTab key={i} index={i}>
            <TabLabel index={i} />
          </PluginConditionTab>
        ))}
      </PluginConditionTabs>
    </PluginSidebar>
  );
};

export default Component;

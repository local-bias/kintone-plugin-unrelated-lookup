import { Tabs } from '@mui/material';
import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { conditionsState, tabIndexState } from '../../../states/plugin';
import ConditionTab from './condition-tab';

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
    <Tabs value={tabIndex} onChange={onTabChange} orientation='vertical' variant='standard'>
      {conditions.map((condition, i) => (
        <ConditionTab key={i} index={i} />
      ))}
    </Tabs>
  );
};

export default Component;

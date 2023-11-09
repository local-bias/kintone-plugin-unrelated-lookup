import React, { FC } from 'react';
import { PluginSidebar } from '@konomi-app/kintone-utilities-react';
import ConditionAdditionButton from './condition-addition-button';
import Tabs from './tabs';

const Component: FC = () => {
  return (
    <PluginSidebar>
      <ConditionAdditionButton />
      <Tabs />
    </PluginSidebar>
  );
};

export default Component;

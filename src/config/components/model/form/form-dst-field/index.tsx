import { conditionTypeState } from '@/config/states/plugin';
import { type FC } from 'react';
import { useRecoilValue } from 'recoil';
import Single from './single';
import Subtable from './subtable';

const Component: FC = () => {
  // const conditionType = useRecoilValue(conditionTypeState);

  // if (conditionType === 'subtable') {
  //   return <Subtable />;
  // }
  return <Single />;
};

export default Component;

import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { storageState } from '../../../states/plugin';
import Condition from './condition';
import { ConditionIndexProvider } from '../../functional/condition-index-provider';

type Props = Readonly<{
  conditionLength: number;
}>;

const Component: FC<Props> = ({ conditionLength }) => (
  <div className='w-full py-4'>
    {new Array(conditionLength).fill('').map((_, index) => (
      <ConditionIndexProvider key={index} conditionIndex={index}>
        <Condition key={index} />
      </ConditionIndexProvider>
    ))}
  </div>
);

const Container: FC = () => {
  const storage = useRecoilValue(storageState);

  const conditionLength = storage?.conditions?.length ?? 1;

  return <Component conditionLength={conditionLength} />;
};

export default Container;

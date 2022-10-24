import { FormControlLabel, Switch } from '@mui/material';
import React, { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { ignoresHankakuKatakanaState } from '../../../states/plugin';
import { useConditionIndex } from '../../functional/condition-index-provider';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();
  const enables = useRecoilValue(ignoresHankakuKatakanaState(conditionIndex));

  const onChange = useRecoilCallback(
    ({ set }) =>
      (checked: boolean) => {
        set(ignoresHankakuKatakanaState(conditionIndex), checked);
      },
    [conditionIndex]
  );

  return (
    <FormControlLabel
      control={<Switch color='primary' checked={enables} />}
      onChange={(_, checked) => onChange(checked)}
      label='絞り込みの際、半角カナと全角カナを区別しない'
    />
  );
};

export default memo(Component);

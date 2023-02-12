import { TextField } from '@mui/material';
import React, { ChangeEventHandler, FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { queryState } from '../../../../states/plugin';
import { useConditionIndex } from '../../../functional/condition-index-provider';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();
  const query = useRecoilValue(queryState(conditionIndex));

  const onChange: ChangeEventHandler<HTMLInputElement> = useRecoilCallback(
    ({ set }) =>
      (event) => {
        set(queryState(conditionIndex), event.target.value);
      },
    [conditionIndex]
  );

  return (
    <TextField
      label='クエリー'
      placeholder='例: 契約ステータス not in ("解約")'
      value={query}
      onChange={onChange}
      sx={{ width: 400 }}
    />
  );
};

export default memo(Component);

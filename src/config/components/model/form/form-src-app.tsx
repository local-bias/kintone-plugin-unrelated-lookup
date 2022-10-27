import { Autocomplete, Skeleton, TextField } from '@mui/material';
import React, { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { kintoneAppsState } from '../../../states/kintone';
import { srcAppIdState } from '../../../states/plugin';
import { useConditionIndex } from '../../functional/condition-index-provider';

const Component: FCX = () => {
  const conditionIndex = useConditionIndex();
  const allApps = useRecoilValue(kintoneAppsState);
  const srcAppId = useRecoilValue(srcAppIdState(conditionIndex));

  const onAppChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(srcAppIdState(conditionIndex), value);
      },
    [conditionIndex]
  );

  return (
    <Autocomplete
      value={allApps.find((app) => app.appId === srcAppId) ?? null}
      sx={{ width: '350px' }}
      options={allApps}
      isOptionEqualToValue={(option, v) => option.appId === v.appId}
      getOptionLabel={(app) => `${app.name}(id: ${app.appId})`}
      onChange={(_, app) => onAppChange(app?.appId ?? '')}
      renderInput={(params) => (
        <TextField {...params} label='対象グループ' variant='outlined' color='primary' />
      )}
    />
  );
};

const Container: FC = () => {
  return (
    <Suspense fallback={<Skeleton width={350} height={56} />}>
      <Component />
    </Suspense>
  );
};

export default memo(Container);

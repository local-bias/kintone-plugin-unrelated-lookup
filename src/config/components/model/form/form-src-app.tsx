import { Autocomplete, Skeleton, TextField } from '@mui/material';
import React, { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { kintoneAppsState } from '../../../states/kintone';
import { srcAppIdState } from '../../../states/plugin';

const Component: FCX = () => {
  const allApps = useRecoilValue(kintoneAppsState);
  const srcAppId = useRecoilValue(srcAppIdState);

  const onAppChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(srcAppIdState, value);
      },
    []
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
        <TextField {...params} label='対象アプリ' variant='outlined' color='primary' />
      )}
    />
  );
};

const Container: FC = () => {
  return (
    <Suspense fallback={<Skeleton variant='rounded' width={350} height={56} />}>
      <Component />
    </Suspense>
  );
};

export default memo(Container);

import { Autocomplete, Skeleton, TextField } from '@mui/material';
import { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { kintoneAppsState, kintoneSpacesState } from '../../../states/kintone';
import { isSrcAppGuestSpaceState, srcAppIdState, srcSpaceIdState } from '../../../states/plugin';

const Component: FCX = () => {
  const allApps = useRecoilValue(kintoneAppsState);
  const srcAppId = useRecoilValue(srcAppIdState);

  const onAppChange = useRecoilCallback(
    ({ snapshot, set }) =>
      async (value: string) => {
        set(srcAppIdState, value);

        const allApps = await snapshot.getPromise(kintoneAppsState);
        const srcApp = allApps.find((app) => app.appId === value);
        if (!srcApp) {
          return;
        }

        const spaces = await snapshot.getPromise(kintoneSpacesState);
        const srcSpace = spaces.find((space) => space.id === srcApp.spaceId);
        if (!srcSpace) {
          return;
        }
        set(srcSpaceIdState, srcSpace.id ?? null);
        set(isSrcAppGuestSpaceState, srcSpace.isGuest);
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

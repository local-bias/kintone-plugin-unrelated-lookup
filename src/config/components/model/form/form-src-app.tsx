import { Autocomplete, Box, Skeleton, TextField } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { FC, FCX, memo, Suspense, useCallback } from 'react';
import { kintoneAppsAtom, kintoneSpacesAtom } from '../../../states/kintone';
import { isSrcAppGuestSpaceAtom, srcAppIdAtom, srcSpaceIdAtom } from '../../../states/plugin';

const Component: FCX = () => {
  const allApps = useAtomValue(kintoneAppsAtom);
  const srcAppId = useAtomValue(srcAppIdAtom);

  const onAppChange = useAtomCallback(
    useCallback(async (get, set, value: string) => {
      set(srcAppIdAtom, value);

      const allApps = await get(kintoneAppsAtom);
      const srcApp = allApps.find((app) => app.appId === value);
      if (!srcApp) {
        return;
      }

      const spaces = await get(kintoneSpacesAtom);
      const srcSpace = spaces.find((space) => space.id === srcApp.spaceId);
      if (!srcSpace) {
        return;
      }
      set(srcSpaceIdAtom, srcSpace.id ?? null);
      set(isSrcAppGuestSpaceAtom, srcSpace.isGuest);
    }, [])
  );

  return (
    <Autocomplete
      value={allApps.find((app) => app.appId === srcAppId) ?? null}
      sx={{ width: '350px' }}
      options={allApps}
      isOptionEqualToValue={(option, v) => option.appId === v.appId}
      getOptionLabel={(app) => `${app.name}(id: ${app.appId})`}
      onChange={(_, app) => onAppChange(app?.appId ?? '')}
      renderOption={(props, app) => {
        const { key, ...optionProps } = props;
        return (
          <Box key={key} component='li' {...optionProps}>
            <div className='grid'>
              <div className='text-xs text-gray-400'>
                id: {app.code}
                {app.appId}
              </div>
              {app.name}
            </div>
          </Box>
        );
      }}
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

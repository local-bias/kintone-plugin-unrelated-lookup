import { kx } from '../types/kintone.api';

const END_POINT = '/k/v1/records';

const LIMIT_APP = 100;

export const getAllApps = async (offset: number = 0, _apps: kx.App[] = []): Promise<kx.App[]> => {
  const { apps }: { apps: kx.App[] } = await kintone.api(
    kintone.api.url(`/k/v1/apps`, true),
    'GET',
    {
      limit: LIMIT_APP,
      offset,
    }
  );

  const allApps = [..._apps, ...apps];

  return apps.length === LIMIT_APP ? getAllApps(offset + LIMIT_APP, allApps) : allApps;
};

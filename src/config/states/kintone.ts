import { GUEST_SPACE_ID, isProd } from '@/lib/global';
import { FIELD_TYPES_SYSTEM, omitFieldProperties } from '@/lib/kintone-api';
import {
  filterFieldProperties,
  getAllApps,
  getAppId,
  getFormFields,
  getSpace,
  withSpaceIdFallback,
} from '@konomi-app/kintone-utilities';
import { kintoneAPI } from '@konomi-app/kintone-utilities/dist/types/api';
import { atom } from 'jotai';
import { dstSubtableFieldCodeAtom, srcAppIdAtom } from './plugin';

const currentAppIdAtom = atom<number>(() => {
  const appId = getAppId();
  if (!appId) {
    throw new Error('アプリIDが取得できませんでした');
  }
  return appId;
});

export const kintoneAppsAtom = atom(async () => {
  const apps = await getAllApps({ guestSpaceId: GUEST_SPACE_ID, debug: !isProd });
  return apps;
});

export const kintoneSpacesAtom = atom<Promise<kintoneAPI.rest.space.GetSpaceResponse[]>>(
  async (get) => {
    const apps = await get(kintoneAppsAtom);
    const spaceIds = [
      ...new Set(apps.filter((app) => app.spaceId).map<string>((app) => app.spaceId as string)),
    ];

    let spaces: kintoneAPI.rest.space.GetSpaceResponse[] = [];
    for (const id of spaceIds) {
      const space = await withSpaceIdFallback({
        spaceId: id,
        func: getSpace,
        funcParams: { id, debug: !isProd },
      });
      spaces.push(space);
    }

    return spaces;
  }
);

export const appFieldsState = atom<Promise<kintoneAPI.FieldProperties>>(async (get) => {
  const app = get(currentAppIdAtom);
  const { properties } = await getFormFields({
    app,
    preview: true,
    guestSpaceId: GUEST_SPACE_ID,
    debug: !isProd,
  });
  const omitted = omitFieldProperties(properties, [...FIELD_TYPES_SYSTEM, 'SUBTABLE']);

  return omitted;
});

export const dstAppPropertiesState = atom<Promise<kintoneAPI.FieldProperties>>(async (get) => {
  const app = get(currentAppIdAtom);
  const { properties } = await getFormFields({
    app,
    preview: true,
    guestSpaceId: GUEST_SPACE_ID,
    debug: !isProd,
  });
  return properties;
});

export const dstAppDynamicFilterPropertiesState = atom<Promise<kintoneAPI.FieldProperty[]>>(
  async (get) => {
    const dstAppProperties = await get(dstAppPropertiesState);
    const filtered = filterFieldProperties(
      dstAppProperties,
      (field) =>
        field.type === 'SINGLE_LINE_TEXT' ||
        field.type === 'NUMBER' ||
        field.type === 'RADIO_BUTTON' ||
        field.type === 'DROP_DOWN' ||
        field.type === 'CHECK_BOX' ||
        field.type === 'CREATOR' ||
        field.type === 'MODIFIER' ||
        field.type === 'STATUS_ASSIGNEE'
    );
    return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  }
);

export const copyableDstAppPropertiesState = atom<Promise<kintoneAPI.FieldProperty[]>>(
  async (get) => {
    const dstAppProperties = await get(dstAppPropertiesState);
    const filtered = filterFieldProperties(
      dstAppProperties,
      (field) =>
        field.type !== 'SUBTABLE' && field.type !== 'GROUP' && field.type !== 'REFERENCE_TABLE'
    );
    return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  }
);

export const targetDstAppPropertiesState = atom<Promise<kintoneAPI.FieldProperty[]>>(
  async (get) => {
    const dstAppProperties = await get(dstAppPropertiesState);
    const filtered = filterFieldProperties(
      dstAppProperties,
      (field) => field.type === 'SINGLE_LINE_TEXT' || field.type === 'NUMBER'
    );
    return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  }
);

export const dstAppSubtablePropertiesState = atom<Promise<kintoneAPI.property.Subtable[]>>(
  async (get) => {
    const dstAppProperties = await get(dstAppPropertiesState);
    const subtables = Object.values(dstAppProperties).filter((field) => field.type === 'SUBTABLE');
    return subtables;
  }
);

export const srcAppPropertiesState = atom<Promise<kintoneAPI.FieldProperty[]>>(async (get) => {
  const srcAppId = get(srcAppIdAtom);
  if (!srcAppId) {
    return [];
  }

  const allApps = await get(kintoneAppsAtom);
  const srcApp = allApps.find((app) => app.appId === srcAppId);
  if (!srcApp) {
    return [];
  }

  let guestSpaceId;
  if (srcApp.spaceId) {
    const spaces = await get(kintoneSpacesAtom);
    const space = spaces.find((s) => s.id === srcApp.spaceId);
    if (space?.isGuest) {
      guestSpaceId = space.id;
    }
  }

  const { properties } = await getFormFields({
    app: srcAppId,
    preview: true,
    guestSpaceId,
    debug: !isProd,
  });
  const filtered = omitFieldProperties(properties, ['GROUP', 'SUBTABLE', 'REFERENCE_TABLE']);

  return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
});

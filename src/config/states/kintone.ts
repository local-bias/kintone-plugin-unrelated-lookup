import { ENV, GUEST_SPACE_ID } from '@/lib/global';
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
import { selector } from 'recoil';
import { dstSubtableFieldCodeState, srcAppIdState } from './plugin';

const PREFIX = 'kintone';

export const kintoneAppsState = selector({
  key: `${PREFIX}kintoneAppsState`,
  get: async ({ get }) => {
    const apps = await getAllApps({
      guestSpaceId: GUEST_SPACE_ID,
      debug: ENV === 'development',
    });
    return apps;
  },
});

export const kintoneSpacesState = selector<kintoneAPI.rest.space.GetSpaceResponse[]>({
  key: `${PREFIX}kintoneSpacesState`,
  get: async ({ get }) => {
    const apps = get(kintoneAppsState);
    const spaceIds = [
      ...new Set(apps.filter((app) => app.spaceId).map<string>((app) => app.spaceId as string)),
    ];

    let spaces: kintoneAPI.rest.space.GetSpaceResponse[] = [];
    for (const id of spaceIds) {
      const space = await withSpaceIdFallback({
        spaceId: id,
        func: getSpace,
        funcParams: { id, debug: true },
      });
      spaces.push(space);
    }

    return spaces;
  },
});

export const appFieldsState = selector<kintoneAPI.FieldProperties>({
  key: `${PREFIX}AppFields`,
  get: async ({ get }) => {
    const app = getAppId();
    if (!app) {
      throw new Error('アプリのフィールド情報が取得できませんでした');
    }
    const { properties } = await getFormFields({
      app,
      preview: true,
      guestSpaceId: GUEST_SPACE_ID,
      debug: ENV === 'development',
    });
    const omitted = omitFieldProperties(properties, [...FIELD_TYPES_SYSTEM, 'SUBTABLE']);

    return omitted;
  },
});

export const dstAppPropertiesState = selector<kintoneAPI.FieldProperties>({
  key: `${PREFIX}dstAppPropertiesState`,
  get: async ({ get }) => {
    const app = getAppId();
    if (!app) {
      throw new Error('アプリのフィールド情報が取得できませんでした');
    }

    const { properties } = await getFormFields({
      app,
      preview: true,
      guestSpaceId: GUEST_SPACE_ID,
      debug: ENV === 'development',
    });

    return properties;
  },
});

export const dstAppDynamicFilterPropertiesState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}dstAppDynamicFilterPropertiesState`,
  get: async ({ get }) => {
    const dstAppProperties = get(dstAppPropertiesState);
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
  },
});

export const copyableDstAppPropertiesState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}copyableDstAppPropertiesState`,
  get: async ({ get }) => {
    const dstAppProperties = get(dstAppPropertiesState);
    const filtered = filterFieldProperties(
      dstAppProperties,
      (field) =>
        field.type !== 'SUBTABLE' && field.type !== 'GROUP' && field.type !== 'REFERENCE_TABLE'
    );
    return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const targetDstAppPropertiesState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}targetDstAppPropertiesState`,
  get: async ({ get }) => {
    const dstAppProperties = get(dstAppPropertiesState);
    const filtered = filterFieldProperties(
      dstAppProperties,
      (field) => field.type === 'SINGLE_LINE_TEXT' || field.type === 'NUMBER'
    );
    return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const dstAppSubtablePropertiesState = selector<kintoneAPI.property.Subtable[]>({
  key: `${PREFIX}dstAppSubtablePropertiesState`,
  get: async ({ get }) => {
    const dstAppProperties = get(dstAppPropertiesState);
    const subtables = Object.values(dstAppProperties).filter((field) => field.type === 'SUBTABLE');
    return subtables;
  },
});

export const dstAppInsubtablePropertiesState = selector<kintoneAPI.property.InSubtable[]>({
  key: `${PREFIX}dstAppInsubtablePropertiesState`,
  get: async ({ get }) => {
    const subtableProperties = get(dstAppSubtablePropertiesState);
    const fieldCode = get(dstSubtableFieldCodeState);
    if (!fieldCode) {
      return [];
    }

    const subtable = subtableProperties.find((field) => field.code === fieldCode);
    if (!subtable) {
      return [];
    }

    const filtered = filterFieldProperties(
      subtable.fields,
      (field) => field.type === 'SINGLE_LINE_TEXT'
    );
    return Object.values(filtered).sort((a, b) =>
      a.label.localeCompare(b.label, 'ja')
    ) as kintoneAPI.property.InSubtable[];
  },
});

export const srcAppPropertiesState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}srcAppPropertiesState`,
  get: async ({ get }) => {
    const srcAppId = get(srcAppIdState);
    if (!srcAppId) {
      return [];
    }

    const allApps = get(kintoneAppsState);
    const srcApp = allApps.find((app) => app.appId === srcAppId);
    if (!srcApp) {
      return [];
    }

    let guestSpaceId;
    if (srcApp.spaceId) {
      const spaces = get(kintoneSpacesState);
      const space = spaces.find((s) => s.id === srcApp.spaceId);
      if (space?.isGuest) {
        guestSpaceId = space.id;
      }
    }

    const { properties } = await getFormFields({
      app: srcAppId,
      preview: true,
      guestSpaceId,
      debug: ENV === 'development',
    });
    const filtered = omitFieldProperties(properties, ['GROUP', 'SUBTABLE', 'REFERENCE_TABLE']);

    return Object.values(filtered).sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

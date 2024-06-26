import { kintoneAPI } from '@konomi-app/kintone-utilities';

export const isTargetEvent = (params: {
  current: kintoneAPI.js.EventType | null;
  targets: kintoneAPI.js.EventType[];
}) => {
  const { current, targets } = params;
  if (!current) {
    return false;
  }
  return targets.some((target) => current === target);
};

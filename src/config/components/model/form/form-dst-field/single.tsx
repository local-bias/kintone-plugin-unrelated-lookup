import { targetDstAppPropertiesState } from '../../../../states/kintone';
import { dstFieldAtom } from '../../../../states/plugin';
import CommonForm from './common';

export default () => (
  <CommonForm appPropertiesAtom={targetDstAppPropertiesState} fieldCodeAtom={dstFieldAtom} />
);

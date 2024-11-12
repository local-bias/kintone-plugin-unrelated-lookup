import { targetDstAppPropertiesState } from '../../../../states/kintone';
import { dstFieldState } from '../../../../states/plugin';
import CommonForm from './common';

export default () => (
  <CommonForm appPropertiesState={targetDstAppPropertiesState} fieldCodeState={dstFieldState} />
);

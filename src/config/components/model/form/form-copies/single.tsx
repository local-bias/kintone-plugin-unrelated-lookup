import { copyableDstAppPropertiesState } from '../../../../states/kintone';
import { copiesState } from '../../../../states/plugin';
import CommonForm from './common';

export default () => (
  <CommonForm appPropertiesState={copyableDstAppPropertiesState} copiesState={copiesState} />
);

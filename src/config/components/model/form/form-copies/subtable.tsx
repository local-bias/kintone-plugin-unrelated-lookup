import { dstAppInsubtablePropertiesState } from '../../../../states/kintone';
import { insubtableCopiesState } from '../../../../states/plugin';
import CommonForm from './common';

export default () => (
  <CommonForm
    appPropertiesState={dstAppInsubtablePropertiesState}
    copiesState={insubtableCopiesState}
  />
);
